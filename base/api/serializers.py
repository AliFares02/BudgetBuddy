from rest_framework import serializers
from base.models import Expense, ExpenseCategory

class ExpenseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseCategory
        fields = ['categories']

class ExpenseSerializer(serializers.ModelSerializer):
    expense_category = serializers.CharField(source='expense_category.categories') 

    class Meta:
        model = Expense
        fields = '__all__'
