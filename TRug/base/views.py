from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.models import User, Group
from .forms import RegistrationForm



def auth(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            # Добавить сообщение об ошибке или обработку
            return render(request, 'auth.html', {'error': 'Неверные учетные данные'})
    return render(request, 'auth.html')


def welcome(request):
    return render(request, 'welcome.html')

# Existing views
def register(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            try:
                user = form.save(commit=False)
                user.save()
                group = form.cleaned_data.get('group')
                user.groups.add(group)
                user = authenticate(username=form.cleaned_data['username'], password=form.cleaned_data['password1'])
                if user is not None:
                    login(request, user)
                    return redirect('home')
                else:
                    return render(request, 'register.html', {'form': form, 'error': 'Ошибка аутентификации'})
            except Exception as e:
                return render(request, 'register.html', {'form': form, 'error': f'Ошибка при сохранении пользователя: {str(e)}'})
        else:
            groups = Group.objects.all()

            # Вывод ошибок формы для отладки
            print(form.errors)
            return render(request, 'register.html', {'form': form, 'error': 'Форма не валидна', 'groups': groups})
    else:
        form = RegistrationForm()

    groups = Group.objects.all()
    context = {'form': form, 'groups': groups}
    return render(request, 'register.html', context)




def home(request):
    return render(request, 'home.html')


