let categoryState = false;
let contactsState = false;
let contacts = [];
let contactDropdown = document.getElementById(
  "addTaskAssignedToDropdownOptions"
);

function addTaskPrioritySelect(priority) {
  let urgent = document.getElementById("addtaskPriorityUrgent");
  let medium = document.getElementById("addtaskPriorityMedium");
  let low = document.getElementById("addtaskPriorityLow");
  if (priority == "Urgent") {
    urgent.classList.add("red");
    urgent.classList.remove("white");
    medium.classList.remove("orange");
    medium.classList.add("white");
    low.classList.remove("green");
  } else if (priority == "Medium") {
    medium.classList.add("orange");
    medium.classList.remove("white");
    urgent.classList.remove("red");
    urgent.classList.add("white");
    low.classList.remove("green");
    low.classList.add("white");
  } else if (priority == "Low") {
    low.classList.add("green");
    low.classList.remove("white");
    medium.classList.remove("orange");
    medium.classList.add("white");
    urgent.classList.remove("red");
    urgent.classList.add("white");
  }
}

function toggleCategory() {
  if (categoryState == false) {
    document
      .getElementById("addTaskCategoryDropdownOptions")
      .classList.remove("d-none");
    categoryState = true;
    document.getElementById("addTaskCategoryArrow").classList.add("turn180");
  } else if (categoryState == true) {
    document
      .getElementById("addTaskCategoryDropdownOptions")
      .classList.add("d-none");
    categoryState = false;
    document.getElementById("addTaskCategoryArrow").classList.remove("turn180");
  }
}

function setCategory(category) {
  document.getElementById("addTaskCategory").innerHTML = `${category}`;
}

function toggleContacts() {
  if (contactsState == false) {
    document
      .getElementById("addTaskAssignedToDropdownOptions")
      .classList.remove("d-none");
    contactsState = true;
    document.getElementById("addTaskAssignedToArrow").classList.add("turn180");
    showContacts();
  } else if (contactsState == true) {
    document
      .getElementById("addTaskAssignedToDropdownOptions")
      .classList.add("d-none");
    contactsState = false;
    document
      .getElementById("addTaskAssignedToArrow")
      .classList.remove("turn180");
  }
}

function contactSelect(key) {
  console.log(key);
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].id == key && contacts[i].state == "unchecked") {
      contacts[i].state = "checked";
    } else if (contacts[i].id == key && contacts[i].state == "checked") {
      contacts[i].state = "unchecked";
    }
  }
  showContacts();
}

async function loadContactList() {
  try {
    await pullContactList();
  } catch (error) {
    console.error("Error rendering tasks:", error);
  }
}

async function pullContactList() {
  let data = await readData(CONTACTS_URL);

  for (let key in data) {
    contacts.push({
      id: key,
      contact: data[key]["name"],
      state: "unchecked",
    });
  }
}

function showContacts() {
  contactDropdown.innerHTML = "";
  for (let i = 0; i < contacts.length; i++) {
    let contactId = contacts[i]["id"];
    let name = contacts[i]["contact"];
    let contactState = contacts[i]["state"];
    let initials = getInitials(name);
    contactDropdown.innerHTML += generateContactList(
      contactId,
      initials,
      name,
      contactState
    );
  }
}

function getInitials(name) {
  let fullName = name;
  let nameParts = fullName.split(" ");
  let initials = nameParts.map((part) => part[0]).join("");
  initials.toUpperCase();
  return initials;
}
