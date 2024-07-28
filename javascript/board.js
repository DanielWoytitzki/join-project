let taskFieldToDo = document.getElementById("taskFieldToDo");
let taskFieldInProgress = document.getElementById("taskFieldInProgress");
let taskFieldAwaitFeedback = document.getElementById("taskFieldAwaitFeedback");
let taskFieldDone = document.getElementById("taskFieldDone");
let taskOverlay = document.getElementById("taskOverlay");
let addTaskOverlay = document.getElementById("addTaskOverlay");
let taskOverlayEdit = document.getElementById("taskOverlayEdit");
let currentDraggedElement;
let contactsOverlay = [];
let boardTasks;
let boardSearchInput = document.getElementById("boardSearchInput");
let boardContacts;
let contactsOverlayEdit = [];

async function initBoard() {
  await pullContacts();
  await renderTasks();
  await loadContactListBoardEdit();
}

async function renderTasks() {
  clearTaskBoard();
  try {
    boardTasks = await readData(TASKS_URL);
    displayBoard();
  } catch (error) {
    console.error("Error rendering tasks:", error);
  }
}

function displayBoard() {
  for (let key in boardTasks) {
    let item = boardTasks[key];
    let column = item["position"];
    displayTasks(column, key, item);
    displayTaskAssignedContacts(item, key);
    displayTaskSubtasks(item, key);
    categoryBackgroundColor(item, key);
  }
  noTasks();
}

function categoryBackgroundColor(item, key) {
  if (item["category"] == "User Story") {
    document.getElementById(`category${key}`).style.background = "#0038FF";
  } else if (item["category"] == "Technical Task") {
    document.getElementById(`category${key}`).style.background = "#20D7C1";
  }
}

function displayTaskAssignedContacts(item, id) {
  if (item.hasOwnProperty("assignedContacts")) {
    let assignedContacts = item["assignedContacts"];
    let taskId = document.getElementById(`taskContacts${id}`);
    let counter = 0;
    for (let i = 0; i < assignedContacts.length; i++) {
      let contact = assignedContacts[i];
      for (let key in boardContacts) {
        if (key == contact && counter == 0) {
          let contactName = boardContacts[key]["name"];
          let initials = getInitials(contactName);
          taskId.innerHTML += generateTaskContacts(initials);
          counter++;
        } else if (key == contact && counter > 0) {
          let contactName = boardContacts[key]["name"];
          let initials = getInitials(contactName);
          let left = counter * 8;
          taskId.innerHTML += generateTaskContactsTwo(initials, left);
          counter++;
        }
      }
    }
  }
}

function displayTaskSubtasks(item, id) {
  if (item.hasOwnProperty("subtasks")) {
    let taskId = document.getElementById(`taskSubtasks${id}`);
    let subtasks = item["subtasks"];
    let subtaskDone = 0;
    let subtaskTotal = 0;
    for (const key in subtasks) {
      if (subtasks[key]["subtaskState"] == "checked") {
        subtaskDone++;
      }
      subtaskTotal++;
    }
    if (!subtaskTotal == 0) {
      let progress = (subtaskDone / subtaskTotal) * 100;
      taskId.innerHTML += generateTaskSubtasks(
        progress,
        subtaskDone,
        subtaskTotal
      );
    }
  }
}

function clearTaskBoard() {
  taskFieldToDo.innerHTML = "";
  taskFieldInProgress.innerHTML = "";
  taskFieldAwaitFeedback.innerHTML = "";
  taskFieldDone.innerHTML = "";
}

function displayTasks(column, key, item) {
  let position = "taskField" + column;
  document.getElementById(position).innerHTML += generateTaskHTML(key, item);
}

function openTaskDetails(id) {
  showOverlayTask();
  renderOverlayTasks(id);
}

