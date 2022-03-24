const db = require("../models");
const Activities = db.activities;
const Sequelize = require("sequelize");
const User = db.user;
const ActivitiesCategories = db.activities_categories;
const IdsActivitiesCategories = db.ids_activities_categories;
const ActivitiesImages = db.activities_images;
const strings = require("../strings");
const IdsActivitiesImages = db.ids_activities_images;
const ActivitiesSubscribers = db.activities_subscribers;
const IdsUsersImages = db.ids_users_images;
const UsersImages = db.users_images;
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const UsersSubscribers = db.users_subscribers;

const upload = require("../middleware/upload");
const e = require("express");

exports.createNewActivities = async (req, res) => {
  try {
    await upload(req, res);
    let { title, description, user_id, categories_ids, partner, lat, lng } = req.body;

    if (title.length < 6) {
      res.status(400).send({ error: "Title short" });
    } else if (description.length < 6) {
      res.status(400).send({ error: "Description short" });
    }

    var location = { type: 'Point', coordinates: [lat, lng] };

    Activities.create({ title, description, user_id, partner, lat, lng, location })
      .then((activity) => {
        if (req.files && req.files?.length) {
          const images = req.files.map((item) => {
            return {
              filename: item.filename,
              activity_id: activity.id,
            };
          });

          ActivitiesImages.bulkCreate(images).then((image) => {
            let images = image.map((item) => {
              let el = Object.values(item)[0];
              return {
                activityId: activity.id,
                activitiesImageId: el.id,
              };
            });

            IdsActivitiesImages.bulkCreate(images);
          });
        }
        if (categories_ids && categories_ids.length) {
          let categories = categories_ids?.map((category) => {
            return {
              activityId: activity.id,
              activitiesCategoryId: category,
            };
          });

          IdsActivitiesCategories.bulkCreate(categories);
        }
        res.status(200).send({ message: "Activities created!" });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  } catch (e) {
    res.status(500).send({ error: e });
  }
};

exports.subscribeActivity = (req, res) => {
  const user_id = getUserId(req, res);
  const { activity_id } = req.body;

  ActivitiesSubscribers.create({ user_id, activity_id })
    .then((activity) => {
      res.status(200).send({ message: "Activities subscribe!" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.unsubscribeActivity = (req, res) => {
  const user_id = getUserId(req, res);
  const { activity_id } = req.body;

  ActivitiesSubscribers.destroy({ where: { user_id, activity_id } })
    .then((activity) => {
      res.status(200).send({ message: "Activities unsubscribe!" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getCategories = (req, res) => {
  let lang = req.headers["accept-language"] || "en";
  const { title } = req.body;
  let data = {};

  if (title) {
    data[lang] = { [Sequelize.Op.like]: `%${title}%` };
  }

  ActivitiesCategories.findAll({
    where: data,
    attributes: ["id", [lang, "title"], "color"],
  })
    .then((categories) => {
      res.status(200).send(categories);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: activities } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, activities, totalPages, currentPage };
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

exports.activityUpdate = async (req, res) => {
  try {
    await upload(req, res);
    const {
      id, title, description, user_id, categories_ids, partner, lat, lng
    } = req.body;

    Activities.update({ title, description, user_id, categories_ids, partner, lat, lng },
      {
        where: { id }
      })
      .then((resp) => {
        res.status(200).send({ resp });
      })
  } catch (error) {
    res.status(500).send({ error });
  }
}

exports.deleteImageActivity = (req, res) => {
  let { id } = req.body;

  ActivitiesImages.destroy({ where: { id } })
    .then((resp) => {
      res.status(200).send({ resp });
    }).catch(error => res.status(500).send({ error }))
}

exports.deleteActivity = (req, res) => {
  let { id } = req.body;

  Activities.destroy({ where: { id } })
    .then((resp) => {
      res.status(200).send({ resp });
    }).catch(error => res.status(500).send({ error }))
}

exports.searchActivities = (req, res) => {
  let { title } = req.body;

  Activities.findAll({
    where: { title: { [Sequelize.Op.like]: `%${title}%` } },
    attributes: ["title"],
  }).then((response) => res.status(200).send(response))
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

exports.getActivities = (req, res) => {
  let { user_id, title, partner, friends, subscriptions, page, size, categoryId, userActivities, lng, lat, distance } =
    req.body;
  let lang = req.headers["accept-language"] || "en";
  const myUserId = getUserId(req, res);
  const { limit, offset } = getPagination(page, size);

  let dataActivities = {};

  if (userActivities) {
    dataActivities.user_id = user_id;
  } else {
    dataActivities.user_id = { [Sequelize.Op.not]: user_id };
  }

  if (partner) {
    dataActivities.partner = partner;
  }

  if (title) {
    dataActivities.title = { [Sequelize.Op.like]: `%${title}%` };
  }

  if (!Activities.hasAlias("subscribers")) {
    Activities.belongsToMany(User, {
      as: "subscribers",
      foreignKey: "activity_id",
      otherKey: "user_id",
      through: ActivitiesSubscribers,
    });
  }
  Activities.belongsTo(User, { foreignKey: "user_id" });

  Activities.belongsToMany(ActivitiesCategories, {
    through: IdsActivitiesCategories,
  });

  Activities.belongsToMany(ActivitiesImages, {
    through: IdsActivitiesImages,
  });

  if (!User.hasAlias("avatar")) {
    User.belongsToMany(UsersImages, {
      as: "avatar",
      foreignKey: "user_id",
      otherKey: "image_id",
      through: IdsUsersImages,
    });
  }

  let subscribers = {
    as: "subscribers",
    model: User,
    include: [
      {
        as: "avatar",
        model: UsersImages,
        through: { attributes: [] },
      },
    ],
    order: [["avatar", "createdAt", "DESC"]],
    through: { attributes: [] },
    attributes: ["id", "username", "rating", "first_name", "last_name", "verified_account"],
  };

  if (!Activities.hasAlias("avatar")) {
    Activities.belongsToMany(UsersImages, {
      as: "avatar",
      foreignKey: "user_id",
      otherKey: "image_id",
      through: IdsUsersImages,
    });
  }

  let attributes = ["id", "title", "description", "createdAt", "partner"];
  let order = [["createdAt", "DESC"]];

  if (lat && lng) {
    attributes.push([Sequelize.literal(`6371 * acos(cos(radians(${lat})) * cos(radians(lat)) * cos(radians(${lng}) - radians(lng)) + sin(radians(${lat})) * sin(radians(lat)))`), 'distance']);
    order.push(Sequelize.literal('distance DESC'))
  }


  Activities.belongsTo(UsersSubscribers, {
    foreignKey: "user_id",
    targetKey: "second_user_id",
  });

  let activitiesInclude = [
    {
      as: "user",
      model: User,
      include: [
        {
          as: "avatar",
          model: UsersImages,
          through: { attributes: [] },
        },
      ],
      attributes: ["id", "username", "rating", "first_name", "last_name", "verified_account"],
    },
    {
      as: "activities_categories",
      model: ActivitiesCategories,
      attributes: [[lang, "title"], "color"],
      where: categoryId ? { id: categoryId } : {},
      through: { attributes: [] },
    },
    {
      as: "activities_images",
      model: ActivitiesImages,
      through: { attributes: [] },
      attributes: ["filename", "createdAt"],
    },
    subscribers,
  ];

  if (friends) {
    activitiesInclude.push({
      as: "users_subscriber",
      model: UsersSubscribers,
      attributes: ["id", "first_user_id", "second_user_id"],
      where: { first_user_id: user_id },

    })
  }

  Activities.findAll({
    where: dataActivities,
    limit,
    offset,
    attributes,
    having: (lat && lng) ? Sequelize.literal(`distance < ${distance}`) : [],
    order,
    distinct: true,
    include: activitiesInclude
  })
    .then(async (response) => {
      let activities = response.map((item) => {
        let data = item.dataValues;

        let user = {
          id: data.user.id,
          username: data.user.username,
          verified_account: data.user.verified_account,
          rating: data.user.rating,
          first_name: data.user.first_name,
          last_name: data.user.last_name,
          avatar:
            data.user.avatar.sort(function (a, b) {
              return new Date(b.createdAt) - new Date(a.createdAt);
            })[0]?.filename || null,
        };

        let subscribers = data.subscribers.map((item) => {
          return item.dataValues.avatar.length
            ? {
              ...item.dataValues,
              avatar: item.dataValues.avatar.sort(function (a, b) {
                return new Date(b.createdAt) - new Date(a.createdAt);
              })[0].filename,
            }
            : { ...item.dataValues, avatar: null };
        });

        return {
          ...data,
          user,
          subscribers,
          subscribe: !!item.subscribers?.find((item) => item.id === myUserId),
        };
      });
      let count = response.count;

      if (!friends) {
        if (!subscriptions && subscriptions !== undefined) {
          activities = activities.filter((item) => !item.subscribe);
        } else if (subscriptions) {
          activities = activities.filter((item) => item.subscribe);
          count = await ActivitiesSubscribers.count({ where: { user_id } });
        }
      }
      res
        .status(200)
        .send(
          // response
          getPagingData({ ...response, count, rows: activities }, page, limit)
        );
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getActivity = (req, res) => {
  let { activity_id } = req.body;
  let lang = req.headers["accept-language"] || "en";
  let user_id = getUserId(req, res);
  let dataActivities = { id: activity_id };

  if (!Activities.hasAlias("subscribers")) {
    Activities.belongsToMany(User, {
      as: "subscribers",
      foreignKey: "activity_id",
      otherKey: "user_id",
      through: ActivitiesSubscribers,
    });
  }
  Activities.belongsTo(User, { foreignKey: "user_id" });

  Activities.belongsToMany(ActivitiesCategories, {
    through: IdsActivitiesCategories,
  });

  Activities.belongsToMany(ActivitiesImages, {
    through: IdsActivitiesImages,
  });

  if (!User.hasAlias("avatar")) {
    User.belongsToMany(UsersImages, {
      as: "avatar",
      foreignKey: "user_id",
      otherKey: "image_id",
      through: IdsUsersImages,
    });
  }

  let subscribers = {
    as: "subscribers",
    model: User,
    include: [
      {
        as: "avatar",
        model: UsersImages,
        through: { attributes: [] },
      },
    ],
    order: [["avatar", "createdAt", "DESC"]],
    through: { attributes: [] },
    attributes: ["id", "username", "rating", "first_name", "last_name"],
  };

  if (!Activities.hasAlias("avatar")) {
    Activities.belongsToMany(UsersImages, {
      as: "avatar",
      foreignKey: "user_id",
      otherKey: "image_id",
      through: IdsUsersImages,
    });
  }

  Activities.findOne({
    where: dataActivities,
    attributes: ["id", "title", "description", "createdAt", "partner"],
    order: [["createdAt", "DESC"]],
    distinct: true,
    include: [
      {
        as: "user",
        model: User,
        include: [
          {
            as: "avatar",
            model: UsersImages,
            through: { attributes: [] },
          },
        ],
        attributes: ["id", "username", "rating", "first_name", "last_name", "verified_account"],
      },
      {
        as: "activities_categories",
        model: ActivitiesCategories,
        attributes: [[lang, "title"], "color", "id"],
        through: { attributes: [] },
      },
      {
        as: "activities_images",
        model: ActivitiesImages,
        through: { attributes: [] },
        attributes: ["filename", "createdAt", "id"],
      },
      subscribers,
    ],
  })
    .then(async (response) => {
      let data = response.dataValues;
      let user = {
        id: data.user.id,
        username: data.user.username,
        verified_account: data.user.verified_account,
        rating: data.user.rating,
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        avatar:
          data.user.avatar.sort(function (a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          })[0]?.filename || null,
      };

      let subscribers = data.subscribers.map((item) => {
        return item.dataValues.avatar.length
          ? {
            ...item.dataValues,
            avatar: item.dataValues.avatar.sort(function (a, b) {
              return new Date(b.createdAt) - new Date(a.createdAt);
            })[0].filename,
          }
          : { ...item.dataValues, avatar: null };
      });

      let activities = {
        ...data,
        user,
        subscribers,
        subscribe: !!response.subscribers?.find((item) => item.id === user_id),
      };

      res.status(200).send(activities);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};