from django.urls import path
from . import views
from . import bls_api_view
from .views import MyTokenObtainPairView

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
  path('', views.getRoutes),
  path('expenses/', views.getExpenses),
  path('create-expense/', views.createExpense),
  path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
  path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
  path('inflation-data/', bls_api_view.inflationDataApiProxy),
  path('register/', views.userRegistration)
]