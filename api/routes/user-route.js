const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controller");

router.post("/signup", userController.signup);

router.post("/signin", userController.signin);

router.post("/logout", userController.auth, userController.logout);

router.get("/current", userController.auth, userController.current);

router.patch("/avatars", userController.auth, userController.avatars);

module.exports = router;
