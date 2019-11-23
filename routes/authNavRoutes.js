const express = require("express");
const router = express.Router();
const authNavController = require("../controllers/authNavController");

router.get("/login", authNavController.getLogin);

module.exports = router;