function noTasks() {
  if (!taskFieldToDo.hasChildNodes()) {
    taskFieldToDo.innerHTML += generateNoTaskAwaitFeedback();
  }
  if (!taskFieldInProgress.hasChildNodes()) {
    taskFieldInProgress.innerHTML += generateNoTaskDone();
  }
  if (!taskFieldAwaitFeedback.hasChildNodes()) {
    taskFieldAwaitFeedback.innerHTML += generateNoTaskAwaitFeedback();
  }
  if (!taskFieldDone.hasChildNodes()) {
    taskFieldDone.innerHTML += generateNoTaskDone();
  }
}

async function renderOverlayTasks(id) {
  try {
    let item = boardTasks[id];
    taskOverlay.innerHTML = "";
    let priority = nameWithUpperCase(item["priority"]);
    taskOverlay.innerHTML += generateTaskOverlayHTML(id, item, priority);
    displayTaskOverlayAssignedContacts(item, id);
    displayTaskOverlaySubtasks(item, id);
    categoryBackgroundColorOverlay(item, id);
  } catch (error) {
    console.error("Error rendering tasks:", error);
  }
}

function categoryBackgroundColorOverlay(item, key) {
  if (item["category"] == "User Story") {
    document.getElementById(`categoryOverlay${key}`).style.background =
      "#0038FF";
  } else if (item["category"] == "Technical Task") {
    document.getElementById(`categoryOverlay${key}`).style.background =
      "#20D7C1";
  }
}

function displayTaskOverlayAssignedContacts(item, id) {
  if (item.hasOwnProperty("assignedContacts")) {
    let assignedContacts = item["assignedContacts"];
    let taskId = document.getElementById(`taskOverlayContacts${id}`);
    for (let i = 0; i < assignedContacts.length; i++) {
      let contact = assignedContacts[i];
      for (let key in boardContacts) {
        if (key == contact) {
          let contactName = boardContacts[key]["name"];
          let initials = getInitials(contactName);
          taskId.innerHTML += generateTaskOverlayContacts(
            initials,
            contactName
          );
        }
      }
    }
  }
}

function displayTaskOverlaySubtasks(item, id) {
  if (item.hasOwnProperty("subtasks")) {
    let taskId = document.getElementById(`taskOverlaySubtasks${id}`);
    let subtasks = item["subtasks"];
    let state;
    for (const key in subtasks) {
      if (subtasks[key]["subtaskState"] == "checked") {
        state = "checked";
        subtaskTitle = subtasks[key]["subtaskTitle"];
        taskId.innerHTML += generateTaskOverlaySubtasks(
          subtaskTitle,
          state,
          id,
          key
        );
      } else {
        state = "unchecked";
        subtaskTitle = subtasks[key]["subtaskTitle"];
        taskId.innerHTML += generateTaskOverlaySubtasks(
          subtaskTitle,
          state,
          id,
          key
        );
      }
    }
  }
}

async function toggleTaskOverlaySubtask(state, id, key) {
  if (state == "checked") {
    let path = TASKS_URL + "/" + id + "/subtasks/" + key + "/subtaskState";
    let data = "unchecked";
    await putData(path, data);
    await renderTasks();
    openTaskDetails(id);
  } else if (state == "unchecked") {
    let path = TASKS_URL + "/" + id + "/subtasks/" + key + "/subtaskState";
    let data = "checked";
    await putData(path, data);
    await renderTasks();
    openTaskDetails(id);
  }
}

function showOverlayTask() {
  taskOverlay.classList.remove("d-none");
}

function showOverlayAddTask() {
  addTaskOverlay.classList.remove("d-none");
}

function showOverlayTaskEdit() {
  taskOverlayEdit.classList.remove("d-none");
}

function disableOverlayTask() {
  taskOverlay.classList.add("d-none");
  renderTasks();
  boardSearchInput.value = "";
}

function disableOverlayAddTask() {
  addTaskOverlay.classList.add("d-none");
}

function disableOverlayTaskEdit() {
  taskOverlayEdit.classList.add("d-none");
  renderTasks();
  boardSearchInput.value = "";
}

