const BASE_URL = "https://join-7b4c8-default-rtdb.europe-west1.firebasedatabase.app/";

async function logInAsUser() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');

    let user = users.find(u => u.email == email.value && u.password == password.value);
    console.log(user);
    if (user) {
        console.log('User gefunden');
    } else {
        console.log('User wurde nicht gefunden. Bitte registrieren Sie sich oder melden sich als Gast an');
    }
}

const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get('msg');

if (msg) {
    msgBox.innerHTML = msg;
} else {
    // display: none
}

function checkRememberMe() {
    let checkbox = document.getElementById('checkbox');

    if (checkbox == checked) {
        console.log('Log in wird beim nächsten Mal angezeigt');
        saveLogInToLocalStorage();
        loadLogInFromLocalStorage();
    } else {
        console.log('Log in muss erneut eingegeben werden');
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
    }
}

function saveLogInToLocalStorage() {
    let emailAsText = JSON.stringify(email);
    let passwordAsText = JSON.stringify(password);
    localStorage.setItem('email', emailAsText);
    localStorage.setItem('password', passwordAsText);
}

function loadLogInFromLocalStorage() {
    let emailAsText = localStorage.getItem('email');
    let passwordAsText = localStorage.getItem('password');
    if (emailAsText && passwordAsText) {
        email = JSON.parse(emailAsText);
        password = JSON.parse(passwordAsText);
    }
}

function logInAsGuest() {

}

function forwardToSignUp() {
    window.location.href = 'sign_up.html';
}