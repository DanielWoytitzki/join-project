/**
 * Generate the HTML for the tasks loaded in the board
 *
 * @param {string} taskId - the id of the task in the database
 * @param {object} task - the content of the task
 * @returns
 */
function generateTaskHTML(taskId, task) {
  return `<div draggable="true" ondrag="whileDragging('${taskId}')" ondragstart="startDragging('${taskId}')" class="board-body-body-task" id="task${taskId}" onclick="boardOverlayRender('${taskId}'), boardTaskRepositionClose('${taskId}')">
            <div class="board-body-body-task-header">
                <span class="board-body-body-task-label" id="boardTasksCategory${taskId}">${task["category"]}</span>
                <button onclick="event.stopPropagation(), boardTaskReposition('${taskId}')" id="boardTaskRepositionButton${taskId}">
                    <img id="boardTaskReposition${taskId}" src="./img/arrow-drop-down.svg" alt="" draggable="false">
                </button>                
            </div>
            <div class="board-body-body-task-text">
                <h3>${task["title"]}</h3>
                <span>${task["description"]}</span>
            </div>
            <div class="board-body-body-task-progress" id="boardTasksSubtasks${taskId}">
            </div>
            <div class="board-body-body-task-bottom">
                <div class="board-body-body-task-bottom-contactlist" id="boardTasksContacts${taskId}">
                </div>
                <div class="board-body-body-task-bottom-icon">
                    <img src="./img/prio-${task["priority"]}.svg" alt="" draggable="false"/>
                </div>
            </div>
        </div>`;
}

/**
 * Generates the HTML for the relocation menu for repositioning the task to a different task field
 *
 * @param {string} taskId - the id of the task in the database
 * @returns
 */
function generateTaskRepositionHTML(taskId) {
  return `<div id="boardTaskRepositionOverlay${taskId}" class="board-body-body-task-reposition" onclick="event.stopPropagation()">
              <span onclick="boardTaskRepositionRender('${taskId}', 'ToDo')">To Do</span>
              <span onclick="boardTaskRepositionRender('${taskId}', 'InProgress')">In progress</span>
              <span onclick="boardTaskRepositionRender('${taskId}', 'AwaitFeedback')">Await Feedback</span>
              <span onclick="boardTaskRepositionRender('${taskId}', 'Done')">Done</span>
          </div>`;
}

/**
 * Generates the HTML for the first contact initial circles in every task
 *
 * @param {string} initials - the initials of the contact name
 * @param {string} backgroundColor - the background color of the contact
 * @returns
 */
function generateTaskContacts(initials, backgroundColor) {
  return `<div class="board-body-body-task-bottom-contact" style="background-color: ${backgroundColor};">
            <span>${initials}</span>
          </div>`;
}

/**
 * Generates the HTML for the contact initial circles in every task starting from the second contact
 * shiftes the circle to the left to overlap
 *
 * @param {string} initials - the initials of the contact name
 * @param {number} left - the value which shiftes the contact cicrle to the left
 * @param {string} backgroundColor - the background color of the contact
 * @returns
 */
function generateTaskContactsTwo(initials, left, backgroundColor) {
  return `<div class="board-body-body-task-bottom-contact" style="left: -${left}px; background-color: ${backgroundColor};">
              <span>${initials}</span>
            </div>`;
}

/**
 * Generates the HTML for the subtask progress bar, the number of finished subtaks and the number of total subtasks
 *
 * @param {number} progress - the calculated width in percent of the completed tasks devided by the total tasks
 * @param {number} subtaskDone - the number of subtasks done
 * @param {number} subtaskTotal - the number of total subtasks
 * @returns
 */
function generateTaskSubtasks(progress, subtaskDone, subtaskTotal) {
  return `<div class="board-body-body-task-progress-bar">
                <div class="board-body-body-task-progress-bar-progress" style="width: ${progress}%;"></div>
            </div>
            <span>${subtaskDone}/${subtaskTotal}</span>
            <span>Subtasks</span>`;
}

/**
 * Generates the HTML for the overlay for the selected task
 *
 * @param {string} taskId - the id of the selected task in the database
 * @param {object} task - the content of the selected task
 * @param {string} priority - the pirority of the selected task
 * @returns
 */
function generateTaskOverlayHTML(taskId, task, priority) {
  return `<div class="board-overlay-task transition-in-from-right" onclick="event.stopPropagation()" id="taskOverlay${taskId}">
            <div class="board-overlay-task-header">
                <span id="categoryOverlay${taskId}">${task["category"]}</span>
                <img class="closeIcon" src="./img/close.svg" alt="" onclick="boardOverlayTaskHide()" />
            </div>
            <h1 class="board-overlay-task-title">
                ${task["title"]}
            </h1>
            <span class="board-overlay-task-description">
                ${task["description"]}
            </span>
            <div class="board-overlay-task-date">
                <span style="color: #2a3647">Due date:</span>
                <span>${task["dueDate"]}</span>
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
                <ul class="board-overlay-task-contactlist" id="boardOverlayTaskContacts${taskId}">
                </ul>
            </div>
            <div class="board-overlay-task-subtasks">
                <span class="board-overlay-task-subtasks-span">Subtasks</span>
                <ul class="board-overlay-task-subtasklist" id="boardOverlayTaskSubtasks${taskId}">
                </ul>
            </div>
            <div class="board-overlay-task-footer">
                <div class="board-overlay-task-footer-inner">
                    <div class="board-overlay-task-footer-inner-inner" onclick="taskOverlayDeleteTask('${taskId}')">
                        <img src="./img/delete.svg" alt="" />
                        <span>Delete</span>
                    </div>
                    <hr class="board-overlay-task-footer-devider" />
                    <div class="board-overlay-task-footer-inner-inner" onclick="boardOverlayEditRender('${taskId}')">
                        <img src="./img/edit.svg" alt="" />
                        <span>Edit</span>
                    </div>
                </div>
            </div>
        </div>`;
}

