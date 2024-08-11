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
        } else if (key == contact && counter > 0 && counter < 3) {
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
        } else if (counter == 3 && assignedContacts.length > 3) {
          let count = assignedContacts.length - 3;
          let left = counter * 8;
          taskId.innerHTML += generateTaskContactsPlusCount(count, left);
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
 * renders the overlay of specific task when task is clicked
 *
 * @param {string} id - the id of the task in the database
 */
function boardOverlayRender(id) {
  boardOverlayDisplay(id);
  boardOverlayDisplayTask(id);
}

/**
 * reveals the overlay HTML
 */
function boardOverlayDisplay(id) {
  boardOverlayTask.classList.remove("d-none");
  setTimeout(() => {
    document
      .getElementById(`taskOverlay${id}`)
      .classList.remove("transition-in-from-right");
  }, 200);
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
