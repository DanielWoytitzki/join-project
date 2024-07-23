function generateTaskHTML(taskId, task) {
  return `<div draggable="true" ondragstart="startDragging('${taskId}')" class="board-body-body-task" id="task${taskId}" onclick="openTaskDetails('${taskId}')">
            <div>
                <span class="board-body-body-task-label">${task["category"]}</span>
            </div>
            <div class="board-body-body-task-text">
                <h3>${task["title"]}</h3>
                <span>${task["description"]}</span>
            </div>
            <div class="board-body-body-task-progress" id="taskSubtasks${taskId}">
            </div>
            <div class="board-body-body-task-bottom">
                <div class="board-body-body-task-bottom-contactlist" id="taskContacts${taskId}">
                </div>
                <div class="board-body-body-task-bottom-icon">
                    <img src="./img/prio-${task["priority"]}.svg" alt="" />
                </div>
            </div>
        </div>`;
}

function generateTaskContacts(initials) {
  return `<div class="board-body-body-task-bottom-contact">
            <span>${initials}</span>
          </div>`;
}

function generateTaskContactsTwo(initials, left) {
  return `<div class="board-body-body-task-bottom-contact" style="left: -${left}px;">
              <span>${initials}</span>
            </div>`;
}

function generateTaskSubtasks(progress, subtaskDone, subtaskTotal) {
  return `<div class="board-body-body-task-progress-bar">
                <div class="board-body-body-task-progress-bar-progress" style="width: ${progress}%;"></div>
            </div>
            <span>${subtaskDone}/${subtaskTotal}</span>
            <span>Subtasks</span>`;
}

function generateTaskOverlayHTML(taskId, task, priority) {
  return `<div class="board-overlay-task" onclick="event.stopPropagation()" id="taskOverlay${taskId}">
            <div class="board-overlay-task-header">
                <span>${task["category"]}</span>
                <img class="closeIcon" src="./img/close.svg" alt="" onclick="disableOverlayTask()" />
            </div>
            <h1 class="board-overlay-task-title">
                ${task["title"]}
            </h1>
            <span class="board-overlay-task-description">
                ${task["description"]}
            </span>
            <div class="board-overlay-task-date">
                <span style="color: #2a3647">Due date:</span>
                <span>${task["due-date"]}</span>
            </div>
            <div class="board-overlay-task-priority">
                <span style="color: #2a3647">Priority:</span>
                <div class="board-overlay-task-priority-inner">
                    <span>${priority}</span>
                    <img src="./img/prio-${task["priority"]}.svg" alt="" />
                </div>
            </div>
            <div class="board-overlay-task-contacts">
                <span class="board-overlay-task-contacts-span">Assigned To:</span>
                <ul class="board-overlay-task-contactlist">
                    <li class="board-overlay-task-contactlist-contact">
                        <div class="board-overlay-task-contactlist-contact-icon" style="background: #1fd7c1">
                            <span>EM</span>
                        </div>
                        <span>Emmanuel Mauer</span>
                    </li>
                    <li class="board-overlay-task-contactlist-contact">
                        <div class="board-overlay-task-contactlist-contact-icon" style="background: #462f8a">
                            <span>MB</span>
                        </div>
                        <span>Marcel Bauer</span>
                    </li>
                </ul>
            </div>
            <div class="board-overlay-task-subtasks">
                <span class="board-overlay-task-subtasks-span">Subtasks</span>
                <ul class="board-overlay-task-subtasklist">
                    <li class="board-overlay-task-subtasklist-subtask">
                        <input type="checkbox" />
                        <span>Implement Recipe Recommendation</span>
                    </li>
                    <li class="board-overlay-task-subtasklist-subtask">
                        <input type="checkbox" />
                        <span>Start Page Layout</span>
                    </li>
                </ul>
            </div>
            <div class="board-overlay-task-footer">
                <div class="board-overlay-task-footer-inner">
                    <div class="board-overlay-task-footer-inner-inner">
                        <img src="./img/delete.svg" alt="" />
                        <span>Delete</span>
                    </div>
                    <hr class="board-overlay-task-footer-devider" />
                    <div class="board-overlay-task-footer-inner-inner">
                        <img src="./img/edit.svg" alt="" />
                        <span>Edit</span>
                    </div>
                </div>
            </div>
        </div>`;
}

function generateNoTaskToDo() {
  return `<div class="board-body-body-no-task">
            <span>No tasks To do</span>
          </div>`;
}

function generateNoTaskInProgress() {
  return `<div class="board-body-body-no-task">
            <span>No tasks in progress</span>
          </div>`;
}

function generateNoTaskAwaitFeedback() {
  return `<div class="board-body-body-no-task">
            <span>No tasks await feedback</span>
          </div>`;
}

function generateNoTaskDone() {
  return `<div class="board-body-body-no-task">
            <span>No tasks done</span>
          </div>`;
}

function generateContactList(contactId, initials, name, contactState) {
  return `<div id="contact'${contactId}'" class="add-task-dropdown-option add-task-contact-box" onclick="event.stopPropagation()">
            <div class="add-task-contact-content">
                <div class="add-task-contact-icon" style="background: #462f8a">
                    <span>${initials}</span>
                </div>
                <span>${name}</span>
            </div>
            <img src="./img/check-button-${contactState}.svg"
                 alt=""
                 onclick="contactSelect('${contactId}')"/>
          </div>`;
}

function generateSubtaskList(subtaskId, subtaskTitle) {
  return `<div id="subtask'${subtaskId}'" class="add-task-subtask-task">
            <li>${subtaskTitle}</li>
            <div class="add-task-subtask-add-icon-section">
                <img onclick="subtaskEditTask(${subtaskId})" id="addTaskSubtaskEdit" src="./img/edit.svg" alt="" />
                <hr class="add-task-subtask-devider" />
                <img onclick="subtaskDeleteTask(${subtaskId})" id="addTaskSubtaskDelete" src="./img/delete.svg" alt="" />
            </div>
          </div>`;
}

function generateSubtaskEdit(subtaskId) {
  return `<div class="add-task-subtask-edit">
            <input id="subtaskInputEditValue" class="add-task-subtask-edit-input" type="text" />
            <div class="add-task-subtask-edit-icons">
                <div class="add-task-subtask-icon">
                    <img onclick="subtaskDeleteTask(${subtaskId})" src="./img/delete.svg" alt="" class="filter" />
                </div>
                <hr />
                <div class="add-task-subtask-icon">
                    <img onclick="subtaskSubmitEditTask(${subtaskId})" src="./img/check.svg" alt="" class="filter" />
                </div>
            </div>
          </div>`;
}
