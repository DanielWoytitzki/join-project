/**
 * This function animates the logo before forwarding one to the login
 */
function animateLogo() {
  const logo = document.getElementById("join-logo_big");
  logo.classList.add("animate");
  setTimeout(() => {
    window.location.href = "login.html";
  }, 500);
}


/**
 * This function renders all templates (e. g. header, navigation bar on desktop/mobile)
 */
function renderTemplates() {
  document.getElementById("header").innerHTML = generateHTMLForHeader();
  document.getElementById("desktopNav").innerHTML = generateHTMLForDesktopNav();
  document.getElementById("mobileNav").innerHTML = generateHTMLForMobileNav();
  insertUserInitials();
  changeNavLinkBackgroundColor();
}


/**
 * This function generates the template for the header
 * @returns HTML-Code
 */
function generateHTMLForHeader() {
  return `
    <div class="header-left">
      <p>
        Kanban Project Management Tool
      </p>
      <img src="./img/join-logo.svg" alt="Join-Logo">
    </div>
    <div class="header-right">
      <div onclick="forwardToHelp()" class="header-help-icon">
        <img src="./img/help-icon.svg" alt="">
      </div>
      <div onclick="toggleMenu()" class="header-user-icon">
        <span id="userInitials"></span>
      </div>

      <div id="menu" class="header-overlay-menu d-none transition-in-from-right">
        <a href="./help.html" class="d-none-2560-to-851">Help</a>
        <a href="./legal-notice.html">Legal Notice</a>
        <a href="./privacy-policy.html">Privacy Policy</a>
        <a href="./login.html" onclick="deleteUserDetailsFromSessionStorage()">Log out</a>
      </div>
  </div>
  `;
}


/**
 * This function toggles a burger menu
 */
function toggleMenu() {
  document
    .querySelector(".header-user-icon")
    .classList.toggle("header-overlay-menu-active");
  document.getElementById("menu").classList.toggle("show-header-overlay-menu");
  document.getElementById("menu").classList.toggle("d-none");
}


/**
 * This function generates the template for the navigation bar on desktop
 * @returns HTML-Code
 */
function generateHTMLForDesktopNav() {
  return `
    <div>
      <img src="./img/logo-big-desktop.svg" alt="">
    </div>

    <div class="desktop-nav-icon-box">
      <a href="./summary.html" id="navLink-summary">
        <div class="desktop-nav-icon">
          <img src="./img/nav-icon-summary.svg" alt="">
          <span>Summary</span>
        </div>
      </a>
      <a href="./add-task.html" id="navLink-add-task">
        <div class="desktop-nav-icon">
          <img src="./img/nav-icon-task.svg" alt="">
          <span>Add Task</span>
        </div>
      </a>
      <a href="./board.html" id="navLink-board">
        <div class="desktop-nav-icon">
          <img src="./img/nav-icon-board.svg" alt="">
          <span>Board</span>
        </div>
      </a>
      <a href="./contacts.html" id="navLink-contacts">
        <div class="desktop-nav-icon">
          <img src="./img/nav-icon-contact.svg" alt="">
          <span>Contacts</span>
        </div>
      </a>
    </div>

    <div class="extra-links-desktop-nav">
      <a href="./privacy-policy.html" id="navLink-privacy-policy">Privacy Policy</a>
      <a href="./legal-notice.html" id="navLink-legal-notice">Legal notice</a>
    </div>
  `;
}


/**
 * This function generates the template for the navigation bar on mobile
 * @returns HTML-Code
 */
