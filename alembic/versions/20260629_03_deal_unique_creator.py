"""Add a unique (campaign_id, creator_id) constraint to deals.

Discovery already de-duplicates by querying for an existing deal, but a unique
constraint makes the invariant authoritative and closes a concurrent-discovery
race. Conditional so fresh installs and upgrades stay compatible.
"""

import sqlalchemy as sa

from alembic import op

revision = "20260629_03"
down_revision = "20260629_02"
branch_labels = None
depends_on = None


def _unique_constraints(table: str) -> set[str]:
    return {
        constraint["name"]
        for constraint in sa.inspect(op.get_bind()).get_unique_constraints(table)
        if constraint.get("name")
    }


def upgrade() -> None:
    constraints = _unique_constraints("deals")
    if "uq_deal_campaign_creator" not in constraints:
        with op.batch_alter_table("deals") as batch:
            batch.create_unique_constraint(
                "uq_deal_campaign_creator", ["campaign_id", "creator_id"]
            )


def downgrade() -> None:
    constraints = _unique_constraints("deals")
    if "uq_deal_campaign_creator" in constraints:
        with op.batch_alter_table("deals") as batch:
            batch.drop_constraint("uq_deal_campaign_creator", type_="unique")
