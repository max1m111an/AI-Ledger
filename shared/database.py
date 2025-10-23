import os

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel


def _build_db_url():
    required = ["DB_SCHEME", "DB_HOST"]
    if any(not os.getenv(var) for var in required):
        raise ValueError(f"Missing required env vars: {required}")

    scheme = os.getenv("DB_SCHEME")
    user = os.getenv("DB_USER")
    password = os.getenv("DB_PASS")
    host = os.getenv("DB_HOST")
    port = os.getenv("DB_PORT", "3306")
    name = os.getenv("DB_NAME", "")

    return f"{scheme}://{user}:{password}@{host}:{port}/{name}"


engine = create_async_engine(_build_db_url(), echo=True, future=True)


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


async def get_session() -> AsyncSession:
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with async_session() as session:
        yield session
