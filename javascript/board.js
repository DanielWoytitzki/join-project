let boardContacts;
let boardTasks;
let boardPositionToDo = document.getElementById("taskFieldToDo");
let boardPositionInProgress = document.getElementById("taskFieldInProgress");
let boardPositionAwaitFeedback = document.getElementById(
  "taskFieldAwaitFeedback"
);
let boardPositionDone = document.getElementById("taskFieldDone");
let boardSearchInput = document.getElementById("boardSearchInput");
let boardOverlayTask = document.getElementById("taskOverlay");
let currentDraggedElement;

async function boardInit() {
  await boardPullContacts();
  await boardRenderTasks();
  renderTemplates();
}

async function boardPullContacts() {
  try {
    boardContacts = await readData(CONTACTS_URL);
  } catch (error) {
    console.error("Error rendering tasks:", error);
  }
}

async function boardRenderTasks() {
  boardClearTasks();
  boardTasks = "";
  try {
    boardTasks = await readData(TASKS_URL);
    boardDisplay();
    updateDraggableStatus();
  } catch (error) {
    console.error("Error rendering tasks:", error);
  }
}

function boardClearTasks() {
  boardPositionToDo.innerHTML = "";
  boardPositionInProgress.innerHTML = "";
  boardPositionAwaitFeedback.innerHTML = "";
  boardPositionDone.innerHTML = "";
}

function boardDisplay() {
  for (let key in boardTasks) {
    let task = boardTasks[key];
    let position = task["position"];
    boardDisplayTasks(position, key, task);
    boardDisplayTasksAssignedContacts(task, key);
    boardDisplayTasksSubtasks(task, key);
    boardDisplayCategoryBackground(task, key);
  }
  boardDisplayNoTasks();
  boardTaskFieldDragEmpty();
}

function boardDisplayTasks(position, key, item) {
  let column = "taskField" + position;
  document.getElementById(column).innerHTML += generateTaskHTML(key, item);
}

function boardDisplayTasksAssignedContacts(task, id) {
  if (task.hasOwnProperty("assignedContacts")) {
    let assignedContacts = task["assignedContacts"];
    let taskId = document.getElementById(`boardTasksContacts${id}`);
    let counter = 0;
    for (let i = 0; i < assignedContacts.length; i++) {
      let contact = assignedContacts[i];
      for (let key in boardContacts) {
        if (key == contact && counter == 0) {
          let contactName = boardContacts[key]["name"];
          let initials = getInitials(contactName);
          let contactBackgroundColor = boardContacts[key]["color"];
          taskId.innerHTML += generateTaskContacts(
            initials,
            contactBackgroundColor
          );
          counter++;
        } else if (key == contact && counter > 0) {
          let contactName = boardContacts[key]["name"];
          let initials = getInitials(contactName);
          let left = counter * 8;
          let contactBackgroundColor = boardContacts[key]["color"];
          taskId.innerHTML += generateTaskContactsTwo(
            initials,
            left,
            contactBackgroundColor
          );
          counter++;
        }
      }
    }
  }
}

