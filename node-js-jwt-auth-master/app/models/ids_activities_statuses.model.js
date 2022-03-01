module.exports = (sequelize, Sequelize) => {
  const IdsActivitiesStatuses = sequelize.define("ids_activities_statuses", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    activity_id: {
      type: Sequelize.INTEGER,
    },
    user_id: {
      type: Sequelize.INTEGER,
    },
    status: {
      type: Sequelize.INTEGER,
    },
  });

  return IdsActivitiesStatuses;
};
