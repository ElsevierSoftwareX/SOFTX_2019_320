const express = require("express");
const router = express.Router();
const auth = require('../conf/auth');
const navController = require("../controllers/navController");



router.get("/500", navController.error500);

router.get("/", auth.ensureAuthenticated, navController.getPanelIndex);

//Admin routes.
router.get("/admin/project/:urlName", auth.ensureAuthenticated, auth.ensureAuthorized, navController.getProject);

router.get("/admin/project/:urlName/subprojects", auth.ensureAuthenticated, auth.ensureAuthorized, navController.getSubProjects);

router.get("/admin/project/:projectId/channels", auth.ensureAuthenticated, auth.ensureAuthorized, navController.getChannels);

router.get("/admin/project/:projectId/channel-links", auth.ensureAuthenticated, auth.ensureAuthorized, navController.getChannelsLinks);





// User routes.
router.get("/user/project/:urlName", auth.ensureAuthenticated, navController.getUserProject);

// channels.
router.get("/c6/:projectId", auth.ensureAuthenticated, navController.getChatC2);
router.get("/:projectUrl/:channelUrl", auth.ensureAuthenticated, navController.getChatPage);


module.exports = router;
