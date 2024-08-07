let addTaskPriority = "Medium";
let addTaskCategory;
let addTaskCategoryState = false;
let addTaskContactsState = false;
let addTaskContacts = [];
let addTaskContactDropdown = document.getElementById(
  "addTaskAssignedToDropdownOptions"
);
let addTaskSubtasks = [];
let addTaskSubtaskList = document.getElementById("addTaskSubtaskList");
let addTaskSubtaskInput = document.getElementById("addTaskSubtaskInput");
let addTaskSubtaskContainer = document.getElementById(
  "addTaskSubtaskContainer"
);
let addTaskAssignedContacts = [];
let addTaskPosition = "ToDo";
let addTaskOverlay = document.getElementById("addTaskOverlay");

async function AddTaskInit() {
  await addTaskContactListload();
  addTaskPosition = "ToDo";
  renderTemplates();
  document.onclick = handleClickAddTaskOverlay;
}

async function addTask(position) {
  if (window.innerWidth < 850) {
    window.location.href = "add-task.html";
  } else {
    await addTaskContactListload();
    addTaskPosition = position;
    addTaskOverlay.classList.remove("d-none");
    document.onclick = handleClickAddTaskOverlay;
  }
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
    addTaskPriority = "Urgent";
  } else if (priority == "Medium") {
    medium.classList.add("orange");
    medium.classList.remove("white");
    urgent.classList.remove("red");
    urgent.classList.add("white");
    low.classList.remove("green");
    low.classList.add("white");
    addTaskPriority = "Medium";
  } else if (priority == "Low") {
    low.classList.add("green");
    low.classList.remove("white");
    medium.classList.remove("orange");
    medium.classList.add("white");
    urgent.classList.remove("red");
    urgent.classList.add("white");
    addTaskPriority = "Low";
  }
}

function addTaskToggleCategory() {
  if (addTaskCategoryState == false) {
    document
      .getElementById("addTaskCategoryDropdownOptions")
      .classList.remove("d-none");
    addTaskCategoryState = true;
    document.getElementById("addTaskCategoryArrow").classList.add("turn180");
  } else if (addTaskCategoryState == true) {
    document
      .getElementById("addTaskCategoryDropdownOptions")
      .classList.add("d-none");
    addTaskCategoryState = false;
    document.getElementById("addTaskCategoryArrow").classList.remove("turn180");
  }
}

function addTaskSetCategory(category) {
  document.getElementById("addTaskCategory").innerHTML = `${category}`;
  addTaskCategory = category;
}

function addTaskToggleContacts() {
  if (addTaskContactsState == false) {
    document
      .getElementById("addTaskAssignedToDropdownOptions")
      .classList.remove("d-none");
    addTaskContactsState = true;
    document.getElementById("addTaskAssignedToArrow").classList.add("turn180");
    addTaskShowContacts();
  } else if (addTaskContactsState == true) {
    document
      .getElementById("addTaskAssignedToDropdownOptions")
      .classList.add("d-none");
    addTaskContactsState = false;
    document
      .getElementById("addTaskAssignedToArrow")
      .classList.remove("turn180");
  }
}

function addTaskContactSelect(key) {
  for (let i = 0; i < addTaskContacts.length; i++) {
    if (
      addTaskContacts[i].id == key &&
      addTaskContacts[i].state == "unchecked"
    ) {
      addTaskContacts[i].state = "checked";
    } else if (
      addTaskContacts[i].id == key &&
      addTaskContacts[i].state == "checked"
    ) {
      addTaskContacts[i].state = "unchecked";
    }
  }
  addTaskShowContacts();
  addTaskShowAssignedContactList();
}

async function addTaskContactListload() {
  try {
    let data = await readData(CONTACTS_URL);
    addTaskContacts = [];
    for (let key in data) {
      addTaskContacts.push({
        id: key,
        contact: data[key]["name"],
        state: "unchecked",
        color: data[key]["color"],
      });
    }
  } catch (error) {
    console.error("Error rendering tasks:", error);
  }
}

function addTaskShowContacts() {
  addTaskContactDropdown.innerHTML = "";
  for (let i = 0; i < addTaskContacts.length; i++) {
    let contactId = addTaskContacts[i]["id"];
    let name = addTaskContacts[i]["contact"];
    let contactState = addTaskContacts[i]["state"];
    let initials = getInitials(name);
    let contactBackgroundColor = addTaskContacts[i]["color"];
    addTaskContactDropdown.innerHTML += generateAddTaskContactList(
      contactId,
      initials,
      name,
      contactState,
      contactBackgroundColor
    );
  }
}

function addTaskSubtaskFocusInput() {
  addTaskSubtaskInput.focus();
}

function addTaskSubtaskClearInput() {
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
  setTimeout(addTaskSubtaskInputRemoveFocus, 100);
});

function addTaskSubtaskInputRemoveFocus() {
  addTaskSubtaskContainer.classList.remove("focused");
  document.getElementById("addTaskSubtaskPlusIcon").classList.remove("d-none");
  document.getElementById("addTaskSubtasIconSection").classList.add("d-none");
}

function addTaskSubtaskSubmitInput() {
  let subtask = addTaskSubtaskInput.value;
  addTaskSubtasks.push({
    subtaskTitle: subtask,
    subaddTaskPosition: "unchecked",
  });
  addTaskDisplaySubtasks();
  addTaskSubtaskClearInput();
}

