document.addEventListener('DOMContentLoaded', function() {
    const addOrderButton = document.getElementById('add-order-button');
    const addOrderModal = document.getElementById('add-order-modal');
    const addOrderForm = document.getElementById('add-order-form');
    const addOrderStatus = document.getElementById('add-order-status');
    const closeModalButtons = document.querySelectorAll('.close');

    addOrderButton.addEventListener('click', function() {
        addOrderModal.style.display = 'block';
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            addOrderModal.style.display = 'none';
        });
    });

    addOrderForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(addOrderForm);
        const data = {};
        const products = [];

        formData.forEach((value, key) => {
            if (key.startsWith('selected_products')) {
                products.push(value);
            } else {
                data[key] = value;
            }
        });

        data['products'] = products;

        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

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
        addOrderStatus.textContent = 'Заказ успешно добавлен!';
        addOrderForm.reset();
        addOrderModal.style.display = 'none';
        window.location.href = data.redirect_url; // Выполнение перенаправления
    } else {
        addOrderStatus.textContent = `Ошибка: ${data.error}`;
        console.error(data.error);
        // обработка ошибок, если нужно
    }
})
        .catch(error => {
            addOrderStatus.textContent = `Ошибка: ${error.message}`;
        });
    });

    document.getElementById('add-product').addEventListener('click', function() {
        const productFields = document.getElementById('product-fields');
        const newProductField = document.createElement('div');
        newProductField.classList.add('product-field');

        const selectElement = document.createElement('select');
        selectElement.name = 'selected_products[]';
        selectElement.required = true;
        productsData.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.text = product.name;
            selectElement.appendChild(option);
        });

        const quantityLabel = document.createElement('label');
        quantityLabel.setAttribute('for', 'product-quantity');
        quantityLabel.textContent = 'Количество:';

        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.name = 'product_quantities[]';
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

        removeButton.addEventListener('click', function() {
            newProductField.remove();
        });
    });

    document.querySelectorAll('.remove-product').forEach(function(button) {
        button.addEventListener('click', function() {
            button.closest('.product-field').remove();
        });
    });
});


// Обработчик удаления заказа
/*document.getElementById('delete-order-button').addEventListener('click', function() {
    const selectedOrders = document.querySelectorAll('input[name="selected_order"]:checked');
    if (selectedOrders.length === 0) {
        alert('Пожалуйста, выберите заказы для удаления.');
        return;
    }

    const orderIds = Array.from(selectedOrders).map(checkbox => checkbox.value);
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    fetch(`/delete_order/?order_ids=${orderIds.join(',')}`, {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': csrfToken
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Заказы успешно удалены!');
            window.location.reload();
        } else {
            alert(`Ошибка: ${data.error}`);
        }
    })
    .catch(error => {
        alert(`Ошибка: ${error.message}`);
    });
});

    // Обработчик редактирования заказа
    document.getElementById('edit-order').addEventListener('click', function() {
        const selectedOrder = document.querySelector('input[name="selected_order"]:checked');
        if (!selectedOrder) {
            alert('Пожалуйста, выберите заказ для редактирования.');
            return;
        }

        const orderId = selectedOrder.value;
        const customer = prompt('Введите нового клиента:');
        if (!customer) {
            alert('Клиент не может быть пустым.');
            return;
        }

        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        fetch(`/edit_order/${orderId}/`, {
            method: 'PUT',
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'customer': customer
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Заказ успешно отредактирован!');
                window.location.reload();
            } else {
                alert(`Ошибка: ${data.error}`);
            }
        })
        .catch(error => {
            alert(`Ошибка: ${error.message}`);
        });
    });
*/
