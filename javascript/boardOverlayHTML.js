/**
 * Generates the HTML for the edit overlay of the selected task
 *
 * @param {string} taskId - the id of the selected task in the database
 * @returns
 */
function generateTaskOverlayEditHTML(taskId) {
  return `<div class="board-overlay-task-edit" id="taskOverlayEdit${taskId}">
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
                          <div class="add-task-dropdown-select" id="boardOverlayEditContactsDropdownButtonToToggle">
                              <span id="addTaskAssignedTo">Select contacts to assign</span>
                              <img
                                  src="./img/arrow-drop-down.svg"
                                  alt=""
                                  id="boardOverlayEditContactsDropdownArrow"
                              />
                          </div>
                          <div class="d-none" id="boardOverlayEditContactsDropdownOptions"></div>
                      </div>
                      <div
                          class="add-task-assigned-contactlist"
                          id="boardOverlayEditAssignedContactListe"
                      ></div>
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

/**
 * Generate the HTML for the contact circles of the assigned contacts in the task edit overlay
 *
 * @param {string} initials - the initials if the contact
 * @param {string} backgroundColor - the background color of the contact
 * @returns
 */
function generateBoardOverlayEditAssignedContactList(
  initials,
  backgroundColor
) {
  return `<div class="add-task-assigned-contactlist-contact" style="background-color: ${backgroundColor};">
                <span>${initials}</span>
              </div>`;
}

/**
 * Generate the HTML for the subtasks of the selected task
 *
 * @param {number} subtaskId - the id of the subtask in the subtask array of the selected task
 * @param {string} subtaskTitle - the title of the subtask
 * @returns
 */
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
