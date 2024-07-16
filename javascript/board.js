const TASKS_URL = "tasks";
let taskFieldToDo = document.getElementById("taskFieldToDo");
let taskFieldInProgress = document.getElementById("taskFieldInProgress");
let taskFieldAwaitFeedback = document.getElementById("taskFieldAwaitFeedback");
let taskFieldDone = document.getElementById("taskFieldDone");
let taskOverlay = document.getElementById("taskOverlay");

function initBoard() {
  renderTasks();
}

async function renderTasks() {
  try {
    let data = await readData(TASKS_URL);

    for (let key in data) {
      let item = data[key];
      let column = item["position"];
      displayTasks(column, key, item);
    }
  } catch (error) {
    console.error("Error rendering tasks:", error);
  }
}

function displayTasks(column, key, item) {
  let position = "taskField" + column;
  document.getElementById(position).innerHTML += generateTaskHTML(key, item);
}

function openTaskDetails(id) {
  showOverlayTask();
  renderOverlayTasks(id);
}

async function renderOverlayTasks(id) {
  try {
    let data = await readData(TASKS_URL + `/${id}`);
    taskOverlay.innerHTML = "";
    taskOverlay.innerHTML += generateTaskOverlayHTML(id, data);
  } catch (error) {
    console.error("Error rendering tasks:", error);
  }
}

function showOverlayTask() {
  taskOverlay.classList.remove("d-none");
}

function disableOverlayTask() {
  taskOverlay.classList.add("d-none");
}
