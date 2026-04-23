"""
Onboarding API routes.

Endpoints:
  GET  /api/onboarding/{user_id}          — Fetch progress + role
  POST /api/onboarding/{user_id}/update   — Update step
  POST /api/onboarding/{user_id}/complete — Mark complete / skipped
"""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import User, OnboardingProgress
from app.schemas import (
    OnboardingProgressOut,
    OnboardingUpdateRequest,
    OnboardingCompleteRequest,
    MessageResponse,
)

router = APIRouter(prefix="/api/onboarding", tags=["Onboarding"])


# ── Helpers ──────────────────────────────────────────────────────────────────

async def _get_user_with_progress(
    user_id: int, db: AsyncSession
) -> tuple[User, OnboardingProgress]:
    """Fetch user + their onboarding progress, creating progress if missing."""
    result = await db.execute(
        select(User)
        .options(selectinload(User.onboarding))
        .where(User.id == user_id)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found",
        )

    # Auto-create onboarding progress row if it doesn't exist yet
    if not user.onboarding:
        progress = OnboardingProgress(
            user_id=user.id,
            current_step=0,
            is_completed=False,
            completed_steps=[],
        )
        db.add(progress)
        await db.commit()
        await db.refresh(progress)
        user.onboarding = progress

    return user, user.onboarding


# ── Routes ───────────────────────────────────────────────────────────────────

@router.get("/{user_id}", response_model=OnboardingProgressOut)
async def get_onboarding_progress(user_id: int, db: AsyncSession = Depends(get_db)):
    """Fetch the current onboarding progress and role of a user."""
    user, progress = await _get_user_with_progress(user_id, db)

    return OnboardingProgressOut(
        user_id=user.id,
        username=user.username,
        role=user.role.value,
        current_step=progress.current_step,
        is_completed=progress.is_completed,
        completed_steps=progress.completed_steps or [],
        last_updated=progress.last_updated,
    )


@router.post("/{user_id}/update", response_model=OnboardingProgressOut)
async def update_onboarding_step(
    user_id: int,
    payload: OnboardingUpdateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Update the current step and mark a specific step as completed."""
    user, progress = await _get_user_with_progress(user_id, db)

    progress.current_step = payload.current_step

    # Append newly completed step (avoid duplicates)
    completed = list(progress.completed_steps or [])
    if payload.completed_step not in completed:
        completed.append(payload.completed_step)
    progress.completed_steps = completed
    progress.last_updated = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(progress)

    return OnboardingProgressOut(
        user_id=user.id,
        username=user.username,
        role=user.role.value,
        current_step=progress.current_step,
        is_completed=progress.is_completed,
        completed_steps=progress.completed_steps,
        last_updated=progress.last_updated,
    )


@router.post("/{user_id}/complete", response_model=MessageResponse)
async def complete_onboarding(
    user_id: int,
    payload: OnboardingCompleteRequest = OnboardingCompleteRequest(),
    db: AsyncSession = Depends(get_db),
):
    """Mark onboarding as completed (or skipped)."""
    user, progress = await _get_user_with_progress(user_id, db)

    progress.is_completed = True
    progress.last_updated = datetime.now(timezone.utc)

    await db.commit()

    action = "skipped" if payload.skipped else "completed"
    return MessageResponse(
        message=f"Onboarding {action} for user '{user.username}'",
        success=True,
    )


@router.post("/{user_id}/reset", response_model=MessageResponse)
async def reset_onboarding(
    user_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Reset onboarding progress so the tour can be restarted."""
    user, progress = await _get_user_with_progress(user_id, db)

    progress.current_step = 0
    progress.is_completed = False
    progress.completed_steps = []
    progress.last_updated = datetime.now(timezone.utc)

    await db.commit()

    return MessageResponse(
        message=f"Onboarding reset for user '{user.username}'",
        success=True,
    )

