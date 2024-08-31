from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from datetime import datetime, timedelta

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import ExpenseSerializer, ExpenseCategorySerializer, UserSerializer
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

@api_view(['POST'])
def userRegistration(request):
  serializer = UserSerializer(data=request.data)
  if serializer.is_valid():
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)
  return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getExpenses(request):
  user = request.user
  expenses = user.expense_set.all().order_by('expense_date')
  serializer = ExpenseSerializer(expenses, many=True)
  return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getFilteredExpenses(request):
  daysBack = request.query_params.get('date', None)
  if (daysBack == 'all'):
    print('all')
    user = request.user
    expenses = user.expense_set.all().order_by('expense_date')
  else:
    try: 
      numOfDaysBack = int(daysBack)
      startDate = datetime.now().date() - timedelta(days=numOfDaysBack)
      expenses = request.user.expense_set.filter(expense_date__gte=startDate).order_by('expense_date')
      print(startDate)
      print(expenses) 
    except ValueError:
      return Response({'error': 'Invalid value for parameter "date"'}, status=status.HTTP_400_BAD_REQUEST)
  serializer = ExpenseSerializer(expenses, many=True)
  return Response(serializer.data, status=status.HTTP_200_OK)

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

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def updateExpense(request):
  user = request.user
  expenseId = request.query_params.get('expense-id')
  data = request.data

  if not expenseId:
    return Response({"error": "Expense ID not provided"}, status=status.HTTP_400_BAD_REQUEST)
  
  try:
    expense = Expense.objects.get(id=expenseId, user=user)
  except Expense.DoesNotExist:
    return Response({"error": "Expense not found"}, status=status.HTTP_404_NOT_FOUND)
  
  # get the value of 'newExpense' key in request body and second param in below func represents og value of expense in db acting as a fallback just in case 'newExpense' is null therefore updating the data with the old value
  expense.expense = data.get('newExpense', expense.expense)
  expense.expense_date = data.get('newExpenseDate', expense.expense_date)
  expense.save()
  
  return Response({"message": "Expense updated successfully", "expense": ExpenseSerializer(expense).data})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteExpense(request):
  user = request.user
  expenseId = request.query_params.get('expense-id')

  if not expenseId:
    return Response({"error": "Expense ID not provided"}, status=status.HTTP_400_BAD_REQUEST)
  
  try:
    expenseToDel = Expense.objects.get(id=expenseId, user=user)
    expenseToDel.delete()
    return Response({"message": "Expense successfully deleted"}, status=status.HTTP_200_OK)
  except Expense.DoesNotExist:
    return Response({"error": "Expense not found"}, status=status.HTTP_404_NOT_FOUND)
  except Exception as e:
    return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
  
   