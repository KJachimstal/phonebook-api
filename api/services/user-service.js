const User = require("../schemats/user");

const createUser = async ({ email, password }) => {
  const newUser = new User({ email, password });
  newUser.setPassword(password);
  return await newUser.save();
};

const findUserByEmail = async ({ email }) => {
  return User.findOne({ email });
};

const findUserById = async (id) => {
  return User.findById(id);
};

const setToken = async (id, newToken) => {
  return User.findByIdAndUpdate(id, { token: newToken });
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  setToken,
};
