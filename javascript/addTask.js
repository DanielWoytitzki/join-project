let taskPriority = "Medium";
let taskCategory;
let categoryState = false;
let contactsState = false;
let contacts = [];
let contactDropdown = document.getElementById(
  "addTaskAssignedToDropdownOptions"
);
let subtasks = [];
let addTaskSubtaskList = document.getElementById("addTaskSubtaskList");
let addTaskSubtaskInput = document.getElementById("addTaskSubtaskInput");
let addTaskSubtaskContainer = document.getElementById(
  "addTaskSubtaskContainer"
);
let addTaskAssignedContacts = [];
let taskState = "ToDo";

async function initAddTask() {
  await pullContacts();
  await loadContactList();
  taskState = "ToDo";
}

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
    taskPriority = "Urgent";
  } else if (priority == "Medium") {
    medium.classList.add("orange");
    medium.classList.remove("white");
    urgent.classList.remove("red");
    urgent.classList.add("white");
    low.classList.remove("green");
    low.classList.add("white");
    taskPriority = "Medium";
  } else if (priority == "Low") {
    low.classList.add("green");
    low.classList.remove("white");
    medium.classList.remove("orange");
    medium.classList.add("white");
    urgent.classList.remove("red");
    urgent.classList.add("white");
    taskPriority = "Low";
  }
}

