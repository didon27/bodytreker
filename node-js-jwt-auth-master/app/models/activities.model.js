module.exports = (sequelize, Sequelize) => {
  const Activities = sequelize.define("activities", {
    description: {
      type: Sequelize.STRING,
    },
    title: {
      type: Sequelize.STRING,
    },
    partner: {
      type: Sequelize.INTEGER,
    },
    user_id: {
      type: Sequelize.INTEGER,
    },
    createdAt: {
      type: Sequelize.BOOLEAN,
    },
    lat: {
      type: Sequelize.DOUBLE,
    },
    lng: {
      type: Sequelize.DOUBLE,
    },
    location: {
      type: Sequelize.GEOMETRY('POINT')
    },
  });

  return Activities;
};
