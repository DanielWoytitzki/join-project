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
      <div class="header-user-icon">
        <span id="userInitials"></span
      </div>
  </div>
  `;
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
      <a href="./summary.html">
        <div class="desktop-nav-icon">
          <img src="./img/nav-icon-summary.svg" alt="">
          <span>Summary</span>
        </div>
      </a>
      <a href="./add-task.html">
        <div class="desktop-nav-icon">
          <img src="./img/nav-icon-task.svg" alt="">
          <span>Add Task</span>
        </div>
      </a>
      <a href="./board.html">
        <div class="desktop-nav-icon">
          <img src="./img/nav-icon-board.svg" alt="">
          <span>Board</span>
        </div>
      </a>
      <a href="./contacts.html">
        <div class="desktop-nav-icon">
          <img src="./img/nav-icon-contact.svg" alt="">
          <span>Contacts</span>
        </div>
      </a>
    </div>

    <div class="extra-links-desktop-nav">
      <a href="./privacy-policy.html">Privacy Policy</a>
      <a href="./legal-notice.html">Legal notice</a>
    </div>
  `;
}

/**
 * This function generates the template for the navigation bar on mobile
 * @returns HTML-Code
 */
function generateHTMLForMobileNav() {
  return `
    <a href="./summary.html">
      <div class="mobile-nav-icon">
        <img src="./img/nav-icon-summary.svg" alt="">
        <span>Summary</span>
      </div>
    </a>
    <a href="./board.html">
      <div class="mobile-nav-icon">
        <img src="./img/nav-icon-board.svg" alt="">
        <span>Board</span>
      </div>
    </a>
    <a href="./add-task.html">
      <div class="mobile-nav-icon">
        <img src="./img/nav-icon-task.svg" alt="">
        <span>Add Task</span>
      </div>
    </a>
    <a href="./contacts.html">
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
  window.location.href = "help.html";
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
