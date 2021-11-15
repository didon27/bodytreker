const db = require("../models");
const Activities = db.activities;
const Sequelize = require("sequelize");
const User = db.user;
const ActivitiesCategories = db.activities_categories;
const IdsActivitiesCategories = db.ids_activities_categories;
const ActivitiesImages = db.activities_images;

exports.createNewActivities = (req, res) => {
  let { title, description, user_id, categories_ids } = req.body;

  Activities.create({ title, description, user_id })
    .then((activity) => {
      let categories = categories_ids?.map((category) => {
        return {
          activityId: activity.id,
          activitiesCategoryId: category,
        };
      });

      ActivitiesImages.create({
        filename: req.file.filename,
        activity_id: activity.id,
      });
      IdsActivitiesCategories.bulkCreate(categories).then((id) => {
        res.status(200).send(id);
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getCategories = (req, res) => {
  ActivitiesCategories.findAll()
    .then((categories) => {
      res.status(200).send(categories);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getActivities = (req, res) => {
  let { user_id, title, actual } = req.body;
  let dataUser = {};
  let dataActivities = {};

  if (actual) {
    dataActivities.user_id = { [Sequelize.Op.not]: user_id };
  } else if (user_id) {
    dataUser.id = user_id;
  }

  if (title) {
    dataActivities.title = { [Sequelize.Op.like]: `%${title}%` };
  }

  Activities.belongsTo(User, { foreignKey: "user_id" });
  // Activities.belongsTo(ActivitiesCategories, { foreignKey: "category_id" });

  Activities.belongsToMany(ActivitiesCategories, {
    through: IdsActivitiesCategories,
  });

  Activities.belongsTo(ActivitiesImages, {
    foreignKey: "id",
    targetKey: "activity_id",
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
        // attributes: ["id"],
        through: { attributes: [] },
      },
      {
        as: "activities_image",
        model: ActivitiesImages,
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
