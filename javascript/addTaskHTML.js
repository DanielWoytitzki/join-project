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

function generateAddTaskAssignedContacts(initials, backgroundColor) {
  return `<div class="add-task-assigned-contactlist-contact" style="background: ${backgroundColor}">
            <span>${initials}</span>
          </div>`;
}
