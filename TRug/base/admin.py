from django.contrib import admin

# Register your models here.

from django.contrib import admin
from .models import Product, ProductType, SupplyProduct, ShipmentProduct, OrderProduct, Order, Supply, Shipment, Shelf, Location, ShelfLocation, ProductLocation

class SupplyAdmin(admin.ModelAdmin):
    filter_horizontal = ['products']

class OrderAdmin(admin.ModelAdmin):
    filter_horizontal = ['products']
    list_display = ('customer', 'summary', 'date_ordered', 'completed')
    list_filter = ('completed',)
    search_fields = ('customer',)
class ShipmentAdmin(admin.ModelAdmin):
    filter_horizontal = ['products']


admin.site.register(Product)
admin.site.register(ProductType)
admin.site.register(SupplyProduct)
admin.site.register(ShipmentProduct)
admin.site.register(OrderProduct)
admin.site.register(Order, OrderAdmin)
admin.site.register(Supply,  SupplyAdmin)
admin.site.register(Shipment, ShipmentAdmin)
admin.site.register(Location)
admin.site.register(Shelf)
admin.site.register(ShelfLocation)
admin.site.register(ProductLocation)