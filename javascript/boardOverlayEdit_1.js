let boardOverlayEditTask = document.getElementById("taskOverlayEdit");
let boardOverlayEditContactsState = false;
let boardOverlayEditContacts = [];
let boardOverlayEditSubtasks = [];
let boardOverlayEditAssignedContacts = [];
let boardOverlayEditPriority;

/**
 * Renders the Edit Overlay and fill the with content of the selected task
 *
 * @param {string} id - the id of the selected task in the database
 */
function boardOverlayEditRender(id) {
  boardOverlayEditDisplay();
  boardOverlayEditDisplayTask(id);
  document.onclick = handleClick;
}

/**
 * Reveals the edit overlay
 */
function boardOverlayEditDisplay() {
  boardOverlayEditTask.classList.remove("d-none");
}

/**
 * fills the fields with content of selected task
 *
 * @param {string} id - the id of the selected task in the database
 */
function boardOverlayEditDisplayTask(id) {
  let task = boardTasks[id];
  boardOverlayEditTask.innerHTML = "";
  boardOverlayEditTask.innerHTML += generateTaskOverlayEditHTML(id);
  document.getElementById("editTaskTitle").value = task["title"];
  document.getElementById("editTaskDescription").value = task["description"];
  document.getElementById("editTaskDueDate").value = task["dueDate"];
  boardOverlayEditPrioritySelect(task["priority"]);
  boardOverlayEditContacts = [];
  boardOverlayEditPullContacts(task);
  boardOverlayEditSubtasks = [];
  boardOverlayEditPullSubtasks(task);
  boardOverlayEditDisplaySubtasks();
  boardOverlayEditAssignedContactsListUnderDropdown();
}

/**
 * pushes the information of each contact from the database into a new array and set it to unchecked
 * if the task has assigned contacts it will go into function to change unchecked to checked
 *
 * @param {object} task - the content of the selected task
 */
function boardOverlayEditPullContacts(task) {
  for (let key in boardContacts) {
    boardOverlayEditContacts.push({
      id: key,
      contact: boardContacts[key]["name"],
      state: "unchecked",
      color: boardContacts[key]["color"],
    });
  }
  if (task.hasOwnProperty("assignedContacts")) {
    let assignedContacts = task["assignedContacts"];
    boardOverlayEditPushCheckedContacts(assignedContacts);
  }
}

/**
 * checks what contact is assigned to the selected task and set the value state to checked if it is assigned
 *
 * @param {Array} assignedContacts - the assigned contacts with all needed information in an array
 */
function boardOverlayEditPushCheckedContacts(assignedContacts) {
  for (let i = 0; i < boardOverlayEditContacts.length; i++) {
    let contactId = boardOverlayEditContacts[i]["id"];
    for (let j = 0; j < assignedContacts.length; j++) {
      if (contactId == assignedContacts[j]) {
        boardOverlayEditContacts[i]["state"] = "checked";
      }
    }
  }
}

/**
 * Reveals the contact list if hidden or
 * Hides the contact list if reveald
 */
function boardOverlayEditToggleContacts() {
  if (boardOverlayEditContactsState == false) {
    document
      .getElementById("boardOverlayEditContactsDropdownOptions")
      .classList.remove("d-none");
    boardOverlayEditContactsState = true;
    document
      .getElementById("boardOverlayEditContactsDropdownArrow")
      .classList.add("turn180");
    boardOverlayEditDisplayContacts();
  } else if (boardOverlayEditContactsState == true) {
    document
      .getElementById("boardOverlayEditContactsDropdownOptions")
      .classList.add("d-none");
    boardOverlayEditContactsState = false;
    document
      .getElementById("boardOverlayEditContactsDropdownArrow")
      .classList.remove("turn180");
  }
}

/**
 * displays the contacts in the contact list dropdown with also the state if checked or unchecked
 */
