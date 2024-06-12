from django.urls import path
from . import views


from django.urls import path
from . import views

urlpatterns = [
    path('', views.welcome, name='welcome'),
    path('register/', views.register, name='register'),
    path('auth/', views.auth, name='auth'),
    path('home', views.home, name='home'),
    path('logout/', views.logout_view, name='logout'),
    path('products/', views.products, name='products'),
    path('placement/', views.placement, name='placement'),
    path('supplies/', views.supplies, name='supplies'),
    path('shipment/', views.shipment, name='shipment'),
    path('orders/', views.orders, name='orders'),
]
