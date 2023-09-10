const express = require("express");
const router = express.Router();
const controller = require("./controller/contact-controller");

router.get("/", controller.get);

router.get("/:contactId", controller.getById);

router.post("/", controller.create);

router.put("/:contactId", controller.update);

router.patch("/:contactId/favorite", controller.updateFavorite);

router.delete("/:contactId", controller.remove);

// router.post("/users/signup", controller.signup);

module.exports = router;
