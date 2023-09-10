const User = require("../schemats/user");

const createUser = async ({ email, password }) => {
  const newUser = new User({ email, password });
  newUser.setPassword(password);
  return await newUser.save();
};

const findUser = async ({ email }) => {
  return User.findOne({ email });
};

module.exports = {
  createUser,
  findUser,
};
