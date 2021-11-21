const controller = require("../controllers/activities.controller");
const uploadFile = require("../middleware/file");
const { authJwt } = require("../middleware");
const uploadController = require("../controllers/upload.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/activities/get-activities",
    [authJwt.verifyToken],
    controller.getActivities
  );
  app.get(
    "/api/activities/get-categories",
    [authJwt.verifyToken],
    controller.getCategories
  );
  app.post("/api/activities/multiple-upload", uploadController.multipleUpload);

  app.post(
    "/api/activities/create-new-activities",
    controller.createNewActivities
  );
};
