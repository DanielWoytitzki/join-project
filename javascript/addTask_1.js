let addTaskPriority = "medium";
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

/**
 * renders the addTask HTML page
 * set task field position of the added task to ToDo
 */
async function AddTaskInit() {
  await addTaskContactListload();
  addTaskPosition = "ToDo";
  renderTemplates();
  document.onclick = handleClickAddTaskOverlay;
}

/**
 * renders the overlay of the addTask in the board HTML page
 * if the window screen width is under 850 pixels, it redirects to the addtask HTML page
 * reveals the overlay
 *
 * @param {string} position - the task field position of the added task
 */
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

/**
 * by clicking on the different priority buttons, they change their color
 * current selected priority is saved in variable
 *
 * @param {string} priority - the priority of the new task
 */
function addTaskPrioritySelect(priority) {
  let urgent = document.getElementById("addtaskPriorityUrgent");
  let medium = document.getElementById("addtaskPriorityMedium");
  let low = document.getElementById("addtaskPriorityLow");
  if (priority == "urgent") {
    urgent.classList.add("red");
    urgent.classList.remove("white");
    medium.classList.remove("orange");
    medium.classList.add("white");
    low.classList.remove("green");
    addTaskPriority = "urgent";
  } else if (priority == "medium") {
    medium.classList.add("orange");
    medium.classList.remove("white");
    urgent.classList.remove("red");
    urgent.classList.add("white");
    low.classList.remove("green");
    low.classList.add("white");
    addTaskPriority = "medium";
  } else if (priority == "low") {
    low.classList.add("green");
    low.classList.remove("white");
    medium.classList.remove("orange");
    medium.classList.add("white");
    urgent.classList.remove("red");
    urgent.classList.add("white");
    addTaskPriority = "low";
  }
}

/**
 * Reveals the category list if hidden or
 * Hides the category list if reveald
 */
function addTaskToggleCategory() {
  document
    .getElementById("addTaskCategoryDropdownOptions")
    .classList.toggle("d-none");
  document.getElementById("addTaskCategoryArrow").classList.toggle("turn180");
}

/**
 * change the displayed category to the selected
 *
 * @param {string} category
 */
function addTaskSetCategory(category) {
  document.getElementById("addTaskCategory").innerHTML = `${category}`;
  addTaskCategory = category;
}

/**
 * Reveals the contact list if hidden or
 * Hides the contact list if reveald
 */
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

/**
 * by selecting the icon the checked state of the contact changes
 *
 * @param {string} key - the id of the contact in the database
 */
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

/**
 * pushes the information of each contact from the database into a new array and set it to unchecked
 */
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

/**
 * displays the contacts in the contact list dropdown with also the state if checked or unchecked
 */
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

/**
 * set the focus to the add subtask input
 */
function addTaskSubtaskFocusInput() {
  addTaskSubtaskInput.focus();
}

/**
 * clears the input field of subtask input
 */
function addTaskSubtaskClearInput() {
  addTaskSubtaskInput.value = "";
}

/**
 * when focused in the subtask input the plus icon hides and the cross and check icon reveal
 */
addTaskSubtaskInput.addEventListener("focus", () => {
  addTaskSubtaskContainer.classList.add("focused");
  document.getElementById("addTaskSubtaskPlusIcon").classList.add("d-none");
  document
    .getElementById("addTaskSubtasIconSection")
    .classList.remove("d-none");
});

/**
 * when subtask input loses focus a function is called
 */
addTaskSubtaskInput.addEventListener("blur", () => {
  setTimeout(addTaskSubtaskInputRemoveFocus, 100);
});

/**
 * the cross and check icon hide and the plus icon reveal
 */
function addTaskSubtaskInputRemoveFocus() {
  addTaskSubtaskContainer.classList.remove("focused");
  document.getElementById("addTaskSubtaskPlusIcon").classList.remove("d-none");
  document.getElementById("addTaskSubtasIconSection").classList.add("d-none");
}

/**
 * submits the input of a subtask to the subtasks array
 */
function addTaskSubtaskSubmitInput() {
  if (!addTaskSubtaskInput.value == "") {
    let subtask = addTaskSubtaskInput.value;
    addTaskSubtasks.push({
      subtaskTitle: subtask,
      subaddTaskPosition: "unchecked",
    });
    addTaskDisplaySubtasks();
    addTaskSubtaskClearInput();
  }
}

/**
 * displays the subtasks of the new task
 */
function addTaskDisplaySubtasks() {
  addTaskSubtaskList.innerHTML = "";
  for (let i = 0; i < addTaskSubtasks.length; i++) {
    let subtaskTitle = addTaskSubtasks[i]["subtaskTitle"];
    addTaskSubtaskList.innerHTML += generateAddTaskSubtaskList(i, subtaskTitle);
  }
}

/**
 * deletes the selected subtask and rerender the subtasks
 *
 * @param {number} id - the id of the selected subtask
 */
function addTaskSubtaskDeleteTask(id) {
  addTaskSubtasks.splice(id, 1);
  addTaskDisplaySubtasks();
}

/**
 * displays the edit input for the selected subtask
 *
 * @param {number} id - the id of the selected subtask
 */
function addTaskSubtaskEditTask(id) {
  addTaskSubtaskList.innerHTML = "";
  addTaskSubtaskList.innerHTML += generateAddTaskSubtaskEdit(id);
  document.getElementById("subtaskInputEditValue").value =
    addTaskSubtasks[id]["subtaskTitle"];
}

/**
 * submits the new input to the selected subtask
 *
 * @param {number} id - the id of the selcted subtask
 */
function subtaskSubmitEditTask(id) {
  if (!document.getElementById("subtaskInputEditValue").value == "") {
    let subtask = document.getElementById("subtaskInputEditValue").value;
    addTaskSubtasks[id]["subtaskTitle"] = subtask;
    addTaskDisplaySubtasks();
  }
}

/**
 * checks if all the required fields are filled out
 * submit inputs of the new task to the database
 * message appears saying new task is added
 */
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

/**
 * hides the add Task overlay
 * rerenders the tasks
 */
function boardAddTaskHideOverlay() {
  addTaskPosition = "ToDo";
  boardRenderTasks();
  document.getElementById("taskAddedSlide").classList.add("d-none");
  addTaskHideOverlay();
}

/**
 * checks if the required inputs have a value
 * displays a message if no value is detected
 *
 * @returns
 */
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

/**
 * pushes the assigned contacts from in a new array
 */
function addTaskAssignedContactList() {
  for (let i = 0; i < addTaskContacts.length; i++) {
    if (addTaskContacts[i]["state"] == "checked") {
      addTaskAssignedContacts.push(addTaskContacts[i]["id"]);
    }
  }
}
