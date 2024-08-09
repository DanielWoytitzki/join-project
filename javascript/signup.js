const BASE_URL = "https://join-7b4c8-default-rtdb.europe-west1.firebasedatabase.app/";


/**
 * This function adds a new user to the database
 */
async function addUserToDatabase() {
    let userName = document.getElementById('name').value;
    let userEmail = document.getElementById('email').value;
    let userPassword = document.getElementById('password').value;

    let user = {
        name: userName,
        email: userEmail,
        password: userPassword,
    };

    try {
        let response = await fetch(BASE_URL + "/users.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user)
        });

        if (!response.ok) throw new Error('Error adding user');

        let responseAsJson = await response.json();
        console.log(responseAsJson);
    } catch (error) {
        console.error('Error adding user to database:', error);
    }
}


/**
 * This function checks the entered password with the confirmed password
 * 
 * @returns "true" or "false"
 */
function checkConfirmedPassword() {
    let userPassword = document.getElementById('password').value;
    let confirmedPassword = document.getElementById('confirmedPassword').value;

    if (userPassword === confirmedPassword) {
        return true;
    } else {
        return false;
    }
}


/**
 * This function checks if the checkbox of "I accept the Privacy policy" is checked or not
 * 
 * @returns "true" or "false" 
 */
function checkCheckbox() {
    let checkbox = document.getElementById('checkbox-privacy-policy').checked;

    if (checkbox == true) {
        document.getElementById('signup-button').disabled = false;
        return true;
    } else {
        document.getElementById('signup-button').disabled = true;
        return false;
    }
}


/**
 * This function signs one up as an user
 */
function signUp() {
    if (checkConfirmedPassword() == false) {
        document.getElementById('confirmedPassword').style = "border-color: red;";
        document.getElementById('wrong-confirmed-password-msg').style.color = 'red';
        console.log('Das Passwort stimmt nicht überein. Bitte überprüfen Sie Ihre Eingabe');
    } else if (checkCheckbox() == false) {
        console.log('Bitte akzeptieren Sie unsere Privacy policy.');
    } else {
        addUserToDatabase().then(() => {
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
            document.getElementById('confirmedPassword').value = '';
            successfullSignUp();
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 800);
        });        
    }
}


/**
 * This function forwards one to the login page after a successfully sign up
 */
function forwardToLogIn() {
    window.location.href = 'login.html';
}


/**
 * This function shows one that the sign up was successful
 */
function successfullSignUp() {
    const overlay = document.createElement('div');
    overlay.className = 'signup-overlay';
    overlay.innerHTML = HTMLForSuccessfullSignUp();
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
}


/**
 * This function generates the HTML code for the successfully sign up pop up
 * @returns HTML code
 */
function HTMLForSuccessfullSignUp() {
    return `
        <div class="signup-msg">
            You Signed Up successfully
        </div>
    `;
}