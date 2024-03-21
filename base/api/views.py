from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import ExpenseSerializer, ExpenseCategorySerializer
from base.models import ExpenseCategory, Expense

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token
class MyTokenObtainPairView(TokenObtainPairView):
   serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
def getRoutes(request):
  routes = [
    '/api/token',
    '/api/token/refresh'
  ]
  return JsonResponse(routes, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getExpenses(request):
  user = request.user
  expenses = user.expense_set.all()
  serializer = ExpenseSerializer(expenses, many=True)
  return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createExpense(request):
  user = request.user
  data = request.data
  expense_category = get_object_or_404(ExpenseCategory, categories=data['expense_category'])
  expense =  Expense.objects.create(
    user=user,
    expense = data['expense'],
    expense_category=expense_category,
    expense_date = data['date']
  )
  serializer = ExpenseSerializer(expense)
  return Response({"message": "Expense created successfully", "expense": serializer.data}, status=status.HTTP_201_CREATED)