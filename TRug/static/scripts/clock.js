document.addEventListener('DOMContentLoaded', function() {
    function updateTime() {
        var now = new Date();
        var hours = now.getHours().toString().padStart(2, '0');
        var minutes = now.getMinutes().toString().padStart(2, '0');
        var seconds = now.getSeconds().toString().padStart(2, '0');

        var timeString = hours + ':' + minutes + ':' + seconds;

        document.getElementById('current-time').innerText = timeString;
    }

    // Обновляем время каждую секунду
    setInterval(updateTime, 1000);

    // Вызываем функцию updateTime сразу при загрузке страницы
    updateTime();
});