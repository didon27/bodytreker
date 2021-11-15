module.exports = (sequelize, Sequelize) => {
  const IdsActivitiesCategories = sequelize.define(
    "ids_activities_categories",
    {
      activityId: {
        type: Sequelize.INTEGER,
      },
      activitiesCategoryId: {
        type: Sequelize.INTEGER,
      },
    }
  );

  return IdsActivitiesCategories;
};