function boardOverlayEditDisplayContacts() {
  document.getElementById("boardOverlayEditContactsDropdownOptions").innerHTML =
    "";
  for (let i = 0; i < boardOverlayEditContacts.length; i++) {
    let contactId = boardOverlayEditContacts[i]["id"];
    let name = boardOverlayEditContacts[i]["contact"];
    let contactState = boardOverlayEditContacts[i]["state"];
    let initials = getInitials(name);
    let contactBackgroundColor = boardOverlayEditContacts[i]["color"];
    document.getElementById(
      "boardOverlayEditContactsDropdownOptions"
    ).innerHTML += generateContactListEdit(
      contactId,
      initials,
      name,
      contactState,
      contactBackgroundColor
    );
  }
}

/**
 * by selecting the icon the checked state of the contact changes
 *
 * @param {string} key - the id of the contact in the database
 */
function boardOverlayEditSelectContact(key) {
  for (let i = 0; i < boardOverlayEditContacts.length; i++) {
    if (
      boardOverlayEditContacts[i].id == key &&
      boardOverlayEditContacts[i].state == "unchecked"
    ) {
      boardOverlayEditContacts[i].state = "checked";
    } else if (
      boardOverlayEditContacts[i].id == key &&
      boardOverlayEditContacts[i].state == "checked"
    ) {
      boardOverlayEditContacts[i].state = "unchecked";
    }
  }
  boardOverlayEditDisplayContacts();
  boardOverlayEditAssignedContactsListUnderDropdown();
}

/**
 * hides the edit overlay and rerenders the tasks
 */
function boardOverlayEditTaskHide() {
  boardOverlayEditTask.classList.add("d-none");
  boardRenderTasks();
  boardSearchInput.value = "";
}

/**
 * pushes the subtasks of the selected task in an array
 *
 * @param {object} task - the content of the selected task
 */
function boardOverlayEditPullSubtasks(task) {
  if (task.hasOwnProperty("subtasks")) {
    let subtasks = task["subtasks"];
    for (let key in subtasks) {
      boardOverlayEditSubtasks.push({
        subtaskTitle: subtasks[key]["subtaskTitle"],
        subtaskState: subtasks[key]["subtaskState"],
      });
    }
  }
}

/**
 * set the focus to the add subtask input
 */
function boardOverlayEditSubtaskFocusInput() {
  document.getElementById("boardOverlayEditSubtaskInput").focus();
}

/**
 * hide the plus icon
 * reveal the cross and the check icon
 * when clicked outside the input, focus is removed
 */
function boardOverlayEditSubtaskHandleFocusInput() {
  document
    .getElementById("boardOverlayEditSubtaskContainer")
    .classList.add("focused");
  document
    .getElementById("boardOverlayEditSubtaskPlusIcon")
    .classList.add("d-none");
  document
    .getElementById("boardOverlayEditSubtaskIconSection")
    .classList.remove("d-none");
  document
    .getElementById("boardOverlayEditSubtaskInput")
    .addEventListener("blur", () => {
      setTimeout(boardOverlayEditSubtaskRemoveFocus, 100);
    });
}

/**
 * hide the plus icon
 * reveal the cross and the check icon
 */
function boardOverlayEditSubtaskRemoveFocus() {
  document
    .getElementById("boardOverlayEditSubtaskContainer")
    .classList.remove("focused");
  document
    .getElementById("boardOverlayEditSubtaskPlusIcon")
    .classList.remove("d-none");
  document
    .getElementById("boardOverlayEditSubtaskIconSection")
    .classList.add("d-none");
}

/**
 * submits the input of a subtask to the subtasks array
 */
function boardOverlayEditSubtaskSubmitInput() {
  if (!document.getElementById("boardOverlayEditSubtaskInput").value == "") {
    let subtask = document.getElementById("boardOverlayEditSubtaskInput").value;
    boardOverlayEditSubtasks.push({
      subtaskTitle: subtask,
      subtaskState: "unchecked",
    });
    boardOverlayEditDisplaySubtasks();
    boardOverlayEditSubtaskClearInput();
  }
}

/**
 * displays the subtasks of the selected task
 */
function boardOverlayEditDisplaySubtasks() {
  document.getElementById("boardOverlayEditSubtaskList").innerHTML = "";
  for (let i = 0; i < boardOverlayEditSubtasks.length; i++) {
    let subtaskTitle = boardOverlayEditSubtasks[i]["subtaskTitle"];
    document.getElementById("boardOverlayEditSubtaskList").innerHTML +=
      generateBoardOverlayEditSubtaskList(i, subtaskTitle);
  }
}

