module.exports = (sequelize, Sequelize) => {
  const ActivitiesImages = sequelize.define("activities_images", {
    filename: {
      type: Sequelize.STRING,
    },
    activity_id: {
      type: Sequelize.INTEGER,
    },
  });

  return ActivitiesImages;
};
