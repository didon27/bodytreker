const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateEmail = (req, res, next) => {
  // Username
  // User.findOne({
  //   where: {
  //     username: req.body.username
  //   }
  // }).then(user => {
  //   if (user) {
  //     res.status(400).send({
  //       message: "Failed! Username is already in use!"
  //     });
  //     return;
  //   }

  // Email
  User.findOne({
    where: {
      email: req.body.email,
    },
  }).then((user) => {
    if (user) {
      res.status(400).send({
        message: "Failed! Email is already in use!",
      });
      return;
    }

    next();
  });
  // });
};

checkDuplicateUsername = (req, res, next) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (user) {
      res.status(400).send({
        message: "Failed! Username is already in use!",
      });
      return;
    }

    next();
  });
};

checkValidVerifyEmailCode = (req, res, next) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  }).then((user) => {
    if (req.body.activation_token !== user.activation_token) {
      res.status(400).send({
        message: "Wrong code!",
      });
      return;
    }

    next();
  });
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: "Failed! Role does not exist = " + req.body.roles[i],
        });
        return;
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateEmail: checkDuplicateEmail,
  checkRolesExisted: checkRolesExisted,
  checkValidVerifyEmailCode: checkValidVerifyEmailCode,
  checkDuplicateUsername: checkDuplicateUsername,
};

module.exports = verifySignUp;
