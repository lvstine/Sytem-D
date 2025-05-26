function showLogin() {
    document.getElementById("login-form").style.display = "block"; // show the login form
    document.getElementById("front").style.display = "none"; // hide the first page
}

document.getElementById('loginForm').addEventListener("submit", function (event) {
event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('isLoggedIn' , 'true');
        window.location.href = 'dashboard.html';

    } else {
        document.getElementById('loginError').innerText = 'Invalid username or password.';
    }



});
