/**
 * checks if all the required fields are filled out
 * submit inputs of the new task to the database
 * message appears saying new task is added
 * redirect to board HTML page
 */
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

/**
 * redirect to board HTML page
 */
function boardRedirect() {
  window.location.href = "board.html";
}

/**
 * hide the add task overlay
 */
function addTaskHideOverlay() {
  addTaskOverlay.classList.add("d-none");
}

/**
 * clears the inputs in the add task page
 */
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

/**
 * if a click ouside the contact list is registered it hides the dropdown
 *
 * @param {event} event - registers a click on the page
 */
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

/**
 * listens to a click outside of the category dropdown and closes it
 */
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

/**
 * displays the initials of the assigned contacts as circles under the contact dropdown
 */
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
