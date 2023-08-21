const express = require("express");
const { getContacts, getContactById } = require("../../models/contacts");

const router = express.Router();

router.get("/", async (req, res, next) => {
  res.json({ data: JSON.parse(getContacts()) });
});

router.get("/:contactId", async (req, res, next) => {
  res.json({ data: getContactById(req.params.contactId) });
});

router.post("/", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.delete("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.put("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

module.exports = router;
