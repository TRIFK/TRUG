from django import forms
from django.contrib.auth.models import User, Group
from django.contrib.auth.forms import UserCreationForm
from .models import Order, Product, OrderProduct

class RegistrationForm(UserCreationForm):
    group = forms.ModelChoiceField(queryset=Group.objects.all(), required=True, label="Группа")

    class Meta:
        model = User
        fields = ('username', 'password1', 'password2', 'group')


class OrderForm(forms.ModelForm):
    products = forms.ModelMultipleChoiceField(
        queryset=Product.objects.all(),
        widget=forms.CheckboxSelectMultiple,
        required=False
    )

    class Meta:
        model = Order
        fields = ['customer', 'summary', 'date_ordered', 'products']

    def __init__(self, *args, **kwargs):
        super(OrderForm, self).__init__(*args, **kwargs)
        self.fields['products'].queryset = Product.objects.all()

    def save(self, commit=True):
        order = super(OrderForm, self).save(commit=False)
        if commit:
            order.save()
            # Сохранение связанных продуктов в OrderProduct
            selected_products = self.cleaned_data['products']
            for product in selected_products:
                OrderProduct.objects.create(order=order, product=product, quantity=0)
        return order

class EditOrderForm(forms.ModelForm):
    products = forms.ModelMultipleChoiceField(
        queryset=Product.objects.all(),
        widget=forms.CheckboxSelectMultiple,
        required=False
    )

    class Meta:
        model = Order
        fields = ['customer', 'summary', 'date_ordered', 'products']

    def __init__(self, *args, **kwargs):
        super(EditOrderForm, self).__init__(*args, **kwargs)
        self.fields['products'].queryset = Product.objects.all()

    def save(self, commit=True):
        order = super(EditOrderForm, self).save(commit=False)
        if commit:
            order.save()
            # Удаляем старые связанные продукты и сохраняем новые
            OrderProduct.objects.filter(order=order).delete()
            selected_products = self.cleaned_data['products']
            for product in selected_products:
                OrderProduct.objects.create(order=order, product=product, quantity=1)  # Пример количества
        return order

