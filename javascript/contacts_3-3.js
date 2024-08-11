/**
 * This function updates a single contact in the contact list without clearing the detailed view
 *
 * @param {string} contactId - The contactId is automatically generated by your database
 * @param {object} updatedData - The updated information/data of an existing contact (name, email and phone)
 */
async function updateContactInList(contactId, updatedData) {
    let contactBox = document.querySelector(
      `.single-contact-box[onclick="showDetailedContact('${contactId}')"]`
    );
  
    if (contactBox) {
      const newContactHTML = HTMLForContactCard({
        id: contactId,
        ...updatedData,
      });
      contactBox.outerHTML = newContactHTML;
    }
  }