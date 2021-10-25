const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "pro3dwork@gmail.com",
    pass: "osulet27",
  },
});

var mail = {
  from: "BodyTracker <from@gmail.com>",
  to: "pro3dwork@gmail.com",
  subject: "Send Email Using Node.js",
  text: "Node.js New world for me",
  html: "<b>Node.js New world for me</b>",
};

exports.signUp = (req, res) => {
  // Save User to Database
  let { email } = req.body;
  let activation_token = (Math.floor(Math.random() * 10000) + 10000)
    .toString()
    .substring(1);

  User.create({
    email,
    activation_token,
  })
    .then(() => {
      mail.to = email;
      mail.html = `<b>Node.js New world for me ${activation_token}</b>`;

      smtpTransport.sendMail(mail, function (error, response) {
        if (error) {
          console.log(error);
        } else {
          console.log("Message sent: " + response.message);
        }

        smtpTransport.close();
      });
      res.status(200).send({ message: "Send code your email!" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signUpContinue = (req, res) => {
  let { username, password, email } = req.body;

  User.findOne({ where: { email } })
    .then((user) => {
      user.password = bcrypt.hashSync(password, 8);
      user.username = username;
      user.registration_completed = true;
      user.save();

      var passwordIsValid = bcrypt.compareSync(password, user.password);

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      res.status(200).send({
        accessToken: token,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.verificationEmail = (req, res) => {
  let { email, activation_token } = req.body;

  User.findOne({ where: { email, activation_token } })
    .then((user) => {
      user.email_verified = true;
      user.activation_token = null;
      user.save();
      res.status(200).send({ message: "Verify code successfully!" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signIn = (req, res) => {
  let { email, username, password } = req.body;
  let data;

  if (email && email.length) {
    data = { email };
  } else if (username && username.length) {
    data = { username };
  }

  User.findOne({
    where: data,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(password, user.password);

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      res.status(200).send({
        accessToken: token,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.forgotPassword = (req, res) => {
  let { email } = req.body;

  let activation_token = (Math.floor(Math.random() * 10000) + 10000)
  .toString()
  .substring(1);

  User.findOne({ email })
    .then((user) => {
      user.activation_token = activation_token;
      user.save();

      mail.to = email;
      mail.html = `<b>Recovery password code ${activation_token}</b>`;

      smtpTransport.sendMail(mail, function (error, response) {
        if (error) {
          console.log(error);
        } else {
          console.log("Message sent: " + response.message);
        }

        smtpTransport.close();
      });
      res.status(200).send({ message: "Send code your email!" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.verificationForgotPassword = (req, res) => {
  let { email, activation_token } = req.body;

  User.findOne({ where: { email, activation_token } })
    .then((user) => {
      res.status(200).send({ success: true});
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
