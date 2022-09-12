const LocalStrategy = require('passport-local').Strategy,
      User = require('../models/User');

const myStrategy= new LocalStrategy({
    usernameField : "email",
    passwordField : "password"
}, function(email, password, done) {
    User.findOne({email}).then(user => {
        if(!user || !user.validPassword(password)) {
            return done(null, false, {errors : {'message' : 'email or password is invalid'}});
        }
        return done(null, user);
    }).catch(done);
});

module.exports = myStrategy;