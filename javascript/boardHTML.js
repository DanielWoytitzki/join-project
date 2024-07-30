function generateTaskHTML(taskId, task) {
  return `<div draggable="true" ondragstart="startDragging('${taskId}')" class="board-body-body-task" id="task${taskId}" onclick="boardOverlayRender('${taskId}')">
            <div>
                <span class="board-body-body-task-label" id="boardTasksCategory${taskId}">${task["category"]}</span>
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

function generateTaskOverlayContacts(initials, name) {
  return `<li class="board-overlay-task-contactlist-contact">
            <div class="board-overlay-task-contactlist-contact-icon" style="background: #1fd7c1">
                <span>${initials}</span>
            </div>
            <span>${name}</span>
          </li>`;
}

function generateTaskOverlaySubtasks(subtaskTitle, state, id, key) {
  return `<li class="board-overlay-task-subtasklist-subtask">
            <img src="./img/check-button-${state}.svg" class="check-hover" onclick="boardOverlayTaskSubtaskToggle('${state}', '${id}', '${key}')" alt=""/>
            <span>${subtaskTitle}</span>
          </li>`;
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

function generateTaskOverlayEditHTML(taskId) {
  return `<div class="board-overlay-task-edit" onclick="event.stopPropagation()" id="taskOverlayEdit${taskId}">
            <div class="board-overlay-task-edit-right">
                <img class="closeIcon" src="./img/close.svg" alt="" onclick="boardOverlayEditTaskHide()" />
            </div>
            <div class="board-overlay-task-edit-container">
                <div class="board-overlay-task-edit-content-box">
                    <label for="editTaskTitle">Title<span class="red-star">*</span></label>
                    <div class="add-task-required-input">
                        <input
                            type="text"
                            name="editTaskTitle"
                            id="editTaskTitle"
                            placeholder="Enter a Title"
                            class="board-overlay-task-edit-content-box-input"
                        />
                        <div id="boardOverlayEditTitleRequired" class="add-task-small-required d-none">
                            This field is required
                        </div>
                    </div>
                </div>
                <div class="board-overlay-task-edit-content-box">
                    <label for="editTaskDescription">Description</label>
                    <textarea
                        class="add-task-textarea"
                        name="editTaskDescription"
                        id="editTaskDescription"
                        placeholder="Enter a Description"
                    ></textarea>
                </div>
                <div class="board-overlay-task-edit-content-box">
                    <label for="editTaskDueDate">Due date<span class="red-star">*</span></label>
                    <div class="add-task-required-input">
                        <input
                            class="board-overlay-task-edit-content-box-input"
                            type="date"
                            name="editTaskDueDate"
                            id="editTaskDueDate"
                        />
                        <div id="boardOverlayEditDueDateRequired" class="add-task-small-required d-none">
                            This field is required
                        </div>
                    </div>
                </div>
                <div class="board-overlay-task-edit-content-box">
                    <label>Prio</label>
                    <div class="add-task-priority-content-box">
                        <div
                            class="add-task-priority white"
                            onclick="boardOverlayEditPrioritySelect('Urgent')"
                            id="boardOverlayEditPriorityUrgent"
                        >
                            <span>Urgent</span>
                            <img src="./img/prio-urgent.svg" alt="" />
                        </div>
                        <div
                            class="add-task-priority orange"
                            onclick="boardOverlayEditPrioritySelect('Medium')"
                            id="boardOverlayEditPriorityMedium"
                        >
                            <span>Medium</span>
                            <img src="./img/prio-medium.svg" alt="" />
                        </div>
                        <div
                            class="add-task-priority white"
                            onclick="boardOverlayEditPrioritySelect('Low')"
                            id="boardOverlayEditPriorityLow"
                        >
                            <span>Low</span>
                            <img src="./img/prio-low.svg" alt="" />
                        </div>
                    </div>
                </div>
                <div class="board-overlay-task-edit-content-box">
                    <label for="addTaskAssignedTo">Assigned to</label>
                    <div
                        class="add-task-dropdown add-task-dropdown-shadow"
                        onclick="boardOverlayEditToggleContacts()"
                    >
                        <div class="add-task-dropdown-select">
                            <span id="addTaskAssignedTo">Select contacts to assign</span>
                            <img
                                src="./img/arrow-drop-down.svg"
                                alt=""
                                id="boardOverlayEditContactsDropdownArrow"
                            />
                        </div>
                        <div class="d-none" id="boardOverlayEditContactsDropdownOptions"></div>
                    </div>
                </div>
                <div class="board-overlay-task-edit-content-box pointer">
                    <label>Subtasks</label>
                    <div class="add-task-subtask-add" id="boardOverlayEditSubtaskContainer">
                        <input
                            id="boardOverlayEditSubtaskInput"
                            type="text"
                            placeholder="Add new subtask"
                            class="board-overlay-task-edit-content-box-input"
                            onfocus="boardOverlayEditSubtaskHandleFocusInput()"
                        />
                        <div
                            id="boardOverlayEditSubtaskPlusIcon"
                            class="add-task-subtask-icon"
                            onclick="boardOverlayEditSubtaskFocusInput()"
                        >
                            <img class="filter" src="./img/add-plus.svg" alt="" />
                        </div>
                        <div
                            id="boardOverlayEditSubtaskIconSection"
                            class="add-task-subtask-add-icon-section-input d-none"
                        >
                            <div
                                class="add-task-subtask-icon"
                                onclick="boardOverlayEditSubtaskClearInput()"
                            >
                                <img src="./img/close.svg" alt="" class="filter" />
                            </div>
                            <hr class="add-task-subtask-devider" />
                            <div
                                class="add-task-subtask-icon"
                                onclick="boardOverlayEditSubtaskSubmitInput()"
                            >
                                <img src="./img/check.svg" alt="" class="filter" />
                            </div>
                        </div>
                    </div>
                    <div id="boardOverlayEditSubtaskList" class="add-task-subtask-list"></div>
                </div>
            </div>
            <div class="board-overlay-task-edit-right">
                <button class="add-task-bottom-button btn-check" onclick="boardOverlayEditSubmit('${taskId}')">
                    <span>Ok</span>
                    <img src="./img/check.svg" alt="" />
                </button>
            </div>
        </div>`;
}

function generateContactListEdit(contactId, initials, name, contactState) {
  return `<div id="contact'${contactId}'" class="add-task-dropdown-option add-task-contact-box" onclick="event.stopPropagation()">
              <div class="add-task-contact-content">
                  <div class="add-task-contact-icon" style="background: #462f8a">
                      <span>${initials}</span>
                  </div>
                  <span>${name}</span>
              </div>
              <img src="./img/check-button-${contactState}.svg"
                   alt=""
                   onclick="boardOverlayEditSelectContact('${contactId}')"/>
            </div>`;
}

function generateBoardOverlayEditSubtaskList(subtaskId, subtaskTitle) {
  return `<div id="subtask'${subtaskId}'" class="add-task-subtask-task">
                <li>${subtaskTitle}</li>
                <div class="add-task-subtask-add-icon-section">
                    <img onclick="boardOverlayEditSubtaskEdit(${subtaskId})" id="addTaskSubtaskEdit" src="./img/edit.svg" alt="" />
                    <hr class="add-task-subtask-devider" />
                    <img onclick="boardOverlayEditSubtaskDelete(${subtaskId})" id="addTaskSubtaskDelete" src="./img/delete.svg" alt="" />
                </div>
              </div>`;
}

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
