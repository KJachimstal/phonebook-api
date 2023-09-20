const User = require("../schemats/user");

const createUser = async ({ email, password, avatarPath }) => {
  const newUser = new User({ email, password, avatarPath });
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

const setAvatar = async (id, filePath) => {
  return User.findByIdAndUpdate(
    id,
    { avatarPath: filePath },
    { new: true, select: "avatarPath" }
  );
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  setToken,
  setAvatar,
};
