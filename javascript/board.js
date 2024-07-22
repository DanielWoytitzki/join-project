let taskFieldToDo = document.getElementById("taskFieldToDo");
let taskFieldInProgress = document.getElementById("taskFieldInProgress");
let taskFieldAwaitFeedback = document.getElementById("taskFieldAwaitFeedback");
let taskFieldDone = document.getElementById("taskFieldDone");
let taskOverlay = document.getElementById("taskOverlay");
let addTaskOverlay = document.getElementById("addTaskOverlay");
let currentDraggedElement;
let contactsOverlay = [];
let contactsForOverlay;

function initBoard() {
  renderTasks();
}

async function renderTasks() {
  clearTaskBoard();
  try {
    let data = await readData(TASKS_URL);
    contactsForOverlay = await readData(CONTACTS_URL);
    for (let key in data) {
      let item = data[key];
      let column = item["position"];
      displayTasks(column, key, item);
    }
    noTasks();
  } catch (error) {
    console.error("Error rendering tasks:", error);
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
    let data = await readData(TASKS_URL + `/${id}`);
    loadContactsOverlayTask(data);
    console.log(contactsOverlay);
    taskOverlay.innerHTML = "";
    let priority = nameWithUpperCase(data["priority"]);
    taskOverlay.innerHTML += generateTaskOverlayHTML(id, data, priority);
  } catch (error) {
    console.error("Error rendering tasks:", error);
  }
}

async function loadContactsOverlayTask(data) {
  contactsForOverlay;
  for (let i = 0; i < data["assignedContacts"].length; i++) {
    contactsOverlayTemp.push(data["assignedContacts"][i]);
  }
}

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
