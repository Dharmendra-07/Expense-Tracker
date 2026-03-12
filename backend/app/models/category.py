from ..database import db


class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    color = db.Column(db.String(7), nullable=False, default="#6b7280")

    expenses = db.relationship("Expense", back_populates="category", lazy="dynamic")

    def __repr__(self):
        return f"<Category {self.name}>"
