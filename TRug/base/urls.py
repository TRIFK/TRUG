from django.urls import path
from . import views
from django.urls import path
from . import views


from django.urls import path
from . import views

urlpatterns = [
    path('', views.welcome, name='welcome'),
    path('register/', views.register, name='register'),
    path('auth/', views.auth, name='auth'),
    path('home', views.home, name='home'),
]
