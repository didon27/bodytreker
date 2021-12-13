const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const IdsUsersImages = db.ids_users_images;
const UsersImages = db.users_images;
const UsersSubscribers = db.users_subscribers;
const Activities = db.activities;

const upload = require("../middleware/upload");

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

const getUserId = (req, res) => {
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
    console.log("\n", userId, "\n");
  });

  console.log("USSSSEEEEERRRRRIDDDDD", userId);
  return userId;
};

exports.updateUser = async (req, res) => {
  try {
    await upload(req, res);

    const {
      username,
      first_name,
      last_name,
      email,
      description,
      id,
      status,
      gender,
    } = req.body;

    User.update(
      { username, first_name, last_name, description, status, gender },
      {
        where: { id },
        attributes: [
          "id",
          "first_name",
          "last_name",
          "username",
          "email",
          "rating",
          "description",
          "status",
          "gender",
          "age",
        ],
        returning: true,
      }
    )
      .then(async () => {
        if (!User.hasAlias("images")) {
          User.belongsToMany(UsersImages, {
            as: "images",
            foreignKey: "user_id",
            otherKey: "image_id",
            through: IdsUsersImages,
          });
        }

        if (req.files && req.files?.length) {
          const images = req.files.map((item) => {
            return {
              filename: item.filename,
              user_id: id,
            };
          });

          await UsersImages.bulkCreate(images).then(async (image) => {
            let images = image.map((item) => {
              let el = Object.values(item)[0];
              return {
                user_id: id,
                image_id: el.id,
              };
            });

            await IdsUsersImages.bulkCreate(images);
          });
        }
        User.findOne({
          where: { id },
          attributes: [
            "id",
            "first_name",
            "last_name",
            "username",
            "email",
            "rating",
            "description",
            "status",
            "gender",
            "age",
          ],
          include: [
            {
              as: "images",
              model: UsersImages,
              through: { attributes: [] },
              attributes: ["filename"],
            },
          ],
          order: [["images", "createdAt", "DESC"]],
        })
          .then((user) =>
            res
              .status(200)
              .send({ ...user.dataValues, avatar: user.images[0]?.filename })
          )
          .catch((e) => res.status(400).send(e));
      })
      // .then((user) => res.status(200).send(user))
      .catch((err) => {
        return res.status(400).send(err);
      });
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.getMyUser = (req, res) => {
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
    console.log("\n", userId, "\n");
  });

  if (!User.hasAlias("images")) {
    User.belongsToMany(UsersImages, {
      as: "images",
      foreignKey: "user_id",
      otherKey: "image_id",
      through: IdsUsersImages,
    });
  }

  // Fetch the user by id
  User.findOne({
    where: { id: userId },
    attributes: [
      "id",
      "first_name",
      "last_name",
      "username",
      "email",
      "rating",
      "description",
      "status",
      "gender",
      "age",
    ],
    include: [
      {
        as: "images",
        model: UsersImages,
        through: { attributes: [] },
        attributes: ["filename", "createdAt"],
      },
    ],
    order: [["images", "createdAt", "DESC"]],
  }).then(async (user) => {
    let followings =
      (await UsersSubscribers.count({
        where: { first_user_id: userId },
      })) || 0;
    let followers =
      (await UsersSubscribers.count({
        where: { second_user_id: userId },
      })) || 0;
    let activities =
      (await Activities.count({
        where: { user_id: userId },
      })) || 0;

    // Do something with the user
    return res.status(200).send({
      ...user.dataValues,
      avatar: user.images[0]?.filename,
      followers,
      followings,
      activities,
    });
  });
};

exports.getFollowersAndFollowings = (req, res) => {
  const { user_id, type } = req.body;
  const userData = {};

  if (type === "followings") {
    userData.first_user_id = user_id;
    if (!UsersSubscribers.hasAlias("user")) {
      UsersSubscribers.belongsTo(User, {
        foreignKey: "second_user_id",
        otherKey: "id",
      });
    }
  } else {
    userData.second_user_id = user_id;
    if (!UsersSubscribers.hasAlias("user")) {
      UsersSubscribers.belongsTo(User, {
        foreignKey: "first_user_id",
        otherKey: "id",
      });
    }
  }

  UsersSubscribers.findAndCountAll({
    where: userData,
    include: [
      {
        model: User,
        distinct: true,
        // through: { attributes: [] },
        attributes: ["id", "first_name", "last_name", "username", "rating"],
      },
    ],
  })
    .then((user) => {
      return res.status(200).send(user);
    })
    .catch((error) => {
      return res.status(400).send(error);
    });
};

exports.subscribeUser = (req, res) => {
  const { first_user_id, second_user_id } = req.body;

  UsersSubscribers.create({ first_user_id, second_user_id })
    .then((activity) => {
      res.status(200).send({ message: "User subscribe!" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.unsubscribeUser = (req, res) => {
  const { first_user_id, second_user_id } = req.body;

  UsersSubscribers.destroy({ where: { first_user_id, second_user_id } })
    .then((activity) => {
      res.status(200).send({ message: "Activities unsubscribe!" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getUser = (req, res) => {
  const { user_id } = req.body;
  const myId = getUserId(req, res);

  if (!User.hasAlias("images")) {
    User.belongsToMany(UsersImages, {
      as: "images",
      foreignKey: "user_id",
      otherKey: "image_id",
      through: IdsUsersImages,
    });
  }

  // Fetch the user by id
  User.findOne({
    where: { id: user_id },
    attributes: [
      "id",
      "first_name",
      "last_name",
      "username",
      "email",
      "rating",
      "description",
      "status",
      "gender",
      "age",
    ],
    include: [
      {
        as: "images",
        model: UsersImages,
        through: { attributes: [] },
        attributes: ["filename", "createdAt"],
      },
    ],
    order: [["images", "createdAt", "DESC"]],
  }).then(async (user) => {
    let subscribe = false;
    // Do something with the user
    await UsersSubscribers.findOne({
      where: { first_user_id: myId, second_user_id: user_id },
    }).then((resp) => (subscribe = !!resp));

    let followings =
      (await UsersSubscribers.count({
        where: { first_user_id: user_id },
      })) || 0;
    let followers =
      (await UsersSubscribers.count({
        where: { second_user_id: user_id },
      })) || 0;

    let activities =
      (await Activities.count({
        where: { user_id },
      })) || 0;

    return res.status(200).send({
      ...user.dataValues,
      avatar: user.images[0]?.filename,
      subscribe,
      followings,
      followers,
      activities,
    });
  });
};
