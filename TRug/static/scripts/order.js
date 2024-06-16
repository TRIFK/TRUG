document.addEventListener('DOMContentLoaded', function() {
    const addOrderButton = document.getElementById('add-order-button');
    const addOrderModal = document.getElementById('add-order-modal');
    const addOrderForm = document.getElementById('add-order-form');
    const productFields = document.getElementById('product-fields');
    const addProductButton = document.getElementById('add-product');
    const EditOrderModal = document.getElementById('edit-order-modal');
    const EditOrderForm = document.getElementById('edit-order-form');
    const closeModalButtons = document.querySelectorAll('.close');



     addOrderButton.addEventListener('click', function() {
        addOrderModal.style.display = 'block';
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            addOrderModal.style.display = 'none';
        });
    });


    // Проверяем, что данные загружены
    if (!Array.isArray(productsData) || productsData.length === 0) {
        console.error('Ошибка: данные о продуктах не загружены или пустой массив.');
    }

    addProductButton.addEventListener('click', function() {
        const newProductField = document.createElement('div');
        newProductField.classList.add('product-field');

        const selectElement = document.createElement('select');
        selectElement.name = 'products_product';
        selectElement.required = true;

        // Добавляем опции в селект из переменной productsData
        if (typeof productsData !== 'undefined' && Array.isArray(productsData)) {
            productsData.forEach(product => {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = product.name;
                selectElement.appendChild(option);
            });
        } else {
            console.error('Ошибка: данные о продуктах не загружены.');
            return; // Прекращаем выполнение функции, если данные о продуктах не загружены
        }

        const quantityLabel = document.createElement('label');
        quantityLabel.setAttribute('for', 'product-quantity');
        quantityLabel.textContent = 'Количество:';

        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.name = 'product_quantities';
        quantityInput.min = '1';
        quantityInput.required = true;

        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.classList.add('remove-product');
        removeButton.textContent = 'Удалить';

        newProductField.appendChild(selectElement);
        newProductField.appendChild(quantityLabel);
        newProductField.appendChild(quantityInput);
        newProductField.appendChild(removeButton);
        productFields.appendChild(newProductField);

        // Добавление обработчика события для кнопки "Удалить" на новый элемент
        removeButton.addEventListener('click', function() {
            newProductField.remove();
        });
    });

    // Удаление продукта из формы заказа - делегирование событий
    document.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('remove-product')) {
            event.target.closest('.product-field').remove();
        }
    });

    addOrderForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const data = {};
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        data["customer"] = document.getElementById('customer').value;
        data["date_ordered"] = document.getElementById('date_ordered').value;

        const productFields = document.querySelectorAll('.product-field');
        const selectedProducts = [];

        productFields.forEach(field => {
            const productId = field.querySelector('select').value;
            const quantity = parseInt(field.querySelector('input[type="number"]').value);
            if (!isNaN(quantity) && quantity > 0) {
        selectedProducts.push({ 'ID': productId, 'quantity': quantity });
    } else {
        console.error(`Ошибка: Некорректное количество для продукта ${productId}`);
        // Можно добавить пользовательское уведомление о некорректном количестве
    }
        });

        data["selected_products"] = selectedProducts;
        fetch(addOrderForm.getAttribute('data-create-order-url'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showPopup('Заказ успешно добавлен!');
                addOrderForm.reset();
                addOrderModal.style.display = 'none';
                updateOrdersTable(); // Вызываем функцию обновления таблицы
            } else {
                console.error(data.error);
                showPopup(`Ошибка: ${data.error}`);
            }
        })
        .catch(error => {
            console.error('Ошибка при добавлении заказа:', error);
            showPopup(`Ошибка: ${error.message}`);
        });
    });

     function updateOrdersTable() {
        fetch('/orders/')
        .then(response => response.text())
        .then(html => {
            const orderTableBody = document.getElementById('order-table-body');
            orderTableBody.innerHTML = html; // Заменяем содержимое tbody на новые данные
        })
        .catch(error => console.error('Ошибка при обновлении таблицы заказов:', error));
    }
    function showPopup(message) {
        let popupStatus = document.getElementById('popup-status');
        if (!popupStatus) {
            popupStatus = document.createElement('div');
            popupStatus.id = 'popup-status';
            popupStatus.classList.add('popup');
            document.body.appendChild(popupStatus);
        }

        popupStatus.textContent = message;
        popupStatus.style.display = 'block';
        popupStatus.style.opacity = 1;

        setTimeout(() => {
            popupStatus.style.opacity = 0;
            setTimeout(() => {
                popupStatus.style.display = 'none';
            }, 500);
        }, 2000);
    }
});


// Обработчик удаления заказа
function deleteSelectedOrders() {
    var checkboxes = document.querySelectorAll('input[name="selected_order"]:checked');

    if (checkboxes.length === 0) {
        showAlert("Выберите заказы для удаления");
        return;
    }

    if (!confirm("Вы уверены, что хотите удалить выбранные заказы?")) {
        return;
    }

    var orderIds = Array.from(checkboxes).map(function(checkbox) {
        return checkbox.value;
    });

    deleteOrdersFromDatabase(orderIds);
}

