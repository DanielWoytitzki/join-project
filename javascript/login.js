const BASE_URL = "https://join-7b4c8-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Adds an eventlistener in order to load the function "fetchUserDetailsFromLocalStorage()" after the whole site has been loaded
 */
document.addEventListener('DOMContentLoaded', (event) => {
    fetchUserDetailsFromLocalStorage();
});

/**
 * This function logs one in as user as long as one is found in the database
 */
async function logInAsUser() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    let response = await fetch(BASE_URL + "users.json");
    let users = await response.json();
    console.log(users);

    let userFound = false;
    for (let userId in users) {
        if (users[userId].email === email && users[userId].password === password) {
            userFound = true;
            console.log('User gefunden:', users[userId]);
            break;
        }
    }

    if (userFound) {
        console.log('User gefunden');
    } else {
        console.log('User wurde nicht gefunden. Bitte registrieren Sie sich oder melden sich als Gast an');
    }
    checkRememberMe(email, password);
    window.location.href = 'summary.html';
}

/**
 * This function checks if the checkbox of "Remember me" is checked or not
 */
function checkRememberMe(email, password) {
    let checkbox = document.getElementById('checkbox-remember-me').checked;

    if (checkbox == true) {
        console.log('Log in wird beim nächsten Mal angezeigt');
        saveLogInToLocalStorage(email, password);
        loadLogInFromLocalStorage(email, password);
    } else {
        console.log('Log in muss erneut eingegeben werden');
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
    }
}

/**
 * This function saves ones email and password to the local storage if the checkbox of "Remember me" is/was checked
 * 
 * @param {string} email - Email of the current user
 * @param {string} password - Password of the current user
 */
function saveLogInToLocalStorage(email, password) {
    let emailAsText = JSON.stringify(email);
    let passwordAsText = JSON.stringify(password);
    localStorage.setItem('email', emailAsText);
    localStorage.setItem('password', passwordAsText);
}

/**
 * This function loads ones email and password from the local storage if the checkbox of "Remember me" is/was checked
 * 
 * @param {string} email - Email of the current user
 * @param {string} password - Password of the current user
 */
function loadLogInFromLocalStorage(email, password) {   
    let emailAsText = localStorage.getItem('email');
    let passwordAsText = localStorage.getItem('password');
    if (emailAsText && passwordAsText) {
        email = JSON.parse(emailAsText);
        password = JSON.parse(passwordAsText);
    }
}

/**
 * This function fetchs ones email and password from the local storage if the checkbox of "Remember me" is/was checked
 */
function fetchUserDetailsFromLocalStorage() {
    let inputEmail = document.getElementById('email');
    let inputPassword = document.getElementById('password');

    if (inputEmail && inputPassword) {
        let email = localStorage.getItem('email');
        let password = localStorage.getItem('password');

        if (email !== null) {
            email = email.replace(/"/g, '');
            inputEmail.value = email;
        }
        if (password !== null) {
            password = password.replace(/"/g, '');
            inputPassword.value = password;
        }
    } else {
        console.error('Email oder Password nicht gefunden');
    }
}

function logInAsGuest() {
    window.location.href = 'summary.html';
}

/**
 * This function forwards one to the sign-up page
 */
function forwardToSignUp() {
    window.location.href = 'sign_up.html';
}