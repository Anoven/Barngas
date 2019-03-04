"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport_local = require("passport-local");
const bcrypt = require("bcrypt-nodejs");
let models = require("../models");
const User = models.user;
function passport_module(passport) {
    let LocalStrategy = passport_local.Strategy;
    passport.use('local-register', new LocalStrategy({
        usernameField: 'reg_username',
        passwordField: 'reg_password',
        passReqToCallback: true
    }, function (req, username, password, done) {
        let generate_hash = function (password) {
            return bcrypt.hashSync(password);
        };
        User.findOne({
            where: {
                username: username
            }
        }).then(function (user) {
            if (user) {
                return done(null, false, {
                    message: 'That username is already taken'
                });
            }
            else {
                let hashed_password = generate_hash(password);
                let data = {
                    username: username,
                    password: hashed_password,
                    first_name: req.body.reg_first_name,
                    last_name: req.body.reg_last_name,
                    email: req.body.reg_email,
                    phone: req.body.reg_phone
                };
                User.create(data).then(function (new_user, created) {
                    if (!new_user) {
                        return done(null, false);
                    }
                    if (new_user) {
                        return done(null, new_user);
                    }
                });
            }
        });
    }));
    passport.use('local-login', new LocalStrategy({
        usernameField: 'lg_username',
        passwordField: 'lg_password',
        passReqToCallback: true
    }, function (req, username, password, done) {
        let isValidPassword = function (userpass, password) {
            return bcrypt.compareSync(password, userpass);
        };
        User.findOne({
            where: {
                username: username
            }
        }).then(function (user) {
            if (!user) {
                return done(null, false, {
                    message: 'incorrect username'
                });
            }
            if (!isValidPassword(user.password, password)) {
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }
            var user = user.get();
            console.log('gotem');
            return done(null, user);
        }).catch(function (err) {
            console.log("Error:", err);
            return done(null, false, {
                message: 'Something went wrong with your Signin'
            });
        });
    }));
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        User.findById(id).then(function (user) {
            if (user) {
                done(null, user.get());
            }
            else {
                done(user.errors, null);
            }
        });
    });
}
exports.default = passport_module;
