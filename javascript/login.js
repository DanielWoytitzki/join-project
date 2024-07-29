const BASE_URL = "https://join-7b4c8-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Adds an eventlistener in order to load the function "fetchUserDetailsFromLocalStorage()" after the whole site has been loaded
 */
document.addEventListener('DOMContentLoaded', (event) => {
    fetchUserDetailsFromLocalStorage();
});

function signUp() {
    document.getElementById('loginheadersignup').classList.add('d-none');
    document.getElementById('loginmobilesignup').classList.add('d-none');
    let content = document.getElementById('loginsignupsection');
    content.innerHTML = signUpHTML(); 
}

function signUpHTML() {
    return `
    <div class="signup-box">
        <div class="signup-box-head">
            <div class="blue-arrow-icon">
                <a href="./login.html"><img src="./img/arrow-left-blue.svg"></a>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
                <h1>Sign up</h1>
                <hr>
            </div>
            <div class="blue-arrow-icon">   
            </div>
        </div>
        <div style="gap: 24px"; class="login-box-input-fields">
            <input id="name" style="background-image: url('./img/person-icon.svg');" type="text" placeholder="Name">
            <input id="email" style="background-image: url('./img/mail-icon.svg');" type="email" placeholder="Email">
            <input id="password" style="background-image: url('./img/lock-icon.svg');" type="password" placeholder="Password">
            <div>
                <input id="confirmedPassword" style="background-image: url('./img/lock-icon.svg');" type="password" placeholder="Confirm Password">
                <p>Your passwords don't match. Please try again.</p>
                <div class="checkbox-acceptpl">
                    <input id="checkbox-privacy-policy" type="checkbox">
                    <span>I accept the <a href="./privacy-policy.html">Privacy policy</a></span>
                </div>
            </div>
        </div>
        <div class="login-box-buttons">
            <button onclick="signUp()" id="signup-button" class="button-login">Sign up</button>
        </div>
    </div>
    `;
}

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
    let userName = '';

    for (let userId in users) {
        if (users[userId].email === email && users[userId].password === password) {
            userFound = true;
            userName = users[userId].name;
            console.log('User gefunden:', users[userId]);
            break;
        }
    }

    if (userFound) {
        console.log('User gefunden');
        saveLogInToSessionStorage(userName, email);
    } else {
        console.log('User wurde nicht gefunden. Bitte registrieren Sie sich oder melden sich als Gast an');
    }
    checkRememberMe(email, password);
    window.location.href = 'summary.html';
}

/**
 * This function saves the login process to the session storage
 * @param {string} name - Name of the logged in user
 * @param {string} email - Email of the logged in user
 */
function saveLogInToSessionStorage(name, email) {
    let userDetails = {
        status: 'logged in',
        name: name,
        email: email
    };
    
    sessionStorage.setItem('userDetails', JSON.stringify(userDetails));
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

/**
 * This function forwards one to the sign-up page
 */
function forwardToSignUp() {
    window.location.href = 'sign_up.html';
}

/**
 * This function forwards one to the summary page as guest
 */
function logInAsGuest() {
    window.location.href = 'summary.html';
}