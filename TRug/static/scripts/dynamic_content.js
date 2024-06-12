function loadContent(page) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/${page}/`, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 400) {
            document.getElementById('content').innerHTML = xhr.responseText;
        } else {
            console.error('Error loading page');
        }
    };
    xhr.onerror = function() {
        console.error('Request failed');
    };
    xhr.send();
}
