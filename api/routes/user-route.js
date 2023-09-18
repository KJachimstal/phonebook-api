const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controller");
const uploadImage = require("../config/multer");

router.post("/signup", userController.signup);

router.post("/signin", userController.signin);

router.post("/logout", userController.auth, userController.logout);

router.get("/current", userController.auth, userController.current);

router.patch(
  "/avatars",
  userController.auth,
  uploadImage.single("avatar"),
  userController.avatars
);

module.exports = router;
