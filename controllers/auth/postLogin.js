const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const postLogin = async (req, res) => {
  try {
    console.log("login event came");
    const { mail, password } = req.body;

    const user = await User.findOne({ mail: mail.toLowerCase() });

    if (user && (await bcrypt.compare(password, user.password))) {
      // send new token
      const token = jwt.sign(
        {
          userId: user._id,
          mail,
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: process.env.TOKEN_EXPIRATION_DURATION,
        }
      );

      return res.status(200).json({
        userDetails: {
          mail: user.mail,
          username: user.username,
          _id: user._id,
          token: token,
        },
      });
    }

    return res.status(400).send("Invalid credentials. Please try again");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong. Please try again");
  }
};

module.exports = postLogin;
