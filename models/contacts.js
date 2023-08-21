const fs = require("fs");
const path = require("path");

// * Declare file path
const contactsPath = path.normalize("models/contacts.json");

const getContacts = () => fs.readFileSync(contactsPath, "utf8");

const getContactById = (contactId) => {
  const data = JSON.parse(getContacts());
  const findedContact = data.find((obj) => obj.id === contactId);
  if (findedContact) {
    return findedContact;
  } else {
    console.log("Contact not found!");
  }
};

const removeContact = async (contactId) => {
  return new Promise(function (resolve, reject) {
    fs.readFile(contactsPath, "utf8", (err, data) => {
      if (err) reject(err);
      return resolve(JSON.parse(data));
    });
  }).then((data) => {
    const findedContactIndex = data.findIndex((obj) => obj.id === contactId);
    if (findedContactIndex !== -1) {
      data.splice(findedContactIndex, 1);
      fs.writeFile(contactsPath, JSON.stringify(data), (err) => {
        if (err) console.log(err);
      });
      console.log("Contact has been deleted!");
      console.table(data);
    } else {
      console.log("Contact not found! Unable to delete!");
    }
  });
};

const addContact = async ({ name, email, phone }) => {
  return new Promise(function (resolve, reject) {
    fs.readFile(contactsPath, "utf8", (err, data) => {
      if (err) reject(err);
      return resolve(JSON.parse(data));
    });
  }).then((data) => {
    data.push({
      id: `${data.length + 1}`,
      name,
      email,
      phone,
    });

    fs.writeFile(contactsPath, JSON.stringify(data), (err) => {
      if (err) console.log(err);
    });
    console.log("Contact has been added!");
    console.table(data);
  });
};

const updateContact = async (contactId, body) => {};

module.exports = {
  getContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