async function addTask(state) {
  taskState = state;
  await loadContactList();
  addTaskOverlay.classList.remove("d-none");
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
  taskCategory = category;
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

function subtaskFocusInput() {
  addTaskSubtaskInput.focus();
}

function subtaskClearInput() {
  addTaskSubtaskInput.value = "";
}

addTaskSubtaskInput.addEventListener("focus", () => {
  addTaskSubtaskContainer.classList.add("focused");
  document.getElementById("addTaskSubtaskPlusIcon").classList.add("d-none");
  document
    .getElementById("addTaskSubtasIconSection")
    .classList.remove("d-none");
});

addTaskSubtaskInput.addEventListener("blur", () => {
  setTimeout(removeFocus, 100);
});

function removeFocus() {
  addTaskSubtaskContainer.classList.remove("focused");
  document.getElementById("addTaskSubtaskPlusIcon").classList.remove("d-none");
  document.getElementById("addTaskSubtasIconSection").classList.add("d-none");
}

function subtaskSubmitInput() {
  let subtask = addTaskSubtaskInput.value;
  subtasks.push({
    subtaskTitle: subtask,
    subtaskState: "unchecked",
  });
  showAddTaskSubtasks();
  subtaskClearInput();
}

function showAddTaskSubtasks() {
  addTaskSubtaskList.innerHTML = "";
  for (let i = 0; i < subtasks.length; i++) {
    let subtaskTitle = subtasks[i]["subtaskTitle"];
    addTaskSubtaskList.innerHTML += generateSubtaskList(i, subtaskTitle);
  }
}

function subtaskDeleteTask(id) {
  subtasks.splice(id, 1);
  showAddTaskSubtasks();
}

function subtaskEditTask(id) {
  addTaskSubtaskList.innerHTML = "";
  addTaskSubtaskList.innerHTML += generateSubtaskEdit(id);
  console.log(subtasks[id]["subtaskTitle"]);
  document.getElementById("subtaskInputEditValue").value =
    subtasks[id]["subtaskTitle"];
}

function subtaskSubmitEditTask(id) {
  let subtask = document.getElementById("subtaskInputEditValue").value;
  subtasks[id]["subtaskTitle"] = subtask;
  showAddTaskSubtasks();
}

function addTaskSubmit() {
  let required = checkRequired();
  console.log(required);
  if (required) {
    addTaskAssignedContactList();
    let title = document.getElementById("addTaskTitle").value;
    let description = document.getElementById("addTaskDescription").value;
    let dueDate = document.getElementById("addTaskDueDate").value;
    let assignedContactsObject = convertArrayToObject(addTaskAssignedContacts);
    let subtasksObject = convertArrayToObject(subtasks);
    let task = {
      title: title,
      description: description,
      dueDate: dueDate,
      priority: taskPriority,
      category: taskCategory,
      assignedContacts: assignedContactsObject,
      subtasks: subtasksObject,
      position: taskState,
    };
    postData(TASKS_URL, task);
    document.getElementById("taskAddedSlide").classList.remove("d-none");
    setTimeout(hideOverlay, 1000);
  }
}

function hideOverlay() {
  taskState = "ToDo";
  renderTasks();
  document.getElementById("taskAddedSlide").classList.add("d-none");
  disableOverlayAddTask();
}

function checkRequired() {
  let title = false,
    dueDate = false,
    category = false;
  if (document.getElementById("addTaskTitle").value == "") {
    document.getElementById("addTaskTitleRequired").classList.remove("d-none");
    document.getElementById("addTaskTitle").classList.add("red-border");
  } else if (!document.getElementById("addTaskTitle").value == "") {
    document.getElementById("addTaskTitleRequired").classList.add("d-none");
    document.getElementById("addTaskTitle").classList.remove("red-border");
    title = true;
  }
  if (document.getElementById("addTaskDueDate").value == "") {
    document
      .getElementById("addTaskDueDateRequired")
      .classList.remove("d-none");
    document.getElementById("addTaskDueDate").classList.add("red-border");
  } else if (!document.getElementById("addTaskDueDate").value == "") {
    document.getElementById("addTaskDueDateRequired").classList.add("d-none");
    document.getElementById("addTaskDueDate").classList.remove("red-border");
    dueDate = true;
  }
  if (
    document.getElementById("addTaskCategory").innerHTML ==
    "Select task category"
  ) {
    document
      .getElementById("addTaskCategoryRequired")
      .classList.remove("d-none");
    document
      .getElementById("addTaskCategoryContainer")
      .classList.add("red-border");
  } else if (
    document.getElementById("addTaskCategory").innerHTML == "Technical Task" ||
    document.getElementById("addTaskCategory").innerHTML == "User Story"
  ) {
    document.getElementById("addTaskCategoryRequired").classList.add("d-none");
    document
      .getElementById("addTaskCategoryContainer")
      .classList.remove("red-border");
    category = true;
  }
  let required;
  if (title && dueDate && category) {
    required = true;
  }
  return required;
}

function convertArrayToObject(array) {
  let obj = {};
  array.forEach((value, index) => {
    obj[index] = value;
  });
  return obj;
}

function addTaskAssignedContactList() {
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i]["state"] == "checked") {
      addTaskAssignedContacts.push(contacts[i]["id"]);
    }
  }
}

async function taskOverlayDeleteTask(id) {
  let path = TASKS_URL + "/" + id;
  await deleteData(path);
  await renderTasks();
  disableOverlayTask();
}

function addTaskSubmitSite() {
  let required = checkRequired();
  console.log(required);
  if (required) {
    addTaskAssignedContactList();
    let title = document.getElementById("addTaskTitle").value;
    let description = document.getElementById("addTaskDescription").value;
    let dueDate = document.getElementById("addTaskDueDate").value;
    let assignedContactsObject = convertArrayToObject(addTaskAssignedContacts);
    let subtasksObject = convertArrayToObject(subtasks);
    let task = {
      title: title,
      description: description,
      dueDate: dueDate,
      priority: taskPriority,
      category: taskCategory,
      assignedContacts: assignedContactsObject,
      subtasks: subtasksObject,
      position: taskState,
    };
    postData(TASKS_URL, task);
    document.getElementById("taskAddedSlide").classList.remove("d-none");
    document.getElementById("taskAddedSlide").classList.add("transition-up");
    setTimeout(redirectBoard, 2000);
  }
}

function redirectBoard() {
  window.location.href = "board.html";
}
