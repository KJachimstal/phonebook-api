const service = require("../services/user-service");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const tokenSecret = process.env.tokenSecret;
const passport = require("passport");
const path = require("path");
const fs = require("fs").promises;
const storeImage = require("../config/multer");

const formValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).alphanum().required(),
});

const signup = async (req, res, next) => {
  const { email, password } = req.body;
  const validation = formValidation.validate(req.body);

  if (validation.error) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: validation.error.message,
    });
  }

  const conflict = await service.findUserByEmail({ email });
  if (conflict) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email in use",
    });
  }

  try {
    const newUser = await service.createUser({ email, password });
    return res.status(201).json({
      status: "created",
      code: 201,
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (e) {
    next(e);
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;
  const validation = formValidation.validate(req.body);

  if (validation.error) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: validation.error.message,
    });
  }

  const user = await service.findUserByEmail({ email });
  if (!user || !user.validPassword(password)) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Incorrect login or password",
    });
  }

  const payload = {
    id: user.id,
    username: user.username,
  };
  const token = jwt.sign(payload, tokenSecret, { expiresIn: "1h" });

  service.setToken(user.id, token);

  return res.json({
    status: "success",
    code: 200,
    data: {
      token,
    },
  });
};

const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (!user || err) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Unauthorized",
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};

const logout = async (req, res, next) => {
  const loggedUserId = req.user.id;
  await service.setToken(loggedUserId, null);
  req.user.token = null;
  await req.user.save();
  return res.status(204).end();
};

const current = (req, res) => {
  return res.status(200).json({
    user: {
      email: req.user.email,
      subscription: req.user.subscription,
    },
  });
};

const avatars = async (req, res, next) => {
  console.log(req.file);

  if (!req.file) {
    return res.status(400).json("Missing file!");
  }

  const { path } = req.file;
  const { id } = req.user;
  try {
    const newAvatarPath = await service.setAvatar(id, path);
    return res.status(200).json({
      status: "success",
      code: 200,
      avatarPath: newAvatarPath,
    });
  } catch (err) {
    res.status(500).json(`An error occurred while updating the avatar: ${err}`);
  }
  // const { path: temporaryName, originalname } = req.file;
  // const fileName = path.join(storeImage, originalname);
  // try {
  //   await fs.rename(temporaryName, fileName);
  // } catch (err) {
  //   await fs.unlink(temporaryName);
  //   return next(err);
  // }
  // res.json({ description, message: "Załadowano plik", status: 200 });
};

module.exports = {
  signup,
  signin,
  auth,
  logout,
  current,
  avatars,
};
