from django.db import models

# Create your models here.

from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=100)
    product_type = models.ForeignKey('ProductType', on_delete=models.CASCADE)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField(default=0)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Продукция'
        verbose_name_plural = 'Продукции'

class ProductType(models.Model):
    name = models.CharField(max_length=100)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Тип-продукции'
        verbose_name_plural = 'Типы-продукции'



class SupplyProduct(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()

    def __str__(self):
        return f"Поставка продукта '{self.product.name}' в количестве {self.quantity}"

    class Meta:
        verbose_name = 'Продукт поставки'
        verbose_name_plural = 'Продукты поставок'

class ShipmentProduct(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()

    def __str__(self):
        return f"Отгрузка продукта '{self.product.name}' в количестве {self.quantity}"

    class Meta:
        verbose_name = 'Продукт отгрузки'
        verbose_name_plural = 'Продукты отгрузок'

class OrderProduct(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)

    def __str__(self):
        return f"Продукт заказа '{self.product.name}' в количестве {self.quantity}"

    class Meta:
        verbose_name = 'Продукт заказа'
        verbose_name_plural = 'Продукты заказов'

class Supply(models.Model):
    supplier = models.CharField(max_length=100)
    products = models.ManyToManyField(SupplyProduct, related_name='supply')
    quantity = models.IntegerField()
    date_supplied = models.DateField()

    def __str__(self):
        return f"Поставка от {self.supplier}"

    class Meta:
        verbose_name = 'Поставка'
        verbose_name_plural = 'Поставки'

class Shipment(models.Model):
    customer = models.CharField(max_length=100)
    products = models.ManyToManyField(ShipmentProduct, related_name='shipment')
    quantity = models.IntegerField()
    date_shipped = models.DateField()

    def __str__(self):
        return f"Отгрузка для {self.customer}"

    class Meta:
        verbose_name = 'Отгрузка'
        verbose_name_plural = 'Отгрузки'

class Order(models.Model):
    customer = models.CharField(max_length=100)
    products = models.ManyToManyField(OrderProduct, related_name='products')
    summary = models.IntegerField()
    date_ordered = models.DateField()
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"Заказ от {self.customer}"

    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'


class Shelf(models.Model):
    shelf_letter = models.CharField(max_length=1, unique=True)

    def __str__(self):
        return f"Полка {self.shelf_letter}"

    class Meta:
        verbose_name = 'Полка'
        verbose_name_plural = 'Полки'

class Location(models.Model):
    place_number = models.IntegerField()

    def __str__(self):
        return f"Место {self.place_number}"

    class Meta:
        verbose_name = 'Место'
        verbose_name_plural = 'Места'

class ShelfLocation(models.Model):
    shelf = models.ForeignKey(Shelf, on_delete=models.CASCADE)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.shelf} - {self.location}"

    class Meta:
        unique_together = ('shelf', 'location')
        verbose_name = 'Местоположение на полке'
        verbose_name_plural = 'Местоположения на полках'


class ProductLocation(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    shelf_location = models.ForeignKey(ShelfLocation, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.product} на {self.shelf_location}"

    class Meta:
        unique_together = ('product', 'shelf_location')
        verbose_name = 'Местоположение продукта'
        verbose_name_plural = 'Местоположения продуктов'

