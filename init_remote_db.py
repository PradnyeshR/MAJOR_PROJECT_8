import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import select

# We will use the models from the user's project
import sys
sys.path.insert(0, "/Users/pradnyeshajaykumarravane/8bitsquad/EDI 8/backend")
from app.models import User, OnboardingProgress, UserRole
from app.database import Base

DATABASE_URL = "postgresql+asyncpg://neondb_owner:npg_cQBkv7SnR2mF@ep-dawn-cell-aq7iz6ik.c-8.us-east-1.aws.neon.tech/neondb"

engine = create_async_engine(DATABASE_URL, echo=True, future=True)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def init_db():
    async with engine.begin() as conn:
        print("Creating tables...")
        await conn.run_sync(Base.metadata.create_all)
        print("Tables created.")

async def seed_demo_users():
    async with async_session() as db:
        result = await db.execute(select(User))
        if result.scalars().first() is not None:
            print("Users already seeded.")
            return

        admin = User(username="pradnyesh_admin", role=UserRole.admin)
        standard = User(username="pradnyesh_standard", role=UserRole.standard)
        db.add_all([admin, standard])
        await db.commit()

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
        print("Demo users seeded.")

async def main():
    try:
        await init_db()
        await seed_demo_users()
    finally:
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(main())
