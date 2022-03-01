const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,
    port: config.port,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.password_resets  = require("./pasword_resets.model.js")(sequelize, Sequelize);
db.activities = require("./activities.model.js")(sequelize, Sequelize);
db.activities_categories = require("./activities_categories.model")(sequelize, Sequelize);
db.ids_activities_categories = require("./ids_activities_categories.model")(sequelize, Sequelize);
db.activities_images = require("./activities_images.model")(sequelize, Sequelize);
db.refreshToken = require("../models/refreshToken.model.js")(sequelize, Sequelize);

db.activities_subscribers = require("../models/activities_subscribers.model")(sequelize, Sequelize);
db.ids_activities_images = require("../models/ids_activities_images.model")(sequelize, Sequelize);

db.ids_users_images = require("../models/ids_users_images.model")(sequelize, Sequelize);
db.users_images = require("./users_images.model")(sequelize, Sequelize);
db.users_subscribers = require("./users_subscribers.model")(sequelize, Sequelize);

db.ids_activities_statuses = require("../models/ids_activities_statuses.model")(sequelize, Sequelize);

db.users_ratings = require("../models/users_ratings.model")(sequelize, Sequelize);


db.refreshToken.belongsTo(db.user, {
  foreignKey: 'userId', targetKey: 'id'
});
db.user.hasOne(db.refreshToken, {
  foreignKey: 'userId', targetKey: 'id'
});

module.exports = db;
