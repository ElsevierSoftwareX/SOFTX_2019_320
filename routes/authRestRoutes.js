const express = require("express");
const { validator } = require('express-validator');
const authRestController = require("../controllers/authRestController");

const router = express.Router();

router.post("/login", (req, res, next) => {
    if (!validator.isEmail(req.body.username)) {
        req.flash('error', "Invalid email");
        return res.redirect('/auth/login');
    } 
    next();
}, authRestController.postLogin);

module.exports = router;