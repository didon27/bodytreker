module.exports = (sequelize, Sequelize) => {
  const UsersSubscribers = sequelize.define("users_subscribers", {
    first_user_id: {
      type: Sequelize.INTEGER,
    },
    second_user_id: {
      type: Sequelize.INTEGER,
    },
  });

  return UsersSubscribers;
};
