const express = require("express");
const router = express.Router();
const auth = require('../conf/auth');
const vueTableController = require("../controllers/vueTableController");

router.get("/admin/users", auth.ensureAuthenticated, auth.ensureAuthorized, vueTableController.getAdminUsers);

router.get("/admin/:projectId", auth.ensureAuthenticated, auth.ensureAuthorized, vueTableController.getAdminProjectUsers);

router.get("/admin/:projectId/subprojects", auth.ensureAuthenticated, auth.ensureAuthorized, vueTableController.getAdminSubProjects);

router.get("/admin/:projectId/channelLinks", auth.ensureAuthenticated, auth.ensureAuthorized, vueTableController.getAdminChannelLinks);

module.exports = router;