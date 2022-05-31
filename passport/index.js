const passport = require('passport');
const local = require('./localStrategy');
const User = require('../models/user');

module.exports = () => {
    passport.serializeUser((user, done) => {
        // console.log(user,'시리얼');
        done(null, user.id);
    })

    passport.deserializeUser((id, done) => {
        // console.log(id,'디시리얼');
        User.findOne({ 
            attributes: ['id','nick'],
            where: { id } 
        })
            .then(user => done(null, user))
            .catch(err => done(err));
    })

    local();
};