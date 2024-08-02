function boardOverlayEditRender(id) {
  boardOverlayEditDisplay();
  boardOverlayEditDisplayTask(id);
  document.onclick = handleClick;
}

function boardOverlayEditDisplay() {
  boardOverlayEditTask.classList.remove("d-none");
}

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
}

function boardOverlayEditPullContacts(task) {
  for (let key in boardContacts) {
    boardOverlayEditContacts.push({
      id: key,
      contact: boardContacts[key]["name"],
      state: "unchecked",
    });
  }
  if (task.hasOwnProperty("assignedContacts")) {
    let assignedContacts = task["assignedContacts"];

    boardOverlayEditPushCheckedContacts(assignedContacts);
  }
}

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

function boardOverlayEditDisplayContacts() {
  document.getElementById("boardOverlayEditContactsDropdownOptions").innerHTML =
    "";
  for (let i = 0; i < boardOverlayEditContacts.length; i++) {
    let contactId = boardOverlayEditContacts[i]["id"];
    let name = boardOverlayEditContacts[i]["contact"];
    let contactState = boardOverlayEditContacts[i]["state"];
    let initials = getInitials(name);
    document.getElementById(
      "boardOverlayEditContactsDropdownOptions"
    ).innerHTML += generateContactListEdit(
      contactId,
      initials,
      name,
      contactState
    );
  }
}

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
}

function boardOverlayEditTaskHide() {
  boardOverlayEditTask.classList.add("d-none");
  boardRenderTasks();
  boardSearchInput.value = "";
}

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

function boardOverlayEditSubtaskFocusInput() {
  document.getElementById("boardOverlayEditSubtaskInput").focus();
}

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

function boardOverlayEditSubtaskSubmitInput() {
  let subtask = document.getElementById("boardOverlayEditSubtaskInput").value;
  boardOverlayEditSubtasks.push({
    subtaskTitle: subtask,
    subtaskState: "unchecked",
  });
  boardOverlayEditDisplaySubtasks();
  boardOverlayEditSubtaskClearInput();
}

function boardOverlayEditDisplaySubtasks() {
  document.getElementById("boardOverlayEditSubtaskList").innerHTML = "";
  for (let i = 0; i < boardOverlayEditSubtasks.length; i++) {
    let subtaskTitle = boardOverlayEditSubtasks[i]["subtaskTitle"];
    document.getElementById("boardOverlayEditSubtaskList").innerHTML +=
      generateBoardOverlayEditSubtaskList(i, subtaskTitle);
  }
}

function boardOverlayEditSubtaskClearInput() {
  document.getElementById("boardOverlayEditSubtaskInput").value = "";
}

function boardOverlayEditSubtaskDelete(id) {
  boardOverlayEditSubtasks.splice(id, 1);
  boardOverlayEditDisplaySubtasks();
}

function boardOverlayEditSubtaskEdit(id) {
  document.getElementById("boardOverlayEditSubtaskList").innerHTML = "";
  document.getElementById("boardOverlayEditSubtaskList").innerHTML +=
    generateSubtaskEdit(id);
  document.getElementById("boardOverlayEditSubtaskInputEditValue").value =
    boardOverlayEditSubtasks[id]["subtaskTitle"];
}

function boardOverlayEditSubtaskSubmitEdit(id) {
  let subtask = document.getElementById(
    "boardOverlayEditSubtaskInputEditValue"
  ).value;
  boardOverlayEditSubtasks[id]["subtaskTitle"] = subtask;
  boardOverlayEditDisplaySubtasks();
}

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

function boardOverlayEditAssignedContactList() {
  boardOverlayEditAssignedContacts = [];
  for (let i = 0; i < boardOverlayEditContacts.length; i++) {
    if (boardOverlayEditContacts[i]["state"] == "checked") {
      boardOverlayEditAssignedContacts.push(boardOverlayEditContacts[i]["id"]);
    }
  }
}

function boardOverlayEditPrioritySelect(priority) {
  let urgent = document.getElementById("boardOverlayEditPriorityUrgent");
  let medium = document.getElementById("boardOverlayEditPriorityMedium");
  let low = document.getElementById("boardOverlayEditPriorityLow");
  if (priority == "Urgent") {
    urgent.classList.add("red");
    urgent.classList.remove("white");
    medium.classList.remove("orange");
    medium.classList.add("white");
    low.classList.remove("green");
    boardOverlayEditPriority = "Urgent";
  } else if (priority == "Medium") {
    medium.classList.add("orange");
    medium.classList.remove("white");
    urgent.classList.remove("red");
    urgent.classList.add("white");
    low.classList.remove("green");
    low.classList.add("white");
    boardOverlayEditPriority = "Medium";
  } else if (priority == "Low") {
    low.classList.add("green");
    low.classList.remove("white");
    medium.classList.remove("orange");
    medium.classList.add("white");
    urgent.classList.remove("red");
    urgent.classList.add("white");
    boardOverlayEditPriority = "Low";
  }
}

function handleClick(event) {
  const modal = document.getElementById(
    "boardOverlayEditContactsDropdownOptions"
  );
  const dropdown = document.getElementById(
    "boardOverlayEditContactsDropdownButtonToToggle"
  );
  const isClickInside = modal.contains(event.target);
  const isClickedDropdown = dropdown.contains(event.target);
  console.log(isClickInside);
  console.log(modal.classList.contains("d-none"));
  console.log(isClickedDropdown);
  if (
    !isClickInside &&
    !modal.classList.contains("d-none") &&
    !isClickedDropdown
  ) {
    boardOverlayEditToggleContacts();
  }
}
