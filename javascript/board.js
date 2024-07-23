let taskFieldToDo = document.getElementById("taskFieldToDo");
let taskFieldInProgress = document.getElementById("taskFieldInProgress");
let taskFieldAwaitFeedback = document.getElementById("taskFieldAwaitFeedback");
let taskFieldDone = document.getElementById("taskFieldDone");
let taskOverlay = document.getElementById("taskOverlay");
let addTaskOverlay = document.getElementById("addTaskOverlay");
let currentDraggedElement;
let contactsOverlay = [];
let boardContacts;
let boardTasks;

function initBoard() {
  pullContacts();
  renderTasks();
}

async function pullContacts() {
  try {
    boardContacts = await readData(CONTACTS_URL);
  } catch (error) {
    console.error("Error rendering tasks:", error);
  }
}

async function renderTasks() {
  clearTaskBoard();
  try {
    boardTasks = await readData(TASKS_URL);
    for (let key in boardTasks) {
      let item = boardTasks[key];
      let column = item["position"];
      displayTasks(column, key, item);
      displayTaskAssignedContacts(item, key);
      displayTaskSubtasks(item, key);
    }
    noTasks();
  } catch (error) {
    console.error("Error rendering tasks:", error);
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
    console.log(subtasks);
    let subtaskDone = 0;
    let subtaskTotal = 0;
    for (const key in subtasks) {
      if (subtasks["subtaskState"] == "checked") {
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
  // taskId.innerHTML += generateTaskSubtasks(progress, subtaskDone, subtaskTotal);
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
    let data = await readData(TASKS_URL + `/${id}`);
    // loadContactsOverlayTask(data);
    console.log(contactsOverlay);
    taskOverlay.innerHTML = "";
    let priority = nameWithUpperCase(data["priority"]);
    taskOverlay.innerHTML += generateTaskOverlayHTML(id, data, priority);
  } catch (error) {
    console.error("Error rendering tasks:", error);
  }
}

// async function loadContactsOverlayTask(data) {
//   boardContacts;
//   for (let i = 0; i < data["assignedContacts"].length; i++) {
//     if(boardContacts == data["assignedContacts"][i]) {

//     }
//     contactsOverlay.push(data["assignedContacts"][i]);
//   }
// }

function showOverlayTask() {
  taskOverlay.classList.remove("d-none");
}

function showOverlayAddTask() {
  addTaskOverlay.classList.remove("d-none");
}

function disableOverlayTask() {
  taskOverlay.classList.add("d-none");
}

function disableOverlayAddTask() {
  addTaskOverlay.classList.add("d-none");
}

function startDragging(id) {
  currentDraggedElement = id;
  console.log(currentDraggedElement);
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

async function addTask() {
  await loadContactList();
  addTaskOverlay.classList.remove("d-none");
}
