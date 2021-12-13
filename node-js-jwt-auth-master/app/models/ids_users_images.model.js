module.exports = (sequelize, Sequelize) => {
  const IdsUsersImages = sequelize.define("ids_users_images", {
    user_id: {
      type: Sequelize.INTEGER,
    },
    image_id: {
      type: Sequelize.INTEGER,
    },
  });

  return IdsUsersImages;
};
