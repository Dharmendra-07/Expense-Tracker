from datetime import date as date_type
from ..database import db


class Expense(db.Model):
    __tablename__ = "expenses"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    date = db.Column(db.Date, nullable=False, default=date_type.today)
    note = db.Column(db.Text, nullable=True)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=False)

    category = db.relationship("Category", back_populates="expenses")

    def __repr__(self):
        return f"<Expense {self.title} {self.amount}>"