function addTaskDisplaySubtasks() {
  addTaskSubtaskList.innerHTML = "";
  for (let i = 0; i < addTaskSubtasks.length; i++) {
    let subtaskTitle = addTaskSubtasks[i]["subtaskTitle"];
    addTaskSubtaskList.innerHTML += generateAddTaskSubtaskList(i, subtaskTitle);
  }
}

function addTaskSubtaskDeleteTask(id) {
  addTaskSubtasks.splice(id, 1);
  addTaskDisplaySubtasks();
}

function addTaskSubtaskEditTask(id) {
  addTaskSubtaskList.innerHTML = "";
  addTaskSubtaskList.innerHTML += generateAddTaskSubtaskEdit(id);
  document.getElementById("subtaskInputEditValue").value =
    addTaskSubtasks[id]["subtaskTitle"];
}

function subtaskSubmitEditTask(id) {
  let subtask = document.getElementById("subtaskInputEditValue").value;
  addTaskSubtasks[id]["subtaskTitle"] = subtask;
  addTaskDisplaySubtasks();
}

function addTaskSubmit() {
  let required = addTaskCheckRequired();
  if (required) {
    addTaskAssignedContactList();
    let title = document.getElementById("addTaskTitle").value;
    let description = document.getElementById("addTaskDescription").value;
    let dueDate = document.getElementById("addTaskDueDate").value;
    let assignedContactsObject = convertArrayToObject(addTaskAssignedContacts);
    let subtasksObject = convertArrayToObject(addTaskSubtasks);
    let task = {
      title: title,
      description: description,
      dueDate: dueDate,
      priority: addTaskPriority,
      category: addTaskCategory,
      assignedContacts: assignedContactsObject,
      subtasks: subtasksObject,
      position: addTaskPosition,
    };
    postData(TASKS_URL, task);
    document.getElementById("taskAddedSlide").classList.remove("d-none");
    setTimeout(boardAddTaskHideOverlay, 1000);
  }
}

function boardAddTaskHideOverlay() {
  addTaskPosition = "ToDo";
  boardRenderTasks();
  document.getElementById("taskAddedSlide").classList.add("d-none");
  addTaskHideOverlay();
}

function addTaskCheckRequired() {
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

function addTaskAssignedContactList() {
  for (let i = 0; i < addTaskContacts.length; i++) {
    if (addTaskContacts[i]["state"] == "checked") {
      addTaskAssignedContacts.push(addTaskContacts[i]["id"]);
    }
  }
}

function addTaskSubmitSite() {
  let required = addTaskCheckRequired();
  if (required) {
    addTaskAssignedContactList();
    let title = document.getElementById("addTaskTitle").value;
    let description = document.getElementById("addTaskDescription").value;
    let dueDate = document.getElementById("addTaskDueDate").value;
    let assignedContactsObject = convertArrayToObject(addTaskAssignedContacts);
    let subtasksObject = convertArrayToObject(addTaskSubtasks);
    let task = {
      title: title,
      description: description,
      dueDate: dueDate,
      priority: addTaskPriority,
      category: addTaskCategory,
      assignedContacts: assignedContactsObject,
      subtasks: subtasksObject,
      position: addTaskPosition,
    };
    postData(TASKS_URL, task);
    document.getElementById("taskAddedSlide").classList.remove("d-none");
    document.getElementById("taskAddedSlide").classList.add("transition-up");
    setTimeout(boardRedirect, 2000);
  }
}

function boardRedirect() {
  window.location.href = "board.html";
}

function showOverlayAddTask() {
  addTaskOverlay.classList.remove("d-none");
}

function addTaskHideOverlay() {
  addTaskOverlay.classList.add("d-none");
}

async function addTaskClearInputs() {
  document.getElementById("addTaskTitle").value = "";
  document.getElementById("addTaskDescription").value = "";
  await addTaskContactListload();
  document.getElementById("addTaskDueDate").value = "";
  addTaskPrioritySelect("Medium");
  document.getElementById("addTaskCategory").innerHTML = "Select task category";
  document.getElementById("addTaskSubtaskInput").value = "";
  addTaskSubtasks = [];
  addTaskDisplaySubtasks();
}

function handleClickAddTaskOverlay(event) {
  const modal = document.getElementById("addTaskAssignedToDropdownOptions");
  const dropdown = document.getElementById(
    "addTaskContactsDropdownButtonToToggle"
  );
  const isClickInside = modal.contains(event.target);
  const isClickedDropdown = dropdown.contains(event.target);
  if (
    !isClickInside &&
    !modal.classList.contains("d-none") &&
    !isClickedDropdown
  ) {
    addTaskToggleContacts();
  }
}

document.addEventListener("click", function (event) {
  let modal = document.getElementById("addTaskCategoryDropdownOptions");
  let dropdown = document.getElementById("addTaskCategoryContainer");
  let isClickInside = modal.contains(event.target);
  let isClickedDropdown = dropdown.contains(event.target);
  if (
    !isClickInside &&
    !modal.classList.contains("d-none") &&
    !isClickedDropdown
  ) {
    addTaskToggleCategory();
  }
});

function addTaskShowAssignedContactList() {
  let assignedContactList = document.getElementById(
    "addTaskAssignedToContactList"
  );
  assignedContactList.innerHTML = "";

  for (let i = 0; i < addTaskContacts.length; i++) {
    if (addTaskContacts[i]["state"] == "checked") {
      let name = addTaskContacts[i]["contact"];
      let initials = getInitials(name);
      let contactBackgroundColor = addTaskContacts[i]["color"];
      assignedContactList.innerHTML += generateAddTaskAssignedContacts(
        initials,
        contactBackgroundColor
      );
    }
  }
}
