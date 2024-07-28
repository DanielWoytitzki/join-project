function generateAddTaskContactList(contactId, initials, name, contactState) {
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

function generateAddTaskSubtaskList(subtaskId, subtaskTitle) {
  return `<div id="subtask'${subtaskId}'" class="add-task-subtask-task">
              <li>${subtaskTitle}</li>
              <div class="add-task-subtask-add-icon-section">
                  <img onclick="subtaskEditTask(${subtaskId})" id="addTaskSubtaskEdit" src="./img/edit.svg" alt="" />
                  <hr class="add-task-subtask-devider" />
                  <img onclick="subtaskDeleteTask(${subtaskId})" id="addTaskSubtaskDelete" src="./img/delete.svg" alt="" />
              </div>
            </div>`;
}

function generateAddTaskSubtaskEdit(subtaskId) {
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
