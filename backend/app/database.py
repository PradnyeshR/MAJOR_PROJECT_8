"""
Database connection setup for the Smart Guided Onboarding System.
Supports PostgreSQL (production) and SQLite (development fallback).
"""

import os
import ssl as ssl_module
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite+aiosqlite:///./onboarding.db"
).strip()

# ── Prepare engine kwargs (handle asyncpg + SSL for cloud Postgres) ──────────
engine_kwargs = {
    "future": True,
}

if "postgresql" in DATABASE_URL or "postgres" in DATABASE_URL:
    # Some providers give postgres:// — SQLAlchemy needs postgresql://
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)

    # asyncpg does NOT understand ?sslmode=require in the URL.
    # Strip it and pass ssl via connect_args instead.
    if "?" in DATABASE_URL:
        DATABASE_URL = DATABASE_URL.split("?")[0]

    ssl_ctx = ssl_module.create_default_context()
    ssl_ctx.check_hostname = False
    ssl_ctx.verify_mode = ssl_module.CERT_NONE
    engine_kwargs["connect_args"] = {"ssl": ssl_ctx}
else:
    # SQLite — enable SQL logging for local dev
    engine_kwargs["echo"] = True

# Create async engine
engine = create_async_engine(DATABASE_URL, **engine_kwargs)

# Session factory
async_session = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    """Declarative base for all ORM models."""
    pass


async def get_db():
    """Dependency that yields an async database session."""
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db():
    """Create all tables on startup."""
    async with engine.begin() as conn:
        from app.models import User, OnboardingProgress  # noqa: F401
        await conn.run_sync(Base.metadata.create_all)
