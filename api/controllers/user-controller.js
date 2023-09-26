const service = require("../services/user-service");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const tokenSecret = process.env.tokenSecret;
const passport = require("passport");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs").promises;
const jimp = require("jimp");
const { v4: uuidv4 } = require("uuid");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "postmaster@sandbox436118c18efe4d58969284a79bdac930.mailgun.org",
  key: process.env.MAILGUN_API_KEY,
});

const sendVerificationMail = async (user) => {
  mg.messages
    .create("sandbox436118c18efe4d58969284a79bdac930.mailgun.org", {
      from: "Excited User <sandbox436118c18efe4d58969284a79bdac930@mailgun.org>",
      to: "niemamcinicdopowiedzenia@gmail.com",
      subject: "Verification",
      text: "Please verify your email by follow this link: ",
    })
    .then((msg) => console.log(msg)) // logs response data
    .catch((err) => console.log(err)); // logs
};

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
    const avatarPath = gravatar.url(email, { s: "250", protocol: "http" });
    const verificationToken = uuidv4();
    console.log(verificationToken);
    const newUser = await service.createUser({
      email,
      password,
      avatarPath,
      verificationToken,
    });
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
  if (!user.verificationToken) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Account needs to be verified.",
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
  if (!req.file) {
    return res.status(400).json("Missing file!");
  }

  const filename = req.file.filename;
  const { id } = req.user;
  const avatarPath = path.join(process.cwd(), "public", "avatars", filename);
  const tempPath = req.file.path;
  fs.rename(tempPath, avatarPath, (err) => {
    if (err) throw err;
  });

  jimp.read(avatarPath, (err, filename) => {
    if (err) throw err;
    filename.resize(250, 250).write(avatarPath);
  });

  try {
    await service.setAvatar(id, avatarPath);
    return res.status(200).json({
      data: {
        avatarPath,
      },
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

const verify = async (req, res, next) => {
  const verificationToken = req.params.verificationToken;
  const user = await service.findUserByVerificationToken({ verificationToken });
  if (!user) {
    return res.status(404).json({
      data: {
        message: "User not found",
      },
    });
  } else {
    await service.setVerification(user.id);
    return res.status(200).json({
      data: {
        message: "Verification successful",
      },
    });
  }
};

const verifyResend = async (req, res, next) => {
  const { email } = req.body;
  let user = {};

  if (!email) {
    return res.status(400).json({
      message: "missing required field email",
    });
  } else {
    user = await service.findUserByEmail(email);

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (!user.verify) {
      sendVerificationMail(user);
    } else {
      return res.status(400).json({
        message: "Verification has already been passed",
      });
    }
  }
};

module.exports = {
  signup,
  signin,
  auth,
  logout,
  current,
  avatars,
  verify,
  verifyResend,
};
