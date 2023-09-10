const service = require("../services/user-service");
const Joi = require("joi");

const signupValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).alphanum().required(),
});

const signup = async (req, res, next) => {
  const { email, password } = req.body;
  const validation = signupValidation.validate(req.body);

  if (validation.error) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: validation.error.message,
    });
  }

  try {
    const conflict = await service.findUser({ email });
    if (conflict) {
      return res.status(409).json({
        status: "error",
        code: 409,
        message: "Email in use",
      });
    }
  } catch (e) {
    next(e);
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

module.exports = {
  signup,
};
