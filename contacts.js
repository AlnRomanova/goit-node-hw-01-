const shortid = require('shortid');
const fsp = require('fs/promises');
const path = require('path');

const contactsPath = path.join(__dirname, './db/contacts.json');

const updateContactsList = async contacts =>
  await fsp.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  
const getAllContacts = async () => {
  const contacts = await fsp.readFile(contactsPath);
  return JSON.parse(contacts);
};

const getContactById = async contactId => {
  const contacts = await getAllContacts();
  const contact = contacts.find(contact => contact.id === contactId);
  if (!contact) {
    throw new Error('the contact is not found');
  }
  return contact;
};

const removeContact = async contactId => {
  const contacts = await getAllContacts();
  const index = contacts.findIndex(contacts => contacts.id === contactId);
  contacts.splice(index, 1);
  await updateContactsList(contacts);
  return contacts[index];
};

const addContact = async ({ name, email, phone }) => {
  const contacts = await getAllContacts();
  const newContact = {
    id: shortid.generate(),
    name,
    email,
    phone,
  };

  contacts.push(newContact);
  await updateContactsList(contacts);
  return newContact;
};

module.exports = {
  getAllContacts,
  getContactById,
  removeContact,
  addContact,
};
