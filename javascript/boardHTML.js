function generateTaskHTML(taskId, task) {
  return `<div draggable="true" ondragstart="startDragging('${taskId}')" class="board-column-body-task" id="task${taskId}" onclick="openTaskDetails('${taskId}')">
            <div>
                <span class="board-column-body-task-label">${task["category"]}</span>
            </div>
            <div class="board-column-body-task-text">
                <h3>${task["title"]}</h3>
                <span>${task["description"]}</span>
            </div>
            <div class="board-column-body-task-progress">
                <div class="board-column-body-task-progress-bar">
                    <div class="board-column-body-task-progress-bar-progress"></div>
                </div>
                <span>1/2</span>
                <span>Subtasks</span>
            </div>
            <div class="board-column-body-task-bottom">
                <div class="board-column-body-task-bottom-contactlist">
                    <div class="board-column-body-task-bottom-contact">
                        <span>AM</span>
                    </div>
                    <div class="board-column-body-task-bottom-contact left">
                        <span>EM</span>
                    </div>
                </div>
                <div class="board-column-body-task-bottom-icon">
                    <img src="./img/prio-${task["priority"]}.svg" alt="" />
                </div>
            </div>
        </div>`;
}

function generateTaskOverlayHTML(taskId, task, priority) {
  return `<div class="board-overlay-task" onclick="event.stopPropagation()" id="taskOverlay${taskId}">
            <div class="board-overlay-task-header">
                <span>${task["category"]}</span>
                <img src="./img/close.svg" alt="" onclick="disableOverlayTask()" />
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
  return `<div class="board-column-body-no-task">
            <span>No tasks To do</span>
          </div>`;
}

function generateNoTaskInProgress() {
  return `<div class="board-column-body-no-task">
            <span>No tasks in progress</span>
          </div>`;
}

function generateNoTaskAwaitFeedback() {
  return `<div class="board-column-body-no-task">
            <span>No tasks await feedback</span>
          </div>`;
}

function generateNoTaskDone() {
  return `<div class="board-column-body-no-task">
            <span>No tasks done</span>
          </div>`;
}
