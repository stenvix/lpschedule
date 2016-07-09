"""empty message

Revision ID: b41b31d90c39
Revises: c32c4f948270
Create Date: 2016-07-09 13:56:57.298035

"""

# revision identifiers, used by Alembic.
revision = 'b41b31d90c39'
down_revision = 'c32c4f948270'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('lesson', sa.Column('active', sa.Boolean(), nullable=True))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('lesson', 'active')
    ### end Alembic commands ###