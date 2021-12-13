module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING,
    },
    first_name: {
      type: Sequelize.STRING,
    },
    last_name: {
      type: Sequelize.STRING,
    },
    description: {
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
    status: {
      type: Sequelize.INTEGER,
    },
    gender: {
      type: Sequelize.INTEGER,
    },
    age: {
      type: Sequelize.INTEGER,
    },
    rating: {
      type: Sequelize.FLOAT,
    },
  });

  return User;
};
