module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING,
    },
    activation_token: {
      type: Sequelize.STRING,
    },
    email_verified: {
      type: Sequelize.BOOLEAN,
    },
    registration_completed: {
      type: Sequelize.BOOLEAN,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    rating: {
      type: Sequelize.FLOAT,
    },
  });

  return User;
};
