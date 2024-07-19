const BASE_URL = "https://join-7b4c8-default-rtdb.europe-west1.firebasedatabase.app/";

async function addUserToDatabase() {
    let userName = document.getElementById('name').value;
    let userEmail = document.getElementById('email').value;
    let userPassword = document.getElementById('password').value;

    let user = {
        name: userName,
        email: userEmail,
        password: userPassword,
    };

    let response = await fetch(BASE_URL + "/users.json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user)
    });
    let responseAsJson = await response.json();
    console.log(responseAsJson);

    checkConfirmedPassword(userPassword);
}

function checkConfirmedPassword(userPassword) {
    let confirmedPassword = document.getElementById('confirmedPassword').value;

    if (userPassword == confirmedPassword) {
        console.log('Passwort stimmt überein');
    } else {
        console.log('Bitte überprüfe Sie Ihre Eingabe.');
    }
}

function checkCheckbox() {
    let checkbox = document.getElementById('checkbox');
    
    if (checkbox == true) {
        console.log('Privacy policy wurde akzeptiert');
        document.getElementById('signup-button').disabled = true;
    } else {
        console.log('Bitte Privacy policy akzeptieren');
        document.getElementById('signup-button').disabled = false;
    }
}

function signUp() {
    checkConfirmedPassword();
    checkCheckbox();
    addUserToDatabase();
    
    document.getElementById('name').value = '';
    userEmail = document.getElementById('email').value = '';
    userPassword = document.getElementById('password').value = '';
    
    window.location.href = 'login.html?msg=You Signed Up successfully'
}