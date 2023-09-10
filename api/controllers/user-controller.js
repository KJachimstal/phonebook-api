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

  const conflict = await service.findUser({ email });
  console.log(conflict);
  // try {
  //   const result = await service.createUser({ email, password });

  //   res.status(201).json({
  //     status: "success",
  //     code: 201,
  //     data: { contact: result },
  //   });
  // } catch (e) {
  //   console.error(e);
  //   next(e);
  // }
};

module.exports = {
  signup,
};
