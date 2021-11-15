module.exports = (sequelize, Sequelize) => {
  const ActivitiesCategories = sequelize.define("activities_categories", {
    ua: {
      type: Sequelize.STRING,
    },
    ru: {
      type: Sequelize.STRING,
    },
    en: {
      type: Sequelize.STRING,
    },
    color: {
      type: Sequelize.BOOLEAN,
    },
  });

  return ActivitiesCategories;
};
