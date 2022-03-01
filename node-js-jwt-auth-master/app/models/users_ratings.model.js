module.exports = (sequelize, Sequelize) => {
  const UsersRatings = sequelize.define("users_ratings", {
    user_id: {
      type: Sequelize.INTEGER,
    },
    valuer_id: {
      type: Sequelize.INTEGER,
    },
    activity_id: {
      type: Sequelize.INTEGER,
    },
    first_rating: {
      type: Sequelize.FLOAT,
    },
    second_rating: {
      type: Sequelize.FLOAT,
    },
    third_rating: {
      type: Sequelize.FLOAT,
    },
  });

  return UsersRatings;
};
