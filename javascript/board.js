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
let boardOverlayEditTask = document.getElementById("taskOverlayEdit");
let currentDraggedElement;
let boardOverlayEditContactsState = false;
let boardOverlayEditContacts = [];

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
  try {
    boardTasks = await readData(TASKS_URL);
    boardDisplay();
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
          taskId.innerHTML += generateTaskOverlayContacts(
            initials,
            contactName
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

function boardOverlayTaskHide() {
  boardOverlayTask.classList.add("d-none");
  boardRenderTasks();
  boardSearchInput.value = "";
}

async function taskOverlayDeleteTask(id) {
  let path = TASKS_URL + "/" + id;
  await deleteData(path);
  await boardRenderTasks();
  boardOverlayTaskHide();
}

/* ======== Overlay Edit ====== */

function boardOverlayEditRender(id) {
  boardOverlayEditDisplay();
  boardOverlayEditDisplayTask(id);
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
  addTaskPrioritySelect(task["priority"]);
  boardOverlayEditContacts = [];
  boardOverlayEditPullContacts(task, id);
  // boardOverlayEditPushCheckedContacts(task["assignedContacts"], id);
  //contacts
  //subtasks
  //submit
}

function boardOverlayEditPullContacts(task) {
  let assignedContacts = task["assignedContacts"];

  for (let key in boardContacts) {
    for (let i = 0; i < assignedContacts.length; i++) {
      console.log(assignedContacts[i]);
      if (key == assignedContacts[i]) {
        boardOverlayEditContacts.push({
          id: key,
          contact: boardContacts[key]["name"],
          state: "checked",
        });
      }
    }

    if (
      !boardOverlayEditContacts.hasOwnProperty({
        id: key,
      })
    ) {
      console.log("hello");
    }
  }
  console.log(boardOverlayEditContacts);
}

// function boardOverlayEditPushCheckedContacts(assignedContacts, id) {
//   // let taskId = document.getElementById(`boardOverlayTaskContacts${id}`);
//   for (let i = 0; i < assignedContacts.length; i++) {
//     let contact = assignedContacts[i];
//     for (let key in boardContacts) {
//       if (key == contact) {
//         let contactName = boardContacts[key]["name"];
//         let initials = getInitials(contactName);
//         taskId.innerHTML += generateTaskOverlayContacts(initials, contactName);
//       }
//     }
//   }

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
  console.log(boardOverlayEditContacts);
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

function contactSelectEdit(key) {
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

function disableOverlayTaskEdit() {
  boardOverlayEditTask.classList.add("d-none");
  boardRenderTasks();
  boardSearchInput.value = "";
}
