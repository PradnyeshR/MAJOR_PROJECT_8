"""
FastAPI application entry point for the Smart Guided Onboarding System.

Features:
  - CORS middleware for frontend dev server
  - Auto table creation on startup
  - Demo user seeding
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select

from app.database import init_db, async_session
from app.models import User, OnboardingProgress, UserRole
from app.routes.onboarding import router as onboarding_router


async def seed_demo_users():
    """Seed the database with demo users if they don't exist yet."""
    async with async_session() as db:
        result = await db.execute(select(User))
        if result.scalars().first() is not None:
            return  # Already seeded

        admin = User(username="pradnyesh_admin", role=UserRole.admin)
        standard = User(username="pradnyesh_standard", role=UserRole.standard)
        db.add_all([admin, standard])
        await db.commit()

        # Create initial onboarding progress for each
        for user in [admin, standard]:
            await db.refresh(user)
            progress = OnboardingProgress(
                user_id=user.id,
                current_step=0,
                is_completed=False,
                completed_steps=[],
            )
            db.add(progress)
        await db.commit()
        print("✅ Demo users seeded: pradnyesh_admin (admin), pradnyesh_standard (standard)")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle."""
    await init_db()
    await seed_demo_users()
    yield


app = FastAPI(
    title="Smart Guided Onboarding API",
    description="Backend for the guided onboarding tour system",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──────────────────────────────────────────────────────────────────
app.include_router(onboarding_router)


# ── Utility Routes ───────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "service": "Smart Guided Onboarding API"}


@app.get("/api/users", tags=["Users"])
async def list_users():
    """List all users (for the user selector in the frontend)."""
    async with async_session() as db:
        result = await db.execute(select(User))
        users = result.scalars().all()
        return [
            {"id": u.id, "username": u.username, "role": u.role.value}
            for u in users
        ]
