"""Use Gmail threads for creator workflow and remove public deal tokens."""

import sqlalchemy as sa

from alembic import op

revision = "20260630_06"
down_revision = "20260629_05"
branch_labels = None
depends_on = None


def _columns(table: str) -> set[str]:
    return {column["name"] for column in sa.inspect(op.get_bind()).get_columns(table)}


def upgrade() -> None:
    message_columns = _columns("deal_messages")
    if "provider_thread_id" not in message_columns:
        op.add_column("deal_messages", sa.Column("provider_thread_id", sa.String(255)))
        op.create_index(
            "ix_deal_messages_provider_thread_id",
            "deal_messages",
            ["provider_thread_id"],
        )
    if "acceptance_token" in _columns("deals"):
        with op.batch_alter_table("deals") as batch:
            batch.drop_column("acceptance_token")
    with op.batch_alter_table("campaigns") as batch:
        batch.alter_column(
            "operation_mode",
            existing_type=sa.String(50),
            server_default="full_autonomy",
            existing_nullable=False,
        )


def downgrade() -> None:
    with op.batch_alter_table("campaigns") as batch:
        batch.alter_column(
            "operation_mode",
            existing_type=sa.String(50),
            server_default="strategy_creators",
            existing_nullable=False,
        )
    with op.batch_alter_table("deals") as batch:
        batch.add_column(sa.Column("acceptance_token", sa.String(64), nullable=True))
    if "provider_thread_id" in _columns("deal_messages"):
        op.drop_index("ix_deal_messages_provider_thread_id", table_name="deal_messages")
        op.drop_column("deal_messages", "provider_thread_id")
