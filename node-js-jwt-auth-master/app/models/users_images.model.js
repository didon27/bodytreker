module.exports = (sequelize, Sequelize) => {
  const UsersImages = sequelize.define("users_images", {
    filename: {
      type: Sequelize.STRING,
    },
    user_id: {
      type: Sequelize.INTEGER,
    },
  });

  return UsersImages;
};
