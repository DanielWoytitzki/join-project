/**
 * Generates the HTML of the contact list of all contacts from the database which is displayed when open the assigned contact dropdown
 *
 * @param {string} contactId - the id of the contact in the database
 * @param {string} initials - the initials of the contact name
 * @param {string} name - the contact name
 * @param {string} contactState - the state of the contact if it is checked or unchecked
 * @param {string} backgroundColor - the background color of the contact
 * @returns
 */
function generateAddTaskContactList(
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
                   onclick="addTaskContactSelect('${contactId}')"/>
            </div>`;
}

/**
 * Generates the HTML of the subtasks which are added
 *
 * @param {string} subtaskId - the incremental number of the subtasks as a id
 * @param {string} subtaskTitle - the title of the added subtask
 * @returns
 */
function generateAddTaskSubtaskList(subtaskId, subtaskTitle) {
  return `<div id="subtask'${subtaskId}'" class="add-task-subtask-task">
              <li>${subtaskTitle}</li>
              <div class="add-task-subtask-add-icon-section">
                  <img onclick="addTaskSubtaskEditTask(${subtaskId})" id="addTaskSubtaskEdit" src="./img/edit.svg" alt="" />
                  <hr class="add-task-subtask-devider" />
                  <img onclick="addTaskSubtaskDeleteTask(${subtaskId})" id="addTaskSubtaskDelete" src="./img/delete.svg" alt="" />
              </div>
            </div>`;
}

/**
 * Generates the HTML for the assigned contacts which were checked in the dropdown
 *
 * @param {string} initials - the initials of the checked contact name
 * @param {string} backgroundColor - the background color of the contact
 * @returns
 */
function generateAddTaskAssignedContacts(initials, backgroundColor) {
  return `<div class="add-task-assigned-contactlist-contact" style="background: ${backgroundColor}">
            <span>${initials}</span>
          </div>`;
}
