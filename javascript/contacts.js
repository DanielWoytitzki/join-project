const BASE_URL = "https://join-7b4c8-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * This function loads ones contacts from the database
 * 
 * @param {string} path - This is the path leading to your contacts at your database 
 */
async function loadContactsFromDatabase(path = "/contacts") {
    let response = await fetch(BASE_URL + path + ".json");
    let data = await response.json();
    renderContacts(data);
}

/**
 * This function renders ones contacts out of the database
 * 
 * @param {object} contacts - All your contacts (name, email and phone) in your database
 */
function renderContacts(contacts) {
    let contactList = document.getElementById('contact-list');
    contactList.innerHTML = '';
    document.getElementById('contact-detailed').innerHTML = '';

    if (contacts) {
        // Convert contacts object to an array and sort it alphabetically by name
        let sortedContacts = Object.keys(contacts).map(id => ({
            id,
            ...contacts[id]
        })).sort((a, b) => a.name.localeCompare(b.name));

        // Create a map to group contacts by the first letter of their name
        let groupedContacts = sortedContacts.reduce((groups, contact) => {
            let firstLetter = contact.name.charAt(0).toUpperCase();
            if (!groups[firstLetter]) {
                groups[firstLetter] = [];
            }
            groups[firstLetter].push(contact);
            return groups;
        }, {});

        // Render each group
        for (let letter in groupedContacts) {
            contactList.innerHTML += `
                <div class="alphabetical-numbering">
                    <span>${letter}</span>
                </div>
                <hr>
                `;
            groupedContacts[letter].forEach(contact => {
                contactList.innerHTML += HTMLForContactCard(contact);
            });
        }
    }
}

/**
 * This function generates the HTML for a single contact card
 * 
 * @param {object} contact - The contact object containing name, email and phone 
 * @returns {string} - The HTML string for the contact card
 */
function HTMLForContactCard(contact) {
    const nameParts = contact.name.split(' ');
    const firstLetter = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() : '';
    const secondLetter = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() : '';

    return `
        <div onclick="showDetailedContact('${contact.id}')" class="single-contact-box">
            <div class="single-contact-box-profile-img">
                <span>${firstLetter}${secondLetter}</span>
            </div>
            <div class="single-contact-box-content">
                <span>${contact.name}</span>
                <a href="mailto:${contact.email}">${contact.email}</a>
            </div>
        </div>
    `
}

/**
 * This function fetches and displays the detailed contact information
 * 
 * @param {string} contactId - The contactId is automatically generated by your database
 */
async function showDetailedContact(contactId) {
    let response = await fetch(BASE_URL + "/contacts/" + contactId + ".json");
    let detailedContact = await response.json();
    detailedContact.id = contactId;
    document.getElementById('contact-detailed').innerHTML = HTMLForDetailedContact(detailedContact);
}

/**
 * This function generates the HTML for the detailed contact view
 * 
 * @param {object} detailedContact - The detailed contact object containing name, email and phone
 * @returns {string} - The HTML string for the detailed contact view
 */
function HTMLForDetailedContact(detailedContact) {
    const nameParts = detailedContact.name.split(' ');
    const firstLetter = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() : '';
    const secondLetter = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() : '';

    return `
        <div style="display: flex; align-items: center; gap: 54px;">
            <div class="contact-big-profile-img">
                <span>${firstLetter}${secondLetter}</span>
            </div>
            <div>
                <h2>${detailedContact.name}</h2>
                <div style="display: flex; justify-content: space-between; width: 159px;">
                    <div onclick="editContact('${detailedContact.id}', '${detailedContact.name}', '${detailedContact.email}', '${detailedContact.phone}')" class="contact-big-icon">
                        <img src="./img/edit-icon-contact.svg" alt="">
                        <span>Edit</span>
                    </div>
                    <div onclick="deleteContactFromDatabase('${detailedContact.id}')" class="contact-big-icon">
                        <img src="./img/delete-icon-contact.svg" alt="">
                        <span>Delete</span>
                    </div>
                </div>
            </div>
        </div>
        <div style="height: 74px; display: flex; align-items: center; font-size: 20px;">
            <span>Contact Information</span>
        </div>
        <div class="contact-big-info">
            <span>Email</span>
            <a href="mailto:${detailedContact.email}">${detailedContact.email}</a>
            <span>Phone</span>
            <a style="color: black;" href="tel:${detailedContact.phone}">${detailedContact.phone}</a>
        </div>
    `;
}

/**
 * This function creates an overlay and adds a new contact to the database
 */
function addNewContact() {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = HTMLForAddNewContact();
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
}

/**
 * This function generates the HTML code for the "add new contact" pop up
 * @returns HTML code
 */
