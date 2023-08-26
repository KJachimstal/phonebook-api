const express = require("express");
const {
  getContacts,
  getContactById,
  removeContact,
  addContact,
  checkRequiredParams,
  updateContact,
} = require("../../models/contacts");
const bodyParser = require("body-parser");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const contacts = await getContacts();
  res.json({ data: JSON.parse(contacts) });
});

router.get("/:contactId", async (req, res, next) => {
  const contact = await getContactById(req.params.contactId);
  res.json(contact ? { data: contact } : { message: "Not found" });
});

router.post("/", bodyParser.json(), async (req, res, next) => {
  const validation = checkRequiredParams(req, res);

  if (validation) return validation;

  const addedContact = await addContact({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  });

  res.json({ data: addedContact });
});

router.delete("/:contactId", async (req, res, next) => {
  const isDeleted = await removeContact(req.params.contactId);
  res.json({ message: isDeleted ? "contact deleted" : "Not found" });
});

router.put("/:contactId", async (req, res, next) => {
  const validation = checkRequiredParams(req, res);

  if (validation) return validation;

  const changedContact = await updateContact(req.params.contactId, {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  });

  res.json({ data: changedContact });
});

module.exports = router;
