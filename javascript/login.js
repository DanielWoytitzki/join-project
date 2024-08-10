const BASE_URL = "https://join-7b4c8-default-rtdb.europe-west1.firebasedatabase.app/";


/**
 * Adds an event listener to load the function "fetchUserDetailsFromLocalStorage()" after the whole site has been loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    fetchUserDetailsFromLocalStorage();
});


/**
 * This function logs one in as user as long as one is found in the database
 */
async function logInAsUser() {
    let email = document.getElementById('email').value.trim();
    let password = document.getElementById('password').value.trim();

    try {
        let response = await fetch(BASE_URL + "users.json");
        if (!response.ok) throw new Error('Error fetching users');

        let users = await response.json();

        let userFound = false;
        let userName = '';

        for (let userId in users) {
            if (users[userId].email === email && users[userId].password === password) {
                userFound = true;
                userName = users[userId].name;
                break;
            }
        }

        if (userFound) {
            saveLogInToSessionStorage(userName, email);
            checkRememberMe(email, password);
            window.location.href = 'summary.html';
        } else {
            document.getElementById('user-not-found-msg').style.color = "red";
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


/**
 * This function saves the login process to the session storage
 * @param {string} name - Name of the logged in user
 * @param {string} email - Email of the logged in user
 */
function saveLogInToSessionStorage(name, email) {
    sessionStorage.setItem('userDetails', JSON.stringify({
        status: 'logged in',
        name: name,
        email: email
    }));
}


/**
 * This function checks if the checkbox of "Remember me" is checked or not
 */
function checkRememberMe(email, password) {
    if (document.getElementById('checkbox-remember-me').checked) {
        saveLogInToLocalStorage(email, password);
    } else {
        localStorage.removeItem('email');
        localStorage.removeItem('password');
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
    }
}


/**
 * This function saves one's email and password to the local storage if the checkbox of "Remember me" is/was checked
 * 
 * @param {string} email - Email of the current user
 * @param {string} password - Password of the current user
 */
function saveLogInToLocalStorage(email, password) {
    localStorage.setItem('email', email);
    localStorage.setItem('password', password);
}


/**
 * This function fetches one's email and password from the local storage if the checkbox of "Remember me" is/was checked
 */
function fetchUserDetailsFromLocalStorage() {
    let inputEmail = document.getElementById('email');
    let inputPassword = document.getElementById('password');

    if (inputEmail && inputPassword) {
        let email = localStorage.getItem('email');
        let password = localStorage.getItem('password');

        if (email) inputEmail.value = email;
        if (password) inputPassword.value = password;
    } else {
        console.error('Email oder Passwort-Feld nicht gefunden');
    }
}


/**
 * This function forwards one to the sign-up page
 */
function forwardToSignUp() {
    window.location.href = './signup.html';
}


/**
 * This function forwards one to the summary page as guest
 */
function logInAsGuest() {
    window.location.href = './summary.html';
}
