"""
Database connection setup for the Smart Guided Onboarding System.
Supports PostgreSQL (production) and SQLite (development fallback).
"""

import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite+aiosqlite:///./onboarding.db"
)

# Create async engine
engine = create_async_engine(
    DATABASE_URL,
    echo=True,  # SQL logging — disable in production
    future=True,
)

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