/**
 * clears the input field of subtask input
 */
function boardOverlayEditSubtaskClearInput() {
  document.getElementById("boardOverlayEditSubtaskInput").value = "";
}

/**
 * deletes the selected subtask and rerender the subtasks
 *
 * @param {number} id - the id of the selected subtask
 */
function boardOverlayEditSubtaskDelete(id) {
  boardOverlayEditSubtasks.splice(id, 1);
  boardOverlayEditDisplaySubtasks();
}

/**
 * displays the edit input for the selected subtask
 *
 * @param {number} id - the id of the selected subtask
 */
function boardOverlayEditSubtaskEdit(id) {
  document.getElementById("boardOverlayEditSubtaskList").innerHTML = "";
  document.getElementById("boardOverlayEditSubtaskList").innerHTML +=
    generateSubtaskEdit(id);
  document.getElementById("boardOverlayEditSubtaskInputEditValue").value =
    boardOverlayEditSubtasks[id]["subtaskTitle"];
}

/**
 * submits the new input to the selected subtask
 *
 * @param {number} id - the id of the selcted subtask
 */
function boardOverlayEditSubtaskSubmitEdit(id) {
  if (
    !document.getElementById("boardOverlayEditSubtaskInputEditValue").value ==
    ""
  ) {
    let subtask = document.getElementById(
      "boardOverlayEditSubtaskInputEditValue"
    ).value;
    boardOverlayEditSubtasks[id]["subtaskTitle"] = subtask;
    boardOverlayEditDisplaySubtasks();
  }
}

/**
 * checks if all the required fields are filled out
 * submit changes of the edited task to the database
 * rerenders the tasks
 * closes the edit overlay
 *
 * @param {string} id - the id of the selected task
 */
async function boardOverlayEditSubmit(id) {
  let required = boardOverlayEditSubmitCheckRequired();
  if (required) {
    boardOverlayEditAssignedContactList();
    let title = document.getElementById("editTaskTitle").value;
    let description = document.getElementById("editTaskDescription").value;
    let dueDate = document.getElementById("editTaskDueDate").value;
    let assignedContactsObject = convertArrayToObject(
      boardOverlayEditAssignedContacts
    );
    let subtasksObject = convertArrayToObject(boardOverlayEditSubtasks);
    let taskCategory = boardTasks[id]["category"];
    let taskPosition = boardTasks[id]["position"];
    let task = {
      title: title,
      description: description,
      dueDate: dueDate,
      priority: boardOverlayEditPriority,
      category: taskCategory,
      assignedContacts: assignedContactsObject,
      subtasks: subtasksObject,
      position: taskPosition,
    };
    let path = TASKS_URL + "/" + id;
    putData(path, task);
    await boardRenderTasks();
    await boardOverlayTaskHide();
    boardOverlayRender(id);
    setTimeout(boardOverlayEditTaskHide, 500);
  }
}

/**
 * checks if the required inputs have a value
 * displays a message if no value is detected
 *
 * @returns
 */
function boardOverlayEditSubmitCheckRequired() {
  let title = false,
    dueDate = false;
  if (document.getElementById("editTaskTitle").value == "") {
    document
      .getElementById("boardOverlayEditTitleRequired")
      .classList.remove("d-none");
    document.getElementById("editTaskTitle").classList.add("red-border");
  } else if (!document.getElementById("editTaskTitle").value == "") {
    document
      .getElementById("boardOverlayEditTitleRequired")
      .classList.add("d-none");
    document.getElementById("editTaskTitle").classList.remove("red-border");
    title = true;
  }
  if (document.getElementById("editTaskDueDate").value == "") {
    document
      .getElementById("boardOverlayEditDueDateRequired")
      .classList.remove("d-none");
    document.getElementById("editTaskDueDate").classList.add("red-border");
  } else if (!document.getElementById("editTaskDueDate").value == "") {
    document
      .getElementById("boardOverlayEditDueDateRequired")
      .classList.add("d-none");
    document.getElementById("editTaskDueDate").classList.remove("red-border");
    dueDate = true;
  }
  let required;
  if (title && dueDate) {
    required = true;
  }
  return required;
}
