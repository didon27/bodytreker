module.exports = (sequelize, Sequelize) => {
  const IdsActivitiesImages = sequelize.define("ids_activities_images", {
    activityId: {
      type: Sequelize.INTEGER,
    },
    activitiesImageId: {
      type: Sequelize.INTEGER,
    },
  });

  return IdsActivitiesImages;
};
