const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contact-controller");
const userController = require("../controllers/user-controller");

router.get("/", userController.auth, contactController.get);

router.get("/:contactId", userController.auth, contactController.getById);

router.post("/", userController.auth, contactController.create);

router.put("/:contactId", userController.auth, contactController.update);

router.patch(
  "/:contactId/favorite",
  userController.auth,
  contactController.updateFavorite
);

router.delete("/:contactId", userController.auth, contactController.remove);

module.exports = router;
