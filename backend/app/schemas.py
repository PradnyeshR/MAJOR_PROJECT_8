"""
Pydantic schemas for request/response validation.
"""

from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


# ── User Schemas ──────────────────────────────────────────────────────────────

class UserOut(BaseModel):
    id: int
    username: str
    role: str

    class Config:
        from_attributes = True


# ── Onboarding Schemas ───────────────────────────────────────────────────────

class OnboardingProgressOut(BaseModel):
    """Response schema for onboarding progress."""
    user_id: int
    username: str
    role: str
    current_step: int
    is_completed: bool
    completed_steps: List[str]
    last_updated: Optional[datetime] = None

    class Config:
        from_attributes = True


class OnboardingUpdateRequest(BaseModel):
    """Request schema for updating onboarding step."""
    current_step: int = Field(..., ge=0, description="The step the user is now on")
    completed_step: str = Field(
        ...,
        min_length=1,
        description="ID of the step just completed (e.g., 'tour-step-sidebar')"
    )


class OnboardingCompleteRequest(BaseModel):
    """Request schema for marking onboarding as complete."""
    skipped: bool = Field(
        default=False,
        description="True if the user skipped the tour rather than finishing it"
    )


class MessageResponse(BaseModel):
    """Generic message response."""
    message: str
    success: bool = True
