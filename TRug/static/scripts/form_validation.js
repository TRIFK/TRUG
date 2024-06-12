document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector(".login-form");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    form.addEventListener("submit", function(event) {
        // Очистка предыдущих ошибок
        clearErrors();

        let hasError = false;

        // Проверка имени пользователя
        if (usernameInput.value.trim() === "") {
            showError(usernameInput, "Введите имя пользователя");
            hasError = true;
        }

        // Проверка пароля
        if (passwordInput.value.trim() === "") {
            showError(passwordInput, "Введите пароль");
            hasError = true;
        }

        if (hasError) {
            event.preventDefault();
        }
    });

    function showError(input, message) {
        const errorElement = document.createElement("div");
        errorElement.classList.add("error");
        errorElement.textContent = message;
        input.classList.add("error");
        input.parentNode.insertBefore(errorElement, input.nextSibling);
    }

    function clearErrors() {
        const errorElements = document.querySelectorAll(".error");
        errorElements.forEach(function(element) {
            element.remove();
        });
        const inputs = document.querySelectorAll(".login-form input");
        inputs.forEach(function(input) {
            input.classList.remove("error");
        });
    }
});
