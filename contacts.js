const shortid = require('shortid');
const fsp = require('fs/promises');
const path = require('path');

const contactsPath = path.join(__dirname, './db/contacts.json');

const updateContactsList = async contacts =>
  await fsp.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

const listContacts = async () => {
  try {
    const contacts = await fsp.readFile(contactsPath);
    return JSON.parse(contacts);
  } catch (error) {
    console.log(error);
  }
};

const getContactById = async contactId => {
  try {
    const contacts = await listContacts();
    const contact = contacts.find(contact => contact.id === contactId);
    if (!contact) {
      throw new Error('The contact is not found');
    }
    return contact;
  } catch (error) {
    console.log(error);
  }
};

const removeContact = async contactId => {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex(contacts => contacts.id === contactId);
    if (index === -1) {
      throw new Error('The contact is never exicted');
    }
    contacts.splice(index, 1);
    await updateContactsList(contacts);
    return contacts;
  } catch (error) {
    console.log(error);
  }
};

const addContact = async ({ name, email, phone }) => {
  const contacts = await listContacts();
  const newContact = {
    id: shortid.generate(),
    name,
    email,
    phone,
  };

  if (name === '' || email === '' || phone === '') {
    throw new Error('Please fill in all required fiels');
  }

  contacts.push(newContact);
  await updateContactsList(contacts);
  return newContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
