from rest_framework import serializers
from base.models import Expense, ExpenseCategory
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

class ExpenseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseCategory
        fields = ['categories']

class ExpenseSerializer(serializers.ModelSerializer):
    expense_category = serializers.CharField(source='expense_category.categories') 

    class Meta:
        model = Expense
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    def validate_password(self, value):
        # send the password to djangos validate_password for validation and return if valid else return error
        validate_password(value)
        return value
    def create(self, validated_data):
        # Extract and remove password from validated_data
        password = validated_data.pop('password')
        # Create user with validated_data
        user = User.objects.create_user(**validated_data, password=password)
        return user
