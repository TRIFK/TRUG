# Generated by Django 5.0.6 on 2024-06-16 00:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0005_order_quantity_alter_order_products_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='quantity',
        ),
    ]