/**
 * Generates the HTML for the initials and the name of the assigned contacts of the selected task
 *
 * @param {string} initials - the initials of the assigned contact
 * @param {string} name - the name of the assigned contact
 * @param {string} backgroundColor - the background color of the assigned contact
 * @returns
 */
function generateTaskOverlayContacts(initials, name, backgroundColor) {
  return `<li class="board-overlay-task-contactlist-contact">
            <div class="board-overlay-task-contactlist-contact-icon" style="background-color: ${backgroundColor};">
                <span>${initials}</span>
            </div>
            <span>${name}</span>
          </li>`;
}

/**
 * Generates the HTML for the subtasks of the selected task
 *
 * @param {string} subtaskTitle - the title of the subtask
 * @param {string} state - the state of the subtask either checked or unchecked
 * @param {string} id - the id of the task in the database
 * @param {number} key - the id of the subtask in the subtask array of the selected task
 * @returns
 */
function generateTaskOverlaySubtasks(subtaskTitle, state, id, key) {
  return `<li class="board-overlay-task-subtasklist-subtask">
            <img src="./img/check-button-${state}.svg" class="check-hover" onclick="boardOverlayTaskSubtaskToggle('${state}', '${id}', '${key}')" alt=""/>
            <span>${subtaskTitle}</span>
          </li>`;
}

/**
 * Generates the HTML for the to do task field, when no task is in there
 *
 * @returns
 */
function generateNoTaskToDo() {
  return `<div class="board-body-body-no-task">
            <span>No tasks To do</span>
          </div>`;
}

/**
 * Generates the HTML for the in progress task field, when no task is in there
 *
 * @returns
 */
function generateNoTaskInProgress() {
  return `<div class="board-body-body-no-task">
            <span>No tasks in progress</span>
          </div>`;
}

/**
 * Generates the HTML for the await feedback task field, when no task is in there
 *
 * @returns
 */
function generateNoTaskAwaitFeedback() {
  return `<div class="board-body-body-no-task">
            <span>No tasks await feedback</span>
          </div>`;
}

/**
 * Generates the HTML for the done task field, when no task is in there
 *
 * @returns
 */
function generateNoTaskDone() {
  return `<div class="board-body-body-no-task">
            <span>No tasks done</span>
          </div>`;
}

/**
 * Generates the contact list of all contacts and shows which are assigned to the selected task and which not
 *
 * @param {string} contactId - the id of the contact
 * @param {string} initials - the initials of the contact name
 * @param {string} name - the name of the contact
 * @param {string} contactState - the state of the contact, either checked or unchecked
 * @param {string} backgroundColor - the background color of the contact
 * @returns
 */
function generateContactListEdit(
  contactId,
  initials,
  name,
  contactState,
  backgroundColor
) {
  return `<div id="contact'${contactId}'" class="add-task-dropdown-option add-task-contact-box" onclick="event.stopPropagation()">
              <div class="add-task-contact-content">
                  <div class="add-task-contact-icon" style="background: ${backgroundColor}">
                      <span>${initials}</span>
                  </div>
                  <span>${name}</span>
              </div>
              <img src="./img/check-button-${contactState}.svg"
                   alt=""
                   onclick="boardOverlayEditSelectContact('${contactId}')"/>
            </div>`;
}

/**
 * Generate the HTML for the ability to edit a subtask
 *
 * @param {number} subtaskId - the id of the subtask in the subtask array of the selected task
 * @returns
 */
function generateSubtaskEdit(subtaskId) {
  return `<div class="add-task-subtask-edit">
                <input id="boardOverlayEditSubtaskInputEditValue" class="add-task-subtask-edit-input" type="text" />
                <div class="add-task-subtask-edit-icons">
                    <div class="add-task-subtask-icon">
                        <img onclick="boardOverlayEditSubtaskDelete(${subtaskId})" src="./img/delete.svg" alt="" class="filter" />
                    </div>
                    <hr />
                    <div class="add-task-subtask-icon">
                        <img onclick="boardOverlayEditSubtaskSubmitEdit(${subtaskId})" src="./img/check.svg" alt="" class="filter" />
                    </div>
                </div>
              </div>`;
}

function generateTaskFieldDragEmpty(id) {
  return `<div id="taskFieldEmpty${id}" class="board-drag-area-highlight d-none"></div>`;
}
