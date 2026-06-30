"""Add conversion outcomes for affiliate payouts.

Conditional because the baseline migration creates from current metadata.
"""

import sqlalchemy as sa

from alembic import op

revision = "20260629_04"
down_revision = "20260629_03"
branch_labels = None
depends_on = None


def _columns(table: str) -> set[str]:
    return {column["name"] for column in sa.inspect(op.get_bind()).get_columns(table)}


def upgrade() -> None:
    if "actual_conversions" not in _columns("campaigns"):
        op.add_column(
            "campaigns",
            sa.Column(
                "actual_conversions",
                sa.Integer(),
                server_default="0",
                nullable=False,
            ),
        )


def downgrade() -> None:
    if "actual_conversions" in _columns("campaigns"):
        op.drop_column("campaigns", "actual_conversions")
