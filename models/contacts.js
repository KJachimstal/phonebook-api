const fs = require("fs/promises");
const path = require("path");

// * Declare file path
const contactsPath = path.normalize("models/contacts.json");

// function getContacts() {
//   fs.readFile(contactsPath, "utf8", (err, data) => {
//     if (err) {
//       console.error(err);
//       return;
//     }
//     console.log(data);
//   });
// }

const getContacts = async () => {
  return await new Promise(function (resolve, reject) {
    fs.readFile(contactsPath, "utf8", (err, data) => {
      if (err) reject(err);
      return resolve(JSON.parse(data));
    });
  }).then((data) => {
    console.log(data);
  });
};

const getContactById = async (contactId) => {
  return new Promise(function (resolve, reject) {
    fs.readFile(contactsPath, "utf8", (err, data) => {
      if (err) reject(err);
      return resolve(JSON.parse(data));
    });
  }).then((data) => {
    const findedContact = data.find((obj) => obj.id === contactId);

    if (findedContact) {
      console.log(findedContact);
    } else {
      console.log("Contact not found!");
    }
  });
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