function generateHTMLForMobileNav() {
  return `
    <a href="./summary.html" id="navLink-mobile-summary">
      <div class="mobile-nav-icon">
        <img src="./img/nav-icon-summary.svg" alt="">
        <span>Summary</span>
      </div>
    </a>
    <a href="./board.html" id="navLink-mobile-board">
      <div class="mobile-nav-icon">
        <img src="./img/nav-icon-board.svg" alt="">
        <span>Board</span>
      </div>
    </a>
    <a href="./add-task.html" id="navLink-mobile-add-task">
      <div class="mobile-nav-icon">
        <img src="./img/nav-icon-task.svg" alt="">
        <span>Add Task</span>
      </div>
    </a>
    <a href="./contacts.html" id="navLink-mobile-contacts">
      <div class="mobile-nav-icon">
        <img src="./img/nav-icon-contact.svg" alt="">
        <span>Contacts</span>
      </div>
    </a>
  `;
}


/**
 * This function forwards one to the help page
 */
function forwardToHelp() {
  window.location.href = "./help.html";
}


/**
 * This function fetchs ones user details (status (e. g. "logged in"), name and email) from the session storage
 */
function fetchUserDetailsFromSessionStorage() {
  let userDetailsString = sessionStorage.getItem("userDetails");
  if (userDetailsString) {
    let userDetails = JSON.parse(userDetailsString);
    console.log(userDetails.status);
    console.log(userDetails.name);
    console.log(userDetails.email);
  }
}


/**
 * This function deletes ones user details (status (e. g. "logged in"), name and email) from the session storage
 * = log out
 */
function deleteUserDetailsFromSessionStorage() {
  sessionStorage.clear();
  window.location.href = "./index.html";
}


/**
 * This function inserts the user's initials into the header
 */
function insertUserInitials() {
  let userDetailsString = sessionStorage.getItem("userDetails");
  if (userDetailsString) {
    let userDetails = JSON.parse(userDetailsString);
    let initials = userDetails.name
      .split(" ")
      .map((namePart) => namePart.charAt(0))
      .join("");
    document.getElementById("userInitials").innerHTML = initials;
  } else {
    document.getElementById("userInitials").innerHTML = "G";
  }
}


const BASE_URL =
  "https://join-7b4c8-default-rtdb.europe-west1.firebasedatabase.app/";
const TASKS_URL = "tasks";
const CONTACTS_URL = "contacts";

async function readData(path) {
  try {
    const response = await fetch(BASE_URL + path + ".json");
    return await response.json();
  } catch (error) {
    console.error("Error rendering tasks:", error);
  }
}

async function postData(path = "", data = {}) {
  try {
    let response = await fetch(BASE_URL + path + ".json", {
      method: "POST",
      header: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error rendering tasks:", error);
  }
}

async function deleteData(path = "") {
  try {
    let response = await fetch(BASE_URL + path + ".json", {
      method: "DELETE",
    });
    return await response.json();
  } catch (error) {
    console.error("Error rendering tasks:", error);
  }
}

async function putData(path = "", data = {}) {
  try {
    let response = await fetch(BASE_URL + path + ".json", {
      method: "PUT",
      header: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error rendering tasks:", error);
  }
}

function nameWithUpperCase(name) {
  let nameUpperCase = name.charAt(0).toUpperCase() + name.slice(1);
  return nameUpperCase;
}

function getInitials(name) {
  let fullName = name;
  let nameParts = fullName.split(" ");
  let initials = nameParts.map((part) => part[0]).join("");
  initials.toUpperCase();
  return initials;
}

function convertArrayToObject(array) {
  let obj = {};
  array.forEach((value, index) => {
    obj[index] = value;
  });
  return obj;
}


/**
 * This function changes the background color of the selected nav-link
 */
function changeNavLinkBackgroundColor() {
  const path = window.location.pathname;
  let fileName = path.substring(path.lastIndexOf("/") + 1);
  let currentHTML = fileName.replace(".html", "");
  
  let selectedDesktopNavLink = document.getElementById(`navLink-${currentHTML}`);
  if (selectedDesktopNavLink) {
    selectedDesktopNavLink.classList.add("desktop-nav-icon-box-hover");
  }
  
  let selectedMobileNavLink = document.getElementById(`navLink-mobile-${currentHTML}`);
  if (selectedMobileNavLink) {
    selectedMobileNavLink.classList.add("mobile-nav-icon-box-hover");
  }
}
