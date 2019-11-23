const bcrypt = require("bcrypt-nodejs");
const mongoose = require("mongoose");
const SALT_FACTOR = 12;

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  fullname: { type: String },
  password: { type: String, required: true },
  role: {type: String, enum: ['admin', 'user'], default: 'user'},
  projectsNo: {type: Number, default: 0},
  projects: {type: Object}
});

const noop = function() {};

userSchema.pre("save", function(done) {
  var user = this;
  if (!user.isModified("password")) {
    return done();
  }
  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) {
      return done(err);
    }
    bcrypt.hash(user.password, salt, noop, function(err, hashedPassword) {
      if (err) {
        return done(err);
      }
      user.password = hashedPassword;
      done();
    });
  });
});

userSchema.methods.checkPassword = function(guess, done) {
  bcrypt.compare(guess, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

userSchema.methods.name = function() {
  return this.displayName || this.fullname;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
