let currentDraggedElement;

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
 * if a click ouside the contact list is registered it hides the dropdown
 *
 * @param {event} event - registers a click on the page
 */
function handleClick(event) {
  const modal = document.getElementById(
    "boardOverlayEditContactsDropdownOptions"
  );
  const dropdown = document.getElementById(
    "boardOverlayEditContactsDropdownButtonToToggle"
  );
  const isClickInside = modal.contains(event.target);
  const isClickedDropdown = dropdown.contains(event.target);
  if (
    !isClickInside &&
    !modal.classList.contains("d-none") &&
    !isClickedDropdown
  ) {
    boardOverlayEditToggleContacts();
  }
}
