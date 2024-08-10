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

/**
 * Initializing the Board by running various functions
 */
async function boardInit() {
  await boardPullContacts();
  await boardRenderTasks();
  renderTemplates();
}

/**
 * Pulling the contacts from the database and stores them in a variable
 * if an error occurs, an error message appears in the console
 */
async function boardPullContacts() {
  try {
    boardContacts = await readData(CONTACTS_URL);
  } catch (error) {
    console.error("Error rendering tasks:", error);
  }
}

/**
 * Clear the borad
 * Pulling the tasks from the database and stores them in a variable
 * If an error occurs, an error message appears in the console
 */
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

/**
 * Clearing the task fields
 */
function boardClearTasks() {
  boardPositionToDo.innerHTML = "";
  boardPositionInProgress.innerHTML = "";
  boardPositionAwaitFeedback.innerHTML = "";
  boardPositionDone.innerHTML = "";
}

/**
 * Iterating through each task to generate
 */
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

/**
 * Generate tasks in the right position field
 *
 * @param {string} position - the task field
 * @param {string} key - the id of the task in the database
 * @param {object} task - the content of the task
 */
function boardDisplayTasks(position, key, task) {
  let column = "taskField" + position;
  document.getElementById(column).innerHTML += generateTaskHTML(key, task);
}

/**
 * checks if a task has assigned contacts
 * displays the contact initials on the cards
 *
 * @param {object} task - the content of the task
 * @param {string} id - the id of the task in the database
 */
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

/**
 * checks if a task has subtasks
 * displays the subtask-progress on the cards
 * displays the count of unfinished subtasks on the cards
 * displays the subtask-total-count on the cards
 *
 * @param {object} task - the content of the task
 * @param {string} id - the id of the task in the database
 */
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

/**
 * gives a background color to a div with a certain category value in the database
 *
 * @param {object} task - the content of the task
 * @param {string} id - the id of the task in the database
 */
function boardDisplayCategoryBackground(task, id) {
  if (task["category"] == "User Story") {
    document.getElementById(`boardTasksCategory${id}`).style.background =
      "#0038FF";
  } else if (task["category"] == "Technical Task") {
    document.getElementById(`boardTasksCategory${id}`).style.background =
      "#20D7C1";
  }
}

/**
 * displays a special-card when no task is in a task field
 */
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

/**
 * assign the id of the dragged element to a variabele
 *
 * @param {string} id - the id of the task in the database
 */
function startDragging(id) {
  currentDraggedElement = id;
}

/**
 * prevents default behaviour
 *
 * @param {event} ev - drag event listener
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * saves the position of the droped element to the database
 *
 * @param {string} position - position of dragged element
 */
function moveTo(position) {
  let path = TASKS_URL + "/" + currentDraggedElement + "/position";
  let data = position;
  putData(path, data);
  setTimeout(boardRenderTasks, 200);
}

/**
 * generates a hidden empty task border to every task field
 */
function boardTaskFieldDragEmpty() {
  boardPositionToDo.innerHTML += generateTaskFieldDragEmpty("ToDo");
  boardPositionInProgress.innerHTML += generateTaskFieldDragEmpty("InProgress");
  boardPositionAwaitFeedback.innerHTML +=
    generateTaskFieldDragEmpty("AwaitFeedback");
  boardPositionDone.innerHTML += generateTaskFieldDragEmpty("Done");
}

/**
 * reveal the hidden empty task
 *
 * @param {string} id - the id of the task in the database
 */
function highlight(id) {
  document.getElementById(`taskFieldEmpty${id}`).classList.remove("d-none");
}

/**
 * hide the empty revealed task
 *
 * @param {string} id - the id of the task in the database
 */
function removeHighlight(id) {
  document.getElementById(`taskFieldEmpty${id}`).classList.add("d-none");
}

/**
 * add a rotation class to the current dragged element
 *
 * @param {string} id - the id of the task in the database
 */
function whileDragging(id) {
  document.getElementById(`task${id}`).classList.add("task-on-drag-rotate");
}

/**
 * listens for a input in search bar
 */
boardSearchInput.addEventListener("input", boardSearch);

/**
 * put searched words in lower case
 * checks if the word is in the title or description of any task
 */
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

/**
 * displays only the matching tasks from the search
 *
 * @param {string} id - the id of the task in the database
 */
function boardDisplaySearch(id) {
  let task = boardTasks[id];
  let position = task["position"];
  boardDisplayTasks(position, id, task);
  boardDisplayTasksAssignedContacts(task, id);
  boardDisplayTasksSubtasks(task, id);
  boardDisplayCategoryBackground(task, id);
}

