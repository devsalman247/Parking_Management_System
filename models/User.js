const mongoose = require('mongoose'),
      uniqueValidator = require('mongoose-unique-validator'),
      bcrypt = require('bcrypt'),
      jwt = require('jsonwebtoken'),
      secret = require('../config/env/index').secret;

const userSchema = new mongoose.Schema({
    "email" : {
        type    : String, 
        unique  : true, 
        required : [true, 'email is required'], 
        match: [/\S+@\S+\.\S+/, 'is invalid']
    },
    "password" : {
        type     : String, 
        required : [true, 'password is required']
    },
    "role" : { 
        type : Number, // 0=user, 1=admin, 2=staff
    },
    "vehicle" : [{
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'Vehicle'
    }],
    "salt"   : {
        type : String
    }
},{timestamps : true});

userSchema.plugin(uniqueValidator, {message : 'is already taken.'});

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.pre('save', async function(){
    this.salt = await bcrypt.genSalt();
    this.password =  bcrypt.hashSync(this.password, this.salt);
});

userSchema.methods.generateJWT = function() {
  return jwt.sign(
    {
    id: this._id,
    email: this.email,
    role: this.role , 
    },
    secret, 
    {expiresIn : '2h'}
  );
};

userSchema.methods.toAuthJSON = function() {
    return {
        email : this.email,
        token : this.generateJWT(),
    }
};

module.exports = mongoose.model('User', userSchema);