function HTMLForAddNewContact() {
    return `
        <div class="overlay-add-contact">
            <div class="overlay-add-contact-left">
                <img src="./img/logo-big-desktop.svg">
                <h1>Add contact</h1>
                <p>Tasks are better with a team!</p>
                <hr>
            </div>
            <div class="overlay-add-contact-right">
                <div>
                    <img class="profile-icon-img" src="./img/profile-pic-blank.svg" alt="Profile Picture Placeholder">
                </div>
                <div>
                    <div>
                        <form class="input-fields-add-contact">
                            <input required type="text" placeholder="Name" id="name">
                            <input required type="email" placeholder="E-Mail" id="email">
                            <input required type="number" placeholder="Phone" id="phone">
                        </form>
                    </div>
                    <div>
                        <button type="button" onclick="closeOverlay()">Cancel <img src="./img/close.svg"></button>
                        <button type="button" onclick="addContactToDatabase()">Create contact <img src="./img/check.svg"></button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * This function closes the overlay pop up
 */
function closeOverlay() {
    const overlay = document.querySelector(".overlay");
    if (overlay) {
        overlay.remove();
    }
    document.body.style.overflow = 'auto';
}

/**
 * This function adds ones new contact to the database
 */
async function addContactToDatabase() {
    let contactName = document.getElementById('name').value;
    let contactEmail = document.getElementById('email').value;
    let contactPhone = document.getElementById('phone').value;

    let data = {
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
    };

    let response = await fetch(BASE_URL + "/contacts.json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    let responseAsJson = await response.json();
    console.log(responseAsJson);

    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';

    loadContactsFromDatabase();
    closeOverlay();
}

/**
 * This function deletes ones contacts from the database
 * 
 * @param {string} contactId - The contactId is automatically generated by your database
 */
async function deleteContactFromDatabase(contactId) {
    let response = await fetch(BASE_URL + "/contacts/" + contactId + ".json", {
        method: "DELETE",
    });
    let responseAsJson = await response.json();
    console.log(responseAsJson);

    loadContactsFromDatabase();
    closeOverlay();
}

/**
 * This function edits ones contact in your database
 * 
 * @param {string} contactId - The contactId is automatically generated by your database
 * @param {object} updatedData - The updatedData is the updated information/data of an existing contact (name, email and phone)
 */
async function editContactFromDatabase(contactId, updatedData) {
    let response = await fetch(BASE_URL + "/contacts/" + contactId + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData)
    });
    let responseAsJson = await response.json();
    console.log(responseAsJson);

    updateContactInList(contactId, updatedData);
    showDetailedContact(contactId);
}

// Function for editing contact prompt
function editContact(contactId, name, email, phone) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = HTMLForEditContact(contactId, name, email, phone);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
}


function HTMLForEditContact(contactId, name, email, phone) {
    const nameParts = name.split(' ');
    const firstLetter = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() : '';
    const secondLetter = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() : '';
    
    return `
        <div class="overlay-add-contact">
            <div class="overlay-add-contact-left">
                <img src="./img/logo-big-desktop.svg">
                <h1>Edit contact</h1>
                <hr>
            </div>
            <div class="overlay-add-contact-right">
                <div class="contact-big-profile-img">
                    <span>${firstLetter}${secondLetter}</span>
                </div>
                <div>
                    <div>
                        <form class="input-fields-add-contact">
                            <input type="text" value="${name}" placeholder="Name" id="editName">
                            <input type="email" value="${email}" placeholder="E-Mail" id="editEmail">
                            <input type="number" value="${phone}" placeholder="Phone" id="editPhone">
                        </form>
                    </div>
                    <div>
                        <button type="button" onclick="deleteContactFromDatabase('${contactId}')">Delete</button>
                        <button type="button" onclick="saveEditedContact('${contactId}')">Save <img src="./img/check.svg"></button>
                    </div>
                </div>
            </div>
        </div>
    `;
}


function saveEditedContact(contactId) {
    let newName = document.getElementById('editName').value;
    let newEmail = document.getElementById('editEmail').value;
    let newPhone = document.getElementById('editPhone').value;

    if (newName && newEmail && newPhone) {
        let updatedData = {
            name: newName,
            email: newEmail,
            phone: newPhone
        };
        editContactFromDatabase(contactId, updatedData);
        closeOverlay();
    }
}



/**
 * This function updates a single contact in the contact list without clearing the detailed view
 * 
 * @param {string} contactId - The contactId is automatically generated by your database
 * @param {object} updatedData - The updated information/data of an existing contact (name, email and phone)
 */
async function updateContactInList(contactId, updatedData) {
    let contactBox = document.querySelector(`.single-contact-box[onclick="showDetailedContact('${contactId}')"]`);

    if (contactBox) {
        const newContactHTML = HTMLForContactCard({ id: contactId, ...updatedData });
        contactBox.outerHTML = newContactHTML;
    }
}