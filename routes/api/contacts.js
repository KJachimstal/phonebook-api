const express = require("express");
const {
  getContacts,
  getContactById,
  removeContact,
} = require("../../models/contacts");

const router = express.Router();

router.get("/", async (req, res, next) => {
  res.json({ data: JSON.parse(getContacts()) });
});

router.get("/:contactId", async (req, res, next) => {
  const contact = getContactById(req.params.contactId);
  res.json(contact ? { data: contact } : { message: "Not found" });
});

router.post("/", async (req, res, next) => {
  res.json("//");
});

router.delete("/:contactId", async (req, res, next) => {
  const isDeleted = removeContact(req.params.contactId);
  res.json({ message: isDeleted ? "contact deleted" : "Not found" });
});

router.put("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

module.exports = router;