function boardDisplayTasksSubtasks(task, id) {
  if (task.hasOwnProperty("subtasks")) {
    let taskId = document.getElementById(`boardTasksSubtasks${id}`);
    let subtasks = task["subtasks"];
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

function boardDisplayCategoryBackground(task, key) {
  if (task["category"] == "User Story") {
    document.getElementById(`boardTasksCategory${key}`).style.background =
      "#0038FF";
  } else if (task["category"] == "Technical Task") {
    document.getElementById(`boardTasksCategory${key}`).style.background =
      "#20D7C1";
  }
}

function boardDisplayNoTasks() {
  if (!boardPositionToDo.hasChildNodes()) {
    boardPositionToDo.innerHTML += generateNoTaskAwaitFeedback();
  }
  if (!boardPositionInProgress.hasChildNodes()) {
    boardPositionInProgress.innerHTML += generateNoTaskDone();
  }
  if (!boardPositionAwaitFeedback.hasChildNodes()) {
    boardPositionAwaitFeedback.innerHTML += generateNoTaskAwaitFeedback();
  }
  if (!boardPositionDone.hasChildNodes()) {
    boardPositionDone.innerHTML += generateNoTaskDone();
  }
}

/* ======== Drag & Drop ====== */

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
  setTimeout(boardRenderTasks, 200);
}

function boardTaskFieldDragEmpty() {
  boardPositionToDo.innerHTML += generateTaskFieldDragEmpty("ToDo");
  boardPositionInProgress.innerHTML += generateTaskFieldDragEmpty("InProgress");
  boardPositionAwaitFeedback.innerHTML +=
    generateTaskFieldDragEmpty("AwaitFeedback");
  boardPositionDone.innerHTML += generateTaskFieldDragEmpty("Done");
}

function highlight(id) {
  document.getElementById(`taskFieldEmpty${id}`).classList.remove("d-none");
}

function removeHighlight(id) {
  document.getElementById(`taskFieldEmpty${id}`).classList.add("d-none");
}

function whileDragging(id) {
  document.getElementById(`task${id}`).classList.add("task-on-drag-rotate");
}

/* ======== Search ====== */

boardSearchInput.addEventListener("input", boardSearch);

function boardSearch() {
  boardClearTasks();
  let filterWord = boardSearchInput.value.toLowerCase();
  for (let key in boardTasks) {
    let title = boardTasks[key]["title"];
    let description = boardTasks[key]["description"];
    if (
      title.toLowerCase().includes(filterWord) ||
      description.toLowerCase().includes(filterWord)
    ) {
      boardDisplaySearch(key);
    }
  }
  boardDisplayNoTasks();
}

function boardDisplaySearch(key) {
  let task = boardTasks[key];
  let position = task["position"];
  boardDisplayTasks(position, key, task);
  boardDisplayTasksAssignedContacts(task, key);
  boardDisplayTasksSubtasks(task, key);
  boardDisplayCategoryBackground(task, key);
}

/* ======== Overlay ====== */

function boardOverlayRender(id) {
  boardOverlayDisplay();
  boardOverlayDisplayTask(id);
}

function boardOverlayDisplay() {
  boardOverlayTask.classList.remove("d-none");
}

function boardOverlayDisplayTask(id) {
  boardOverlayTask.innerHTML = "";
  let task = boardTasks[id];
  let priority = nameWithUpperCase(task["priority"]);
  boardOverlayTask.innerHTML += generateTaskOverlayHTML(id, task, priority);
  boardOverlayDisplayTaskAssignedContacts(task, id);
  boardOverlayDisplayTaskSubtasks(task, id);
  boardOverlayDisplayTaskCategoryBackgroundColor(task, id);
}

function boardOverlayDisplayTaskAssignedContacts(task, id) {
  if (task.hasOwnProperty("assignedContacts")) {
    let assignedContacts = task["assignedContacts"];
    let taskId = document.getElementById(`boardOverlayTaskContacts${id}`);
    for (let i = 0; i < assignedContacts.length; i++) {
      let contact = assignedContacts[i];
      for (let key in boardContacts) {
        if (key == contact) {
          let contactName = boardContacts[key]["name"];
          let initials = getInitials(contactName);
          let contactBackgroundColor = boardContacts[key]["color"];
          taskId.innerHTML += generateTaskOverlayContacts(
            initials,
            contactName,
            contactBackgroundColor
          );
        }
      }
    }
  }
}

function boardOverlayDisplayTaskSubtasks(task, id) {
  if (task.hasOwnProperty("subtasks")) {
    let taskId = document.getElementById(`boardOverlayTaskSubtasks${id}`);
    let subtasks = task["subtasks"];
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

function boardOverlayDisplayTaskCategoryBackgroundColor(task, key) {
  if (task["category"] == "User Story") {
    document.getElementById(`categoryOverlay${key}`).style.background =
      "#0038FF";
  } else if (task["category"] == "Technical Task") {
    document.getElementById(`categoryOverlay${key}`).style.background =
      "#20D7C1";
  }
}

async function boardOverlayTaskSubtaskToggle(state, id, key) {
  if (state == "checked") {
    let path = TASKS_URL + "/" + id + "/subtasks/" + key + "/subtaskState";
    let data = "unchecked";
    await putData(path, data);
    await boardRenderTasks();
    boardOverlayRender(id);
  } else if (state == "unchecked") {
    let path = TASKS_URL + "/" + id + "/subtasks/" + key + "/subtaskState";
    let data = "checked";
    await putData(path, data);
    await boardRenderTasks();
    boardOverlayRender(id);
  }
}

async function boardOverlayTaskHide() {
  boardOverlayTask.classList.add("d-none");
  await boardRenderTasks();
  boardSearchInput.value = "";
}

async function taskOverlayDeleteTask(id) {
  let path = TASKS_URL + "/" + id;
  await deleteData(path);
  await boardRenderTasks();
  boardOverlayTaskHide();
}

function boardTaskReposition(id) {
  if (document.getElementById(`boardTaskRepositionOverlay${id}`)) {
    boardTaskRepositionClose(id);
  } else {
    document.getElementById(`task${id}`).innerHTML +=
      generateTaskRepositionHTML(id);
  }
}

function boardTaskRepositionRender(id, position) {
  currentDraggedElement = id;
  moveTo(position);
}

function boardTaskRepositionClose(id) {
  if (document.getElementById(`boardTaskRepositionOverlay${id}`)) {
    document.getElementById(`boardTaskRepositionOverlay${id}`).remove();
  }
}

function updateDraggableStatus() {
  const draggableDivs = document.querySelectorAll(
    ".board-body-body-task, .board-body-body-task-header, .board-body-body-task-text, .board-body-body-task-progress"
  );
  const isNarrow = window.innerWidth < 1250;

  draggableDivs.forEach((div) => {
    if (isNarrow) {
      div.setAttribute("draggable", "false");
    } else {
      div.setAttribute("draggable", "true");
    }
  });
}

window.addEventListener("resize", updateDraggableStatus);

document.addEventListener("DOMContentLoaded", function () {
  const boardBodyToDo = document.getElementById("taskFieldToDo");
  let isDown = false;
  let startX;
  let scrollLeft;

  boardBodyToDo.addEventListener("mousedown", (e) => {
    isDown = true;
    boardBodyToDo.classList.add("active");
    startX = e.pageX - boardBodyToDo.offsetLeft;
    scrollLeft = boardBodyToDo.scrollLeft;
  });

  boardBodyToDo.addEventListener("mouseleave", () => {
    isDown = false;
    boardBodyToDo.classList.remove("active");
  });

  boardBodyToDo.addEventListener("mouseup", () => {
    isDown = false;
    boardBodyToDo.classList.remove("active");
  });

  boardBodyToDo.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - boardBodyToDo.offsetLeft;
    const walk = (x - startX) * 2;
    boardBodyToDo.scrollLeft = scrollLeft - walk;
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const boardBodyInProgress = document.getElementById("taskFieldInProgress");
  let isDown = false;
  let startX;
  let scrollLeft;

  boardBodyInProgress.addEventListener("mousedown", (e) => {
    isDown = true;
    boardBodyInProgress.classList.add("active");
    startX = e.pageX - boardBodyInProgress.offsetLeft;
    scrollLeft = boardBodyInProgress.scrollLeft;
  });

  boardBodyInProgress.addEventListener("mouseleave", () => {
    isDown = false;
    boardBodyInProgress.classList.remove("active");
  });

  boardBodyInProgress.addEventListener("mouseup", () => {
    isDown = false;
    boardBodyInProgress.classList.remove("active");
  });

  boardBodyInProgress.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - boardBodyInProgress.offsetLeft;
    const walk = (x - startX) * 2;
    boardBodyInProgress.scrollLeft = scrollLeft - walk;
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const boardBodyAwaitFeedback = document.getElementById(
    "taskFieldAwaitFeedback"
  );
  let isDown = false;
  let startX;
  let scrollLeft;

  boardBodyAwaitFeedback.addEventListener("mousedown", (e) => {
    isDown = true;
    boardBodyAwaitFeedback.classList.add("active");
    startX = e.pageX - boardBodyAwaitFeedback.offsetLeft;
    scrollLeft = boardBodyAwaitFeedback.scrollLeft;
  });

  boardBodyAwaitFeedback.addEventListener("mouseleave", () => {
    isDown = false;
    boardBodyAwaitFeedback.classList.remove("active");
  });

  boardBodyAwaitFeedback.addEventListener("mouseup", () => {
    isDown = false;
    boardBodyAwaitFeedback.classList.remove("active");
  });

  boardBodyAwaitFeedback.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - boardBodyAwaitFeedback.offsetLeft;
    const walk = (x - startX) * 2;
    boardBodyAwaitFeedback.scrollLeft = scrollLeft - walk;
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const boardBodyDone = document.getElementById("taskFieldDone");
  let isDown = false;
  let startX;
  let scrollLeft;

  boardBodyDone.addEventListener("mousedown", (e) => {
    isDown = true;
    boardBodyDone.classList.add("active");
    startX = e.pageX - boardBodyDone.offsetLeft;
    scrollLeft = boardBodyDone.scrollLeft;
  });

  boardBodyDone.addEventListener("mouseleave", () => {
    isDown = false;
    boardBodyDone.classList.remove("active");
  });

  boardBodyDone.addEventListener("mouseup", () => {
    isDown = false;
    boardBodyDone.classList.remove("active");
  });

  boardBodyDone.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - boardBodyDone.offsetLeft;
    const walk = (x - startX) * 2;
    boardBodyDone.scrollLeft = scrollLeft - walk;
  });
});
