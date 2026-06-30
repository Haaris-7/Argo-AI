"""Add measured payout lifecycle fields.

The baseline migration creates from current metadata, so every operation is conditional.
That keeps fresh installs and upgrades from the original hackathon schema compatible.
"""

import sqlalchemy as sa

from alembic import op

revision = "20260629_02"
down_revision = "20260629_01"
branch_labels = None
depends_on = None


def _columns(table: str) -> set[str]:
    return {column["name"] for column in sa.inspect(op.get_bind()).get_columns(table)}


def _unique_constraints(table: str) -> set[str]:
    return {
        constraint["name"]
        for constraint in sa.inspect(op.get_bind()).get_unique_constraints(table)
        if constraint.get("name")
    }


def upgrade() -> None:
    if "metrics_recorded" not in _columns("campaigns"):
        op.add_column(
            "campaigns",
            sa.Column("metrics_recorded", sa.Boolean(), server_default=sa.false(), nullable=False),
        )

    payout_columns = _columns("payouts")
    with op.batch_alter_table("payouts") as batch:
        if "payout_model" not in payout_columns:
            batch.add_column(
                sa.Column(
                    "payout_model",
                    sa.String(length=30),
                    server_default="flat",
                    nullable=False,
                )
            )
        if "component" not in payout_columns:
            batch.add_column(
                sa.Column("component", sa.String(length=30), server_default="base", nullable=False)
            )
        if "measured_metric" not in payout_columns:
            batch.add_column(sa.Column("measured_metric", sa.Integer(), nullable=True))

    constraints = _unique_constraints("payouts")
    with op.batch_alter_table("payouts") as batch:
        if "uq_payout_deal" in constraints:
            batch.drop_constraint("uq_payout_deal", type_="unique")
        if "uq_payout_deal_component" not in constraints:
            batch.create_unique_constraint("uq_payout_deal_component", ["deal_id", "component"])


def downgrade() -> None:
    constraints = _unique_constraints("payouts")
    with op.batch_alter_table("payouts") as batch:
        if "uq_payout_deal_component" in constraints:
            batch.drop_constraint("uq_payout_deal_component", type_="unique")
        if "uq_payout_deal" not in constraints:
            batch.create_unique_constraint("uq_payout_deal", ["deal_id"])

    payout_columns = _columns("payouts")
    with op.batch_alter_table("payouts") as batch:
        for column in ("measured_metric", "component", "payout_model"):
            if column in payout_columns:
                batch.drop_column(column)
    if "metrics_recorded" in _columns("campaigns"):
        op.drop_column("campaigns", "metrics_recorded")
