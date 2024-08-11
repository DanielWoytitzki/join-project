/**
 * pushes the assigned contacts from the edit overlay in a new array
 */
function boardOverlayEditAssignedContactList() {
  boardOverlayEditAssignedContacts = [];
  for (let i = 0; i < boardOverlayEditContacts.length; i++) {
    if (boardOverlayEditContacts[i]["state"] == "checked") {
      boardOverlayEditAssignedContacts.push(boardOverlayEditContacts[i]["id"]);
    }
  }
}

/**
 * by clicking on the different priority buttons, they change their color
 * current selected priority is saved in variable
 *
 * @param {string} priority - the priority of the selected task
 */
function boardOverlayEditPrioritySelect(priority) {
  let urgent = document.getElementById("boardOverlayEditPriorityUrgent");
  let medium = document.getElementById("boardOverlayEditPriorityMedium");
  let low = document.getElementById("boardOverlayEditPriorityLow");
  if (priority == "urgent") {
    urgent.classList.add("red");
    urgent.classList.remove("white");
    medium.classList.remove("orange");
    medium.classList.add("white");
    low.classList.remove("green");
    boardOverlayEditPriority = "urgent";
  } else if (priority == "medium") {
    medium.classList.add("orange");
    medium.classList.remove("white");
    urgent.classList.remove("red");
    urgent.classList.add("white");
    low.classList.remove("green");
    low.classList.add("white");
    boardOverlayEditPriority = "medium";
  } else if (priority == "low") {
    low.classList.add("green");
    low.classList.remove("white");
    medium.classList.remove("orange");
    medium.classList.add("white");
    urgent.classList.remove("red");
    urgent.classList.add("white");
    boardOverlayEditPriority = "low";
  }
}

/**
 * displays the initials of the assigned contacts as circles under the contact dropdown
 */
function boardOverlayEditAssignedContactsListUnderDropdown() {
  let assignedContactList = document.getElementById(
    "boardOverlayEditAssignedContactListe"
  );
  assignedContactList.innerHTML = "";

  for (let i = 0; i < boardOverlayEditContacts.length; i++) {
    if (boardOverlayEditContacts[i]["state"] == "checked") {
      let name = boardOverlayEditContacts[i]["contact"];
      let initials = getInitials(name);
      let contactBackgroundColor = boardOverlayEditContacts[i]["color"];
      assignedContactList.innerHTML +=
        generateBoardOverlayEditAssignedContactList(
          initials,
          contactBackgroundColor
        );
    }
  }
}
