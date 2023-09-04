const fs = require("fs");
const fsPromise = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");
const mongoose = require("mongoose");
require("dotenv").config();

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.uriDb);
  } catch (err) {
    console.log("Connection error: ", err);
  }
};

// * Declare file path
const contactsPath = path.normalize("models/contacts.json");

const getContacts = async () => {
  try {
    const data = await fsPromise.readFile(contactsPath, { encoding: "utf8" });
    return data;
  } catch (err) {
    return err;
  }
};

const getContactById = async (contactId) => {
  const contacts = await getContacts();
  const readedData = JSON.parse(contacts);
  const findedContact = readedData.find((obj) => obj.id === contactId);
  if (findedContact) {
    return findedContact;
  } else {
    return null;
  }
};

const removeContact = async (contactId) => {
  const contacts = await getContacts();
  const readedData = JSON.parse(contacts);
  const findedContactIndex = readedData.findIndex(
    (obj) => obj.id === contactId
  );
  if (findedContactIndex !== -1) {
    readedData.splice(findedContactIndex, 1);
    fs.writeFile(contactsPath, JSON.stringify(readedData), (err) => {
      if (err) return err;
    });
    return true;
  } else {
    return false;
  }
};

const addContact = async ({ name, email, phone }) => {
  const contacts = await getContacts();
  const readedData = JSON.parse(contacts);
  const newContact = {
    id: uuidv4(),
    name,
    email,
    phone,
  };

  readedData.push(newContact);
  fs.writeFile(contactsPath, JSON.stringify(readedData), (err) => {
    if (err) return err;
  });

  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await getContacts();
  const readedData = JSON.parse(contacts);

  const findedContactIndex = readedData.findIndex(
    (contact) => contact.id === contactId
  );

  if (findedContactIndex !== -1) {
    const updatedContact = {
      id: readedData[findedContactIndex].id,
      ...body,
    };
    readedData[findedContactIndex] = updatedContact;
    fs.writeFile(contactsPath, JSON.stringify(readedData), (err) => {
      if (err) return err;
    });
    return updatedContact;
  } else {
    return false;
  }
};

const validationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const checkRequiredParams = (req, res) => {
  const validation = validationSchema.validate(req.body);

  if (validation.error) {
    return res.status(400).send({
      message: validation.error.details[0].message,
    });
  } else {
    return null;
  }
};

module.exports = {
  getContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  checkRequiredParams,
};
