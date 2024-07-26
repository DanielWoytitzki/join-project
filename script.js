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

async function pullContacts() {
  try {
    boardContacts = await readData(CONTACTS_URL);
  } catch (error) {
    console.error("Error rendering tasks:", error);
  }
}
