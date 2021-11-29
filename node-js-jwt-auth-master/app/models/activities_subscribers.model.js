module.exports = (sequelize, Sequelize) => {
  const ActivitiesSubscribers = sequelize.define("activities_subscribers", {
    activity_id: {
      type: Sequelize.INTEGER,
    },
    user_id: {
      type: Sequelize.INTEGER,
    },
  });

  return ActivitiesSubscribers;
};
