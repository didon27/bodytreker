const db = require("../models");
const Activities = db.activities;
const Sequelize = require("sequelize");
const User = db.user;
const ActivitiesCategories = db.activities_categories;
const IdsActivitiesCategories = db.ids_activities_categories;
const ActivitiesImages = db.activities_images;
const strings = require("../strings");
const IdsActivitiesImages = db.ids_activities_images;

const upload = require("../middleware/upload");

exports.createNewActivities = async (req, res) => {
  try {
    await upload(req, res);
    let { title, description, user_id, categories_ids, partner } = req.body;

    Activities.create({ title, description, user_id, partner })
      .then((activity) => {
        let categories = categories_ids?.map((category) => {
          return {
            activityId: activity.id,
            activitiesCategoryId: category,
          };
        });

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

        IdsActivitiesCategories.bulkCreate(categories).then((id) => {
          res.status(200).send(id);
        });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  } catch (e) {
    res.status(500).send({ error: e });
  }
};

exports.getCategories = (req, res) => {
  let lang = req.headers["accept-language"] || "en";

  ActivitiesCategories.findAll({
    attributes: ["id", [lang, "title"], "color"],
  })
    .then((categories) => {
      res.status(200).send(categories);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getActivities = (req, res) => {
  let { user_id, title, actual } = req.body;
  let lang = req.headers["accept-language"] || "en";

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