/**
 * renders the overlay of specific task when task is clicked
 *
 * @param {string} id - the id of the task in the database
 */
function boardOverlayRender(id) {
  boardOverlayDisplay();
  boardOverlayDisplayTask(id);
}

/**
 * reveals the overlay HTML
 */
function boardOverlayDisplay() {
  boardOverlayTask.classList.remove("d-none");
}

/**
 * clears the overlay content
 * generate content to overlay
 *
 * @param {string} id - the id of the task in the database
 */
function boardOverlayDisplayTask(id) {
  boardOverlayTask.innerHTML = "";
  let task = boardTasks[id];
  let priority = nameWithUpperCase(task["priority"]);
  boardOverlayTask.innerHTML += generateTaskOverlayHTML(id, task, priority);
  boardOverlayDisplayTaskAssignedContacts(task, id);
  boardOverlayDisplayTaskSubtasks(task, id);
  boardOverlayDisplayTaskCategoryBackgroundColor(task, id);
}

/**
 * checks if the selected task has assigned contacts
 * display the assigned contact initials with corresponding background color
 *
 * @param {object} task - the content of the selected task in the database
 * @param {string} id - the id of the cselected task in the database
 */
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

/**
 * checks if the selected task has subtasks
 * display the checked subtasks
 * display the unchecked subtasks
 *
 * @param {object} task - the content of the selected task in the database
 * @param {string} id - the id of the cselected task in the database
 */
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

/**
 * gives a background color to a div with a certain category value of the task
 *
 * @param {object} task - the content of the selected task
 * @param {string} id - the id of the selected task in the database
 */
function boardOverlayDisplayTaskCategoryBackgroundColor(task, id) {
  if (task["category"] == "User Story") {
    document.getElementById(`categoryOverlay${id}`).style.background =
      "#0038FF";
  } else if (task["category"] == "Technical Task") {
    document.getElementById(`categoryOverlay${id}`).style.background =
      "#20D7C1";
  }
}

/**
 * checks if the subtask is checked or unchecked
 * post data of current state to the database
 *
 * @param {string} state - state of selected subtask
 * @param {string} id - the id of the selected task in the database
 * @param {string} key - the id of the selected subtask of the selected task
 */
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

/**
 * hides the overlay of the selected task
 */
async function boardOverlayTaskHide() {
  boardOverlayTask.classList.add("d-none");
  await boardRenderTasks();
  boardSearchInput.value = "";
}

/**
 * deletes selected task in the database
 *
 * @param {string} id - the id of the selected task in the database
 */
async function taskOverlayDeleteTask(id) {
  let path = TASKS_URL + "/" + id;
  await deleteData(path);
  await boardRenderTasks();
  boardOverlayTaskHide();
}

/**
 * opens menu to relocate a task to a different task field
 *
 * @param {string} id - the id of the selected task in the database
 */
function boardTaskReposition(id) {
  if (document.getElementById(`boardTaskRepositionOverlay${id}`)) {
    boardTaskRepositionClose(id);
  } else {
    document.getElementById(`task${id}`).innerHTML +=
      generateTaskRepositionHTML(id);
  }
}

/**
 * set new position of the selected task
 *
 * @param {string} id - the id of the selected task in the database
 * @param {string} position - the new position of the selected task
 */
function boardTaskRepositionRender(id, position) {
  currentDraggedElement = id;
  moveTo(position);
}

/**
 * close the relocation menu
 *
 * @param {string} id - the id of the selected task in the database
 */
function boardTaskRepositionClose(id) {
  if (document.getElementById(`boardTaskRepositionOverlay${id}`)) {
    document.getElementById(`boardTaskRepositionOverlay${id}`).remove();
  }
}

/**
 * listens to resizing of the browser window
 * calls draggabbility function to activate or diactivate drag and drop
 */
window.addEventListener("resize", updateDraggableStatus);

/**
 * deactivate the draggability of the task when width of the browser window is under 1250px
 */
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

/**
 * when mouse is clicked in specific task field, tasks can be scrolled in x axis with mouse movement to left and right
 */
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

/**
 * when mouse is clicked in specific task field, tasks can be scrolled in x axis with mouse movement to left and right
 */
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

/**
 * when mouse is clicked in specific task field, tasks can be scrolled in x axis with mouse movement to left and right
 */
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

/**
 * when mouse is clicked in specific task field, tasks can be scrolled in x axis with mouse movement to left and right
 */
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