function startDragging(id) {
  currentDraggedElement = id;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTo(position) {
  let path = TASKS_URL + "/" + currentDraggedElement + "/position";
  let data = position;
  putData(path, data);
  setTimeout(renderTasks, 200);
}

function displaySearchBoard(key) {
  let item = boardTasks[key];
  let column = item["position"];
  displayTasks(column, key, item);
  displayTaskAssignedContacts(item, key);
  displayTaskSubtasks(item, key);
  categoryBackgroundColor(item, key);
}

boardSearchInput.addEventListener("input", searchBoard);

function searchBoard() {
  clearTaskBoard();
  let filterWord = boardSearchInput.value.toLowerCase();
  for (let key in boardTasks) {
    let title = boardTasks[key]["title"];
    let description = boardTasks[key]["description"];
    if (
      title.toLowerCase().includes(filterWord) ||
      description.toLowerCase().includes(filterWord)
    ) {
      displaySearchBoard(key);
    }
  }
  noTasks();
}

function openTaskDetailsEdit(id) {
  showOverlayTaskEdit();
  renderOverlayTasksEdit(id);
}

async function renderOverlayTasksEdit(id) {
  try {
    let item = boardTasks[id];
    taskOverlayEdit.innerHTML = "";
    taskOverlayEdit.innerHTML += generateTaskOverlayEditHTML(id);
    document.getElementById("editTaskTitle").value = item["title"];
    document.getElementById("editTaskDescription").value = item["description"];
    document.getElementById("editTaskDueDate").value = item["dueDate"];
    addTaskPrioritySelect(item["priority"]);
    //contacts
    //subtasks
    //submit
  } catch (error) {
    console.error("Error rendering tasks:", error);
  }
}

function toggleContactsEdit() {
  if (contactsState == false) {
    document
      .getElementById("addTaskAssignedToDropdownOptionsEdit")
      .classList.remove("d-none");
    contactsState = true;
    document
      .getElementById("addTaskAssignedToArrowEdit")
      .classList.add("turn180");
    showContactsEdit();
  } else if (contactsState == true) {
    document
      .getElementById("addTaskAssignedToDropdownOptionsEdit")
      .classList.add("d-none");
    contactsState = false;
    document
      .getElementById("addTaskAssignedToArrowEdit")
      .classList.remove("turn180");
  }
}

function showContactsEdit() {
  document.getElementById("addTaskAssignedToDropdownOptionsEdit").innerHTML =
    "";
  console.log(contactsOverlayEdit);
  for (let i = 0; i < contactsOverlayEdit.length; i++) {
    let contactId = contactsOverlayEdit[i]["id"];
    let name = contactsOverlayEdit[i]["contact"];
    let contactState = contactsOverlayEdit[i]["state"];
    let initials = getInitials(name);
    document.getElementById("addTaskAssignedToDropdownOptionsEdit").innerHTML +=
      generateContactListEdit(contactId, initials, name, contactState);
  }
}

function contactSelectEdit(key) {
  for (let i = 0; i < contactsOverlayEdit.length; i++) {
    if (
      contactsOverlayEdit[i].id == key &&
      contactsOverlayEdit[i].state == "unchecked"
    ) {
      contactsOverlayEdit[i].state = "checked";
    } else if (
      contactsOverlayEdit[i].id == key &&
      contactsOverlayEdit[i].state == "checked"
    ) {
      contactsOverlayEdit[i].state = "unchecked";
    }
  }
  showContactsEdit();
}

async function loadContactListBoardEdit() {
  try {
    await pullContactListBoardEdit();
  } catch (error) {
    console.error("Error rendering tasks:", error);
  }
}

async function pullContactListBoardEdit() {
  let data = await readData(CONTACTS_URL);

  for (let key in data) {
    contactsOverlayEdit.push({
      id: key,
      contact: data[key]["name"],
      state: "unchecked",
    });
  }
}
