from django.urls import path
from . import views

urlpatterns = [
    path('', views.welcome, name='welcome'),
    path('register/', views.register, name='register'),
    path('login/', views.auth, name='login'),
    path('auth/', views.auth, name='auth'),
    path('home/', views.home, name='home'),
    path('logout/', views.logout_view, name='logout'),
    path('products/', views.products, name='products'),
    path('placement/', views.placement, name='placement'),
    path('supplies/', views.supplies, name='supplies'),
    path('shipment/', views.shipment, name='shipment'),
    path('orders/', views.orders, name='orders'),
    path('create_order/', views.create_order, name='create_order'),
    path('delete_orders/', views.delete_orders, name='delete_orders'),
    path('edit_order/', views.edit_order, name='edit_order'),
    path('generate_invoice/', views.generate_invoice, name='generate_invoice'),
]
