from django.db import models
from django.contrib.auth.models import User
from datetime import date

# Create your models here.
class ExpenseCategory(models.Model):
  CATEGORY_CHOICES = (
        ('food', 'Food'),
        ('transportation', 'Transportation'),
        ('housing', 'Housing'),
        ('utilities', 'Utilities'),
        ('entertainment', 'Entertainment'),
        ('education', 'Education'),
        ('medical', 'Medical'),
        ('others', 'Others'),
  )
  categories = models.CharField(max_length=100, choices=CATEGORY_CHOICES)
  def __str__(self):
    return self.get_categories_display()
  
  
class Expense(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
  expense = models.DecimalField(max_digits=10, decimal_places=2)
  expense_category = models.ForeignKey(ExpenseCategory, on_delete=models.CASCADE)
  expense_date = models.DateField(default=date.today)
  def __str__(self):
    return f'{self.user.username} - {self.expense} - {self.expense_date.strftime('%m-%d-%Y')}'
