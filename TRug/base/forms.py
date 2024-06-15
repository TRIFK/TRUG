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
    class Meta:
        model = Order
        fields = ['customer', 'summary', 'date_ordered']

    products = forms.ModelMultipleChoiceField(
        queryset=Product.objects.all(),
        widget=forms.CheckboxSelectMultiple
    )
    quantities = forms.CharField(widget=forms.HiddenInput(), required=False)

    def __init__(self, *args, **kwargs):
        super(OrderForm, self).__init__(*args, **kwargs)
        self.fields['products'].queryset = Product.objects.all()

    def save(self, commit=True):
        order = super(OrderForm, self).save(commit=False)
        if commit:
            order.save()
            products = self.cleaned_data['products']
            quantities = self.cleaned_data['quantities']
            for product, quantity in zip(products, quantities):
                OrderProduct.objects.create(order=order, product=product, quantity=quantity)
        return order