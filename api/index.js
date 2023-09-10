const express = require("express");
const router = express.Router();
const controller = require("../api/controller");

router.get("/", controller.get);

router.get("/:contactId", controller.getById);

router.post("/", controller.create);

router.put("/:contactId", controller.update);

router.patch("/:contactId/favorite", controller.updateFavorite);

router.delete("/:contactId", controller.remove);

module.exports = router;