const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contact-controller");
const userController = require("../controllers/user-controller");

router.get("/", userController.auth, contactController.get);

router.get("/:contactId", contactController.getById);

router.post("/", contactController.create);

router.put("/:contactId", contactController.update);

router.patch("/:contactId/favorite", contactController.updateFavorite);

router.delete("/:contactId", contactController.remove);

module.exports = router;
