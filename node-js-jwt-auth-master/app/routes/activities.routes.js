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

  app.post(
    "/api/activities/get-my-activities",
    [authJwt.verifyToken],
    controller.getActivities
  );

  app.post(
    "/api/activities/subscribe-activity",
    [authJwt.verifyToken],
    controller.subscribeActivity
  );

  app.post(
    "/api/activities/unsubscribe-activity",
    [authJwt.verifyToken],
    controller.unsubscribeActivity
  );

  app.post(
    "/api/activities/get-categories",
    [authJwt.verifyToken],
    controller.getCategories
  );
  app.post("/api/activities/multiple-upload", uploadController.multipleUpload);

  app.post(
    "/api/activities/create-new-activities",
    [authJwt.verifyToken],
    controller.createNewActivities
  );

  app.post(
    "/api/activities/activity-update",
    [authJwt.verifyToken],
    controller.activityUpdate
  );

  app.post(
    "/api/activities/delete-activity",
    [authJwt.verifyToken],
    controller.deleteActivity
  );

  app.post(
    "/api/activities/delete-image-activity",
    [authJwt.verifyToken],
    controller.deleteImageActivity
  );


  app.post(
    "/api/activities/search-activities",
    [authJwt.verifyToken],
    controller.searchActivities
  );

  app.post(
    "/api/activities/get-activity",
    [authJwt.verifyToken],
    controller.getActivity
  );
};
