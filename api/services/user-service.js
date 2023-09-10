const User = require("../schemats/user");

const createUser = async ({ email, password }) => {
  return User.create({ email, password });
};

const findUser = async ({ email }) => {
  return User.findOne({ email });
};

module.exports = {
  createUser,
  findUser,
};
