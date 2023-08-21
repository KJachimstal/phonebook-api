const express = require("express");
const { getContacts } = require("../../models/contacts");

const router = express.Router();

router.get("/", async (req, res, next) => {
  console.log(getContacts());
  res.json({ data: getContacts() });
});

router.get("/:contactId", async (req, res, next) => {
  res.json({ message: "template mess121212age" });
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
