const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.getUser = (req, res) => {
  let userId;
  let token = req.headers.authorization.replace("Bearer ", "");

  jwt.verify(token, config.secret, (err, decoded) => {
    console.log(decoded, config.secret);
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    userId = decoded.id;
  });

  // Fetch the user by id
  User.findOne({ id: userId }).then(function (user) {
    // Do something with the user
    return res
      .status(200)
      .send({
        id: user.id,
        username: user.username,
        email: user.email,
        body_type: user.body_type,
      });
  });
};
