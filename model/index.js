const { json } = require('express/lib/response');
const { writeFile } = require('fs');
const fs = require('fs/promises');
const path = require('path');

const contactsPath = path.join(__dirname, './contacts.json');

const listContacts = async () => {
  const data = await fs.readFile(contactsPath)
  const contacts = JSON.parse(data)
  return contacts
}

const getContactById = async (contactId) => {
  const contacts = await listContacts();

  const orderContacts = contacts.find(({ id }) => id === Number(contactId));

  if (!orderContacts) {

    return null
  }
  return orderContacts
}

const removeContact = async (contactId) => {
  const contacts = await listContacts();

  const contactsIndex = contacts.findIndex(({ id }) => id === Number(contactId));

  if (contactsIndex === -1) {

    return null
  }

  const deleteContact = await contacts.splice(contactsIndex, 1);

  await fs.writeFile(contactsPath, JSON.stringify(contacts));

  return deleteContact

}

const addContact = async (body) => {
  const contacts = await listContacts()

  function getId(array) {
    return Math.max(...array.map(contact => contact.id + 1))
  }

  const add = { id: getId(contacts), ...body };
  contacts.push(add)

  await fs.writeFile(contactsPath, JSON.stringify(contacts));

  return add;
}

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const conactsIndex = contacts.findIndex(({ id }) => id === Number(contactId));

  if (!conactsIndex === -1) {

    return null
  }

  contacts[conactsIndex] = { ...contacts[conactsIndex], ...body };

  await fs.writeFile(contactsPath, json.stringify(contacts));

  return contacts[conactsIndex]


}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
