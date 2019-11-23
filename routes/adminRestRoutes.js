const express = require("express");
const auth = require('../conf/auth');
const adminRestController = require("../controllers/adminRestController");

const router = express.Router();

// Project routes.
router.post("/project", auth.ensureAuthenticated, auth.ensureAuthorized, adminRestController.postCreateProject);
router.put("/project/:id", auth.ensureAuthenticated, auth.ensureAuthorized, adminRestController.putEditProject);
router.delete("/project/:id", auth.ensureAuthenticated, auth.ensureAuthorized, adminRestController.deleteProject);

// SubProject routes.
router.post("/subproject", auth.ensureAuthenticated, auth.ensureAuthorized, adminRestController.postCreateSubProject);
router.put("/subproject/:id", auth.ensureAuthenticated, auth.ensureAuthorized, adminRestController.putEditSubProject);
router.delete("/subproject/:id", auth.ensureAuthenticated, auth.ensureAuthorized, adminRestController.deleteSubProject);

// User routes.
router.post("/user", auth.ensureAuthenticated, auth.ensureAuthorized, adminRestController.postCreateUser);
router.put("/user/:id", auth.ensureAuthenticated, auth.ensureAuthorized, adminRestController.putEditUser);
router.delete("/user/:id", auth.ensureAuthenticated, auth.ensureAuthorized, adminRestController.deleteUser);

// channels.
router.post("/channel", auth.ensureAuthenticated, auth.ensureAuthorized, adminRestController.postCreateChannel);
router.put("/channel/:channelId", auth.ensureAuthenticated, auth.ensureAuthorized, adminRestController.putUpdateChannel);
router.post("/channelsLink", auth.ensureAuthenticated, auth.ensureAuthorized, adminRestController.postChannelLinks);
router.put("/channelsLink/:channelId", auth.ensureAuthenticated, auth.ensureAuthorized, adminRestController.putUpdateChannelLiks);

// User-Project routes.
router.post("/:projectId", auth.ensureAuthenticated, auth.ensureAuthorized, adminRestController.postCreateUserForProject);
router.put("/:projectId/:userId", auth.ensureAuthenticated, auth.ensureAuthorized, adminRestController.putEditUserForProject);
router.delete("/:projectId/:userId", auth.ensureAuthenticated, auth.ensureAuthorized, adminRestController.deleteUserForProject);

module.exports = router;