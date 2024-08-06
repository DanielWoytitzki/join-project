/*
const BASE_URL = "https://join-7b4c8-default-rtdb.europe-west1.firebasedatabase.app/";
*/

var colorArray = [
  "#FF7A00",
  "#FF5EB3",
  "#6E52FF",
  "#9327FF",
  "#00BEE8",
  "#1FD7C1",
  "#FF745E",
  "#FFA35E",
  "#FC71FF",
  "#FFC701",
  "#0038FF",
  "#C3FF2B",
  "#FFE62B",
  "#FF4646",
  "#FFBB2B",
];

loadContactsFromDatabase();

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
  let contactList = document.getElementById("contact-list");
  contactList.innerHTML = "";
  document.getElementById("contact-detailed").innerHTML = "";
  document.getElementById("contact-detailed-mobile").innerHTML = "";

  if (contacts) {
    // Convert contacts object to an array and sort it alphabetically by name
    let sortedContacts = Object.keys(contacts)
      .map((id) => ({
        id,
        ...contacts[id],
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

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
      groupedContacts[letter].forEach((contact) => {
        contactList.innerHTML += HTMLForContactCard(contact);
      });
    }
  }
}

/**
 * This function generates the HTML for a single contact card
 *
 * @param {object} contact - The contact object containing name, email, phone, and color
 * @returns {string} - The HTML string for the contact card
 */
function HTMLForContactCard(contact) {
  const nameParts = contact.name.split(" ");
  const firstLetter = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() : "";
  const secondLetter = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() : "";

  const backgroundColor = contact.color || "#000"; // Default to black if no color is provided

  return `
        <div onclick="showDetailedContact('${contact.id}', '${backgroundColor}')" class="single-contact-box">
            <div class="single-contact-box-profile-img" style="background-color: ${backgroundColor};">
                <span>${firstLetter}${secondLetter}</span>
            </div>
            <div class="single-contact-box-content">
                <span>${contact.name}</span>
                <a href="mailto:${contact.email}">${contact.email}</a>
            </div>
        </div>
    `;
}

function updateSelectedContact(contactId) {
  let contactBoxes = document.querySelectorAll(".single-contact-box");

  contactBoxes.forEach((contactBox) => {
    if (contactBox.getAttribute("onclick").includes(contactId)) {
      contactBox.classList.add("selected");
    } else {
      contactBox.classList.remove("selected");
    }
  });
}

/**
 * This function fetches and displays the detailed contact information
 *
 * @param {string} contactId - The contactId is automatically generated by your database
 */
async function showDetailedContact(contactId) {
  document.getElementById("detailedcontactmobile").classList.remove("d-none");
  document
    .getElementById("detailedcontactmobile")
    .classList.add("contact-section-content-mobile");
  document.getElementById("contactlist").classList.remove("contact-section");
  document.getElementById("contactlist").classList.add("d-none");
  let response = await fetch(BASE_URL + "/contacts/" + contactId + ".json");
  let detailedContact = await response.json();
  detailedContact.id = contactId;
  document.getElementById("contact-detailed").innerHTML =
    HTMLForDetailedContact(detailedContact);
  document.getElementById("contact-detailed-mobile").innerHTML =
    HTMLForDetailedContactMobile(detailedContact);

  updateSelectedContact(contactId);
}

/**
 * This function generates the HTML for the detailed contact view
 *
 * @param {object} detailedContact - The detailed contact object containing name, email, phone, and color
 * @returns {string} - The HTML string for the detailed contact view
 */
function HTMLForDetailedContact(detailedContact) {
  const nameParts = detailedContact.name.split(" ");
  const firstLetter = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() : "";
  const secondLetter = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() : "";
  const backgroundColor = detailedContact.color || "#000"; // Default to black if no color is provided

  return `
        <div style="display: flex; align-items: center; gap: 54px;">
            <div class="contact-big-profile-img" style="background-color: ${backgroundColor};">
                <span>${firstLetter}${secondLetter}</span>
            </div>
            <div>
                <h2>${detailedContact.name}</h2>
                <div style="display: flex; justify-content: space-between; width: 159px;">
                    <div onclick="editContact('${detailedContact.id}', '${detailedContact.name}', '${detailedContact.email}', '${detailedContact.phone}', '${backgroundColor}')" class="contact-big-icon">
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

function HTMLForDetailedContactMobile(detailedContact) {
  const nameParts = detailedContact.name.split(" ");
  const firstLetter = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() : "";
  const secondLetter = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() : "";
  const backgroundColor = detailedContact.color || "#000"; // Default to black if no color is provided

  return `
        <div style="display: flex; align-items: center; gap: 20px;">
            <div class="contact-big-profile-img-mobile" style="background-color: ${backgroundColor};">
                <span>${firstLetter}${secondLetter}</span>
            </div>
            <div>
                <h2>${detailedContact.name}</h2>
            </div>
        </div>
        <div>
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

function closeDetailedContactMobile() {
  document.getElementById("detailedcontactmobile").classList.add("d-none");
  document
    .getElementById("detailedcontactmobile")
    .classList.remove("contact-section-content-mobile");
  document.getElementById("contactlist").classList.add("contact-section");
  document.getElementById("contactlist").classList.remove("d-none");
}

function toggleContactMenu() {
  document
    .querySelector(".contact-big-mobile-option-button")
    .classList.toggle("contact-big-mobile-overlay-menu-active");
  document
    .getElementById("mobileContactMenu")
    .classList.toggle("show-contact-big-mobile-overlay-menu");
  document.getElementById("mobileContactMenu").classList.toggle("d-none");
  document.getElementById("mobileContactMenu").classList.toggle("d-flex");
}

/**
 * This function creates an overlay and adds a new contact to the database
 */
function addNewContact() {
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.innerHTML = HTMLForAddNewContact();
  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";
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

            <div class="overlay-add-contact-right-box">
                <div>
                    <img class="closeIcon" src="./img/close.svg" alt="" onclick="closeOverlay()">
                </div>

                <div class="overlay-add-contact-right">
                    <div>
                        <img class="profile-icon-img" src="./img/profile-pic-blank.svg" alt="Profile Picture Placeholder">
                    </div>
                    <form onsubmit="addContactToDatabase(); return false">
                        <div>
                            <div class="input-fields-add-contact">
                                <input id="name" style="background-image: url('./img/person-icon.svg');" type="text" placeholder="Name" required>
                                <input id="email" style="background-image: url('./img/mail-icon.svg');" type="email" placeholder="E-Mail" required>
                                <input id="phone" style="background-image: url('./img/call-icon.svg');" type="number" placeholder="Phone" requiered>
                            </div>
                        </div>
                        <div class="buttons-add-contact">
                            <button class="cancel-button-add-contact" onclick="closeOverlay()" formnovalidate="formnovalidate">Cancel <img src="./img/close.svg"></button>
                            <button class="create-contact-button-add-contact">Create contact <img src="./img/check.svg"></button>
                        </div>
                    </form>
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
  document.body.style.overflow = "auto";
}

/**
 * This function adds ones new contact to the database
 */
async function addContactToDatabase() {
  let contactName = document.getElementById("name").value;
  let contactEmail = document.getElementById("email").value;
  let contactPhone = document.getElementById("phone").value;
  const contactColor =
    colorArray[Math.floor(Math.random() * colorArray.length)];

  let data = {
    name: contactName,
    email: contactEmail,
    phone: contactPhone,
    color: contactColor, // Save the randomly chosen color
  };

  let response = await fetch(BASE_URL + "/contacts.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  let responseAsJson = await response.json();
  console.log(responseAsJson);

  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";

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
 * @param {object} updatedData - The updatedData is the updated information/data of an existing contact (name, email, phone, and color)
 */
async function editContactFromDatabase(contactId, updatedData) {
  let response = await fetch(BASE_URL + "/contacts/" + contactId + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });
  let responseAsJson = await response.json();
  console.log(responseAsJson);

  updateContactInList(contactId, updatedData);
  showDetailedContact(contactId);
}

/**
 * This function edits a specific contact
 * @param {string} contactId - The contactId is automatically generated by your database
 * @param {string} name - The name of the updated contact
 * @param {string} email - The email of the updated contact
 * @param {number} phone - The phone number of the updated contact
 * @param {string} color - The background color for the contact's initials
 */
function editContact(contactId, name, email, phone, color) {
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.innerHTML = HTMLForEditContact(contactId, name, email, phone, color);
  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";
}

/**
 * This function generates the HTML code for the "edit contact" pop up
 * @param {string} contactId - The contactId is automatically generated by your database
 * @param {string} name - The name of the updated contact
 * @param {string} email - The email of the updated contact
 * @param {number} phone - The phone number of the updated contact
 * @param {string} color - The background color for the contact's initials
 * @returns HTML code
 */
function HTMLForEditContact(contactId, name, email, phone, color) {
  const nameParts = name.split(" ");
  const firstLetter = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() : "";
  const secondLetter = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() : "";

  return `
        <div class="overlay-add-contact">
            <div class="overlay-add-contact-left">
                <img src="./img/logo-big-desktop.svg">
                <h1>Edit contact</h1>
                <hr>
            </div>

            <div class="overlay-add-contact-right-box">
                <div>
                    <img class="closeIcon" src="./img/close.svg" alt="" onclick="closeOverlay()">
                </div>

                <div class="overlay-add-contact-right">
                    <div class="contact-big-profile-img" style="background-color: ${color};">
                        <span>${firstLetter}${secondLetter}</span>
                    </div>
                    <div>
                        <div>
                            <form class="input-fields-add-contact">
                                <input id="editName" style="background-image: url('./img/person-icon.svg');" type="text" value="${name}" placeholder="Name">
                                <input id="editEmail" style="background-image: url('./img/mail-icon.svg');" type="email" value="${email}" placeholder="E-Mail">
                                <input id="editPhone" style="background-image: url('./img/call-icon.svg');" type="number" value="${phone}" placeholder="Phone">
                            </form>
                        </div>
                        <div class="buttons-add-contact">
                            <button class="delete-button-add-contact" type="button" onclick="deleteContactFromDatabase('${contactId}')">Delete</button>
                            <button class="save-button-add-contact" type="button" onclick="saveEditedContact('${contactId}')">Save <img src="./img/check.svg"></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * This function saves the edited contact
 * @param {string} contactId - The contactId is automatically generated by your database
 */
function saveEditedContact(contactId) {
  let newName = document.getElementById("editName").value;
  let newEmail = document.getElementById("editEmail").value;
  let newPhone = document.getElementById("editPhone").value;
  let color = document.querySelector(".contact-big-profile-img").style
    .backgroundColor; // Fetch the current color

  if (newName && newEmail && newPhone) {
    let updatedData = {
      name: newName,
      email: newEmail,
      phone: newPhone,
      color: color, // Include color in updated data
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
  let contactBox = document.querySelector(
    `.single-contact-box[onclick="showDetailedContact('${contactId}')"]`
  );

  if (contactBox) {
    const newContactHTML = HTMLForContactCard({
      id: contactId,
      ...updatedData,
    });
    contactBox.outerHTML = newContactHTML;
  }
}
