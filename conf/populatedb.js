const User = require("../models/user");

module.exports = function() { 
    User.findOne({email:"admin@admin.com"})
    .then(result => {
        if (!result) {
            const admin = new User({
                fullname:"admin",
                email:"admin@admin.com",
                password:"1234",
                role:"admin"
            });
            admin.save(function (err, user) {
                if (err) return console.error(err);
                console.log("Admin created.");
            });
        }
    })
    .catch(err => {
        console.log(err);
    });
};
