// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    age: Number,
    age_range: String,
    createDate: {type: Date, default: Date.now()},
    firstName: String,
    lastName: String,
    gender: String,
    locale: String,
    email: String,
    s_id: String,
    token: String,
    location: {
        city: String,
        state: String
    },
    social: {
        id: {type: String, default: null}, //FB ID or Twitter ID
        socialType: {type: String, default: null} //facebook or twitter
    }
});

// generating a hash
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
