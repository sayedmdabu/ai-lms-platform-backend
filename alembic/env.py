# File: backend/alembic/env.py
import asyncio
from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context

# ----------------- CUSTOM IMPORTS START -----------------
# আমাদের কনফিগারেশন এবং মডেলগুলো ইমপোর্ট করছি
from app.core.config import settings
from app.core.database import Base
from app.models.user import User  # User মডেল অবশ্যই ইমপোর্ট করতে হবে
# ----------------- CUSTOM IMPORTS END -------------------

# Alembic Config অবজেক্ট
config = context.config

# লগিং কনফিগারেশন সেটআপ
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# টার্গেট মেটাডাটা সেট করা (যাতে Alembic টেবিল চিনতে পারে)
target_metadata = Base.metadata

# .env থেকে ডাটাবেস URL নেওয়া
# আমরা settings.DATABASE_URL ব্যবহার করছি যাতে কোডে হার্ডকোড না থাকে
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()

async def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    configuration = config.get_section(config.config_ini_section)
    configuration["sqlalchemy.url"] = settings.DATABASE_URL

    connectable = async_engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()

if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())