function deleteOrdersFromDatabase(orderIds) {
    var data = {
        order_id: orderIds
    };

    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(data)
    };

    fetch('/delete_orders/', requestOptions)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Произошла ошибка при удалении заказов');
            }
            return response.json();
        })
        .then(function(data) {
            if (data.success) {
                handleSuccessfulDelete(orderIds);
            } else {
                showAlert('Произошла ошибка при удалении заказов: ' + data.message);
            }
        })
        .catch(function(error) {
            console.error('Ошибка:', error);
            showAlert('Произошла ошибка при удалении заказов');
        });
}

function handleSuccessfulDelete(orderIds) {
    showAlert('Выбранные заказы успешно удалены');

    orderIds.forEach(function(id) {
        var row = document.querySelector('input[value="' + id + '"]').closest('tr');
        if (row) {
            row.remove();
        } else {
            console.error('Не удалось найти строку для заказа с ID: ' + id);
        }
    });
}

function showAlert(message) {
    var popup = document.getElementById('popup');
    var popupMessage = document.getElementById('popup-message');

    popupMessage.textContent = message;
    popup.style.display = 'block';

    setTimeout(function() {
        popup.style.display = 'none';
    }, 3000);
}


    // Функция для открытия модального окна редактирования
    function editSelectedOrder() {
    var checkbox = document.querySelector('input[name="selected_order"]:checked');
    if (!checkbox) {
        showAlert("Выберите заказ для редактирования");
        return;
        }

    var orderId = checkbox.value;
    // Получаем данные о заказе из строки таблицы
    var row = checkbox.closest('tr');
    var customer = row.cells[1].textContent.trim();
    var summary = row.cells[4].textContent.trim();
    var dateOrdered = row.cells[5].textContent.trim();

    // Заполняем форму данными о заказе
    document.getElementById('edit-order-id').value = orderId;
    document.getElementById('edit-order-customer').value = customer;
    document.getElementById('edit-order-summary').value = summary;
    document.getElementById('edit-order-date').value = dateOrdered;

    // Заполняем продукты (здесь предполагается, что данные о продуктах можно получить аналогичным образом)
    var productsContainer = document.getElementById('edit-order-products');
    productsContainer.innerHTML = ''; // Очищаем контейнер

    // Получаем все продукты и их количество
    var productElements = row.querySelectorAll('.text2 p');
    for (var i = 0; i < productElements.length; i += 2) {
        var productName = productElements[i].textContent.trim();
        var quantity = productElements[i + 1].textContent.trim();
        var product = productsData.find(p => p.name === productName);
        if (product) {
            var productInput = document.createElement('div');
            productInput.innerHTML = `
                <label>${product.name}</label>
                <input type="number" name="product_${product.id}" value="${quantity}">
            `;
            productsContainer.appendChild(productInput);
        }
    }

    document.getElementById('edit-order-modal').style.display = 'block';
}

// Функция для закрытия модального окна редактирования
function closeEditOrderModal() {
    document.getElementById('edit-order-modal').style.display = 'none';
}

// Функция для отправки формы редактирования заказа
function submitEditOrderForm() {
    var form = document.getElementById('edit-order-form');
    var formData = new FormData(form);
    var orderId = document.getElementById('edit-order-id').value;
    var data = {
        order_id: orderId,
        customer: formData.get('customer'),
        summary: formData.get('summary'),
        date_ordered: formData.get('date_ordered'),
        products: []
    };

    form.querySelectorAll('#edit-order-products div').forEach(function(productInput) {
        var productId = productInput.querySelector('input').name.split('_')[1];
        var quantity = productInput.querySelector('input').value;
        data.products.push({
            id: productId,
            quantity: quantity
        });
    });

    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(data)
    };

    fetch('/edit_order/', requestOptions)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Произошла ошибка при редактировании заказа');
            }
            return response.json();
        })
        .then(function(data) {
            if (data.success) {
                handleSuccessfulEdit(data.order);
            } else {
                showAlert('Произошла ошибка при редактировании заказа: ' + data.message);
            }
        })
        .catch(function(error) {
            console.error('Ошибка:', error);
            showAlert('Произошла ошибка при редактировании заказа');
        });
}

// Функция для успешного редактирования заказа
function handleSuccessfulEdit(order) {
    showAlert('Заказ успешно отредактирован');

    // Обновляем строку таблицы новыми данными
    var row = document.querySelector('input[value="' + order.id + '"]').closest('tr');
    row.cells[1].textContent = order.customer;
    row.cells[4].textContent = order.summary;
    row.cells[5].textContent = order.date_ordered;

    // Обновляем продукты
    var productsContainer = row.querySelector('.text2');
    productsContainer.innerHTML = '';
    order.products.forEach(function(product) {
        productsContainer.innerHTML += `<p>${product.name}</p><p>${product.quantity}</p>`;
    });

    closeEditOrderModal();
}
