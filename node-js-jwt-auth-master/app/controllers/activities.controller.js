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

const upload = require("../middleware/upload");

exports.createNewActivities = async (req, res) => {
  try {
    await upload(req, res);
    let { title, description, user_id, categories_ids, partner } = req.body;

    if (title.length < 6) {
      res.status(400).send({ error: "Title short" });
    } else if (description.length < 6) {
      res.status(400).send({ error: "Description short" });
    }

    Activities.create({ title, description, user_id, partner })
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
  const { user_id, activity_id } = req.body;

  ActivitiesSubscribers.create({ user_id, activity_id })
    .then((activity) => {
      res.status(200).send({ message: "Activities subscribe!" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.unsubscribeActivity = (req, res) => {
  const { user_id, activity_id } = req.body;

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

exports.getActivities = (req, res) => {
  let { user_id, title, partner, subscriptions, page, size } = req.body;
  let lang = req.headers["accept-language"] || "en";

  const { limit, offset } = getPagination(page, size);

  let dataActivities = {};

  dataActivities.user_id = { [Sequelize.Op.not]: user_id };

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

  let subscribers = {
    as: "subscribers",
    model: User,
    through: { attributes: [] },
    attributes: ["id", "username", "rating"],
  };

  if (subscriptions) {
    subscribers.where = { id: user_id };
  }

  Activities.findAndCountAll({
    where: dataActivities,
    limit,
    offset,
    attributes: ["id", "title", "description", "createdAt"],
    order: [["createdAt", "DESC"]],
    distinct: true,
    include: [
      {
        as: "user",
        model: User,
        attributes: ["id", "username", "rating"],
      },
      {
        as: "activities_categories",
        model: ActivitiesCategories,
        attributes: [[lang, "title"], "color"],
        through: { attributes: [] },
      },
      {
        as: "activities_images",
        model: ActivitiesImages,
        through: { attributes: [] },
        attributes: ["filename"],
      },
      subscribers,
    ],
  })
    .then((response) => {
      let activities = response.rows.map((item) => {
        return {
          ...item.dataValues,
          subscribe: !!item.subscribers?.find((item) => item.id === user_id),
        };
      });

      if (!subscriptions) {
        activities = activities.filter((item) => !item.subscribe);
      }

      res
        .status(200)
        .send(getPagingData({ ...response, rows: activities }, page, limit));
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getMyActivities = (req, res) => {
  let { user_id, title } = req.body;
  let lang = req.headers["accept-language"] || "en";

  let dataUser = { id: user_id };
  let dataActivities = {};

  if (title) {
    dataActivities.title = { [Sequelize.Op.like]: `%${title}%` };
  }

  Activities.belongsTo(User, { foreignKey: "user_id" });
  // Activities.belongsTo(ActivitiesCategories, { foreignKey: "category_id" });

  Activities.belongsToMany(ActivitiesCategories, {
    through: IdsActivitiesCategories,
  });

  Activities.belongsToMany(ActivitiesImages, {
    through: IdsActivitiesImages,
  });

  Activities.findAll({
    where: dataActivities,
    order: [["createdAt", "DESC"]],
    attributes: ["id", "title", "description"],
    include: [
      {
        as: "user",
        model: User,
        where: dataUser,
        attributes: ["id", "username", "rating"],
      },
      {
        as: "activities_categories",
        model: ActivitiesCategories,
        attributes: [[lang, "title"], "color"],
        through: { attributes: [] },
      },
      {
        as: "activities_images",
        model: ActivitiesImages,
        through: { attributes: [] },
        attributes: ["filename"],
        // through: { attributes: [] },
      },
    ],
  })
    .then((activities) => {
      res.status(200).send(activities);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
