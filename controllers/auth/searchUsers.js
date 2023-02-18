const User = require("../../models/User");

const searchUsers = async (req, res) => {
  const { mail } = req.body;

  const users = await User.find({ mail: { $regex: mail, $options: "i" } });

  res.status(200).json({ users });
};

module.exports = searchUsers;
