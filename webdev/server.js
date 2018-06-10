"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const passport = require("passport");
const passport_local = require("passport-local");
const session = require("express-session");
const body_parser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const method_override = require("method-override");
exports.app = express();
exports.app.set("view engine", "ejs");
exports.app.use(express.json());
exports.app.use(body_parser.urlencoded({ extended: true }));
exports.app.use(body_parser.json());
exports.app.use(method_override('_method'));
let models = require("./models");
const User = models.user;
models.sequelize.sync().then(function () {
    console.log('Nice! Database looks fine');
    models.sequelize.query('DROP TRIGGER IF EXISTS aggregate_hourly;');
    models.sequelize.query(' CREATE TRIGGER aggregate_hourly AFTER INSERT ON rawData' +
        ' FOR EACH ROW' +
        ' BEGIN' +
        ' DELETE FROM hourlyData' +
        ' WHERE year = new.year AND month = new.month AND day = new.day AND hour = new.hour AND sensorId = new.sensorId AND sensorGroupId = new.sensorGroupId AND basestationId = new.basestationId;' +
        ' INSERT INTO hourlyData (id, value, year, month, day, hour, createdAt, updatedAt, sensorId, sensorGroupId, basestationId)' +
        ' SELECT NULL as id, avg(value) as value, year, month, day, hour, NOW() as createdAt, NOW() as updatedAt, sensorId, sensorGroupId, basestationId' +
        ' FROM rawData' +
        ' WHERE year = new.year AND month = new.month AND day = new.day AND hour = new.hour AND sensorId = new.sensorId AND sensorGroupId = new.sensorGroupId AND basestationId = new.basestationId' +
        ' GROUP BY year, month, day, hour, sensorId, sensorGroupId, basestationId;' +
        ' END;');
    models.sequelize.query('DROP TRIGGER IF EXISTS aggregate_daily;');
    models.sequelize.query(' CREATE TRIGGER aggregate_daily AFTER INSERT ON hourlyData' +
        ' FOR EACH ROW' +
        ' BEGIN' +
        ' DELETE FROM dailyData' +
        ' WHERE year = new.year AND month = new.month AND day = new.day AND sensorId = new.sensorId AND sensorGroupId = new.sensorGroupId AND basestationId = new.basestationId;' +
        ' INSERT INTO dailyData (id, value, year, month, day, createdAt, updatedAt, sensorId, sensorGroupId, basestationId)' +
        ' SELECT NULL as id, avg(value) as value, year, month, day, NOW() as createdAt, NOW() as updatedAt, sensorId, sensorGroupId, basestationId' +
        ' FROM hourlyData' +
        ' WHERE year = new.year AND month = new.month AND day = new.day AND sensorId = new.sensorId AND sensorGroupId = new.sensorGroupId AND basestationId = new.basestationId' +
        ' GROUP BY year, month, day, sensorId, sensorGroupId, basestationId;' +
        ' END;');
    models.sequelize.query('DROP TRIGGER IF EXISTS aggregate_monthly;');
    models.sequelize.query(' CREATE TRIGGER aggregate_monthly AFTER INSERT ON dailyData' +
        ' FOR EACH ROW' +
        ' BEGIN' +
        ' DELETE FROM monthlyData' +
        ' WHERE year = new.year AND month = new.month AND sensorId = new.sensorId AND sensorGroupId = new.sensorGroupId AND basestationId = new.basestationId;' +
        ' INSERT INTO monthlyData (id, value, year, month, createdAt, updatedAt, sensorId, sensorGroupId, basestationId)' +
        ' SELECT NULL as id, avg(value) as value, year, month, NOW() as createdAt, NOW() as updatedAt, sensorId, sensorGroupId, basestationId' +
        ' FROM dailyData' +
        ' WHERE year = new.year AND month = new.month AND sensorId = new.sensorId AND sensorGroupId = new.sensorGroupId AND basestationId = new.basestationId' +
        ' GROUP BY year, month, sensorId, sensorGroupId, basestationId;' +
        ' END;');
    models.sequelize.query('DROP TRIGGER IF EXISTS aggregate_yearly;');
    models.sequelize.query(' CREATE TRIGGER aggregate_yearly AFTER INSERT ON monthlyData' +
        ' FOR EACH ROW' +
        ' BEGIN' +
        ' DELETE FROM yearlyData' +
        ' WHERE year = new.year AND sensorId = new.sensorId AND sensorGroupId = new.sensorGroupId AND basestationId = new.basestationId;' +
        ' INSERT INTO yearlyData (id, value, year, createdAt, updatedAt, sensorId, sensorGroupId, basestationId)' +
        ' SELECT NULL as id, avg(value) as value, year, NOW() as createdAt, NOW() as updatedAt, sensorId, sensorGroupId, basestationId' +
        ' FROM monthlyData' +
        ' WHERE year = new.year AND sensorId = new.sensorId AND sensorGroupId = new.sensorGroupId AND basestationId = new.basestationId' +
        ' GROUP BY year, sensorId, sensorGroupId, basestationId;' +
        ' END;');
}).catch(function (err) {
    console.log(err, "Something went wrong with the Database Update!");
});
exports.app.use(express.static(__dirname));
exports.app.use(express.static(__dirname + "/views"));
exports.app.use(session({
    secret: "Secret Shhh",
    resave: true,
    saveUninitialized: true,
    cookie: { path: '/', httpOnly: true, secure: false, maxAge: null }
}));
exports.app.use(passport.initialize());
exports.app.use(passport.session());
exports.app.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
});
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
            console.log(req.body);
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
    var isValidPassword = function (userpass, password) {
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
exports.app.get("/logout", function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}
exports.app.get("/", function (req, res) {
    res.redirect('/login');
});
exports.app.get("/dashboard", isLoggedIn, function (req, res) {
    res.render("dashboard");
});
exports.app.get("/graph", isLoggedIn, function (req, res) {
    res.render("graph");
});
exports.app.get('/login', function (req, res) {
    res.render('login');
});
exports.app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
}));
exports.app.get('/register', function (req, res) {
    res.render('register');
});
exports.app.post('/register', passport.authenticate('local-register', {
    successRedirect: '/dashboard',
    failureRedirect: '/register'
}));
exports.app.get('/forgot_password', function (req, res) {
    res.render('forgot_password');
});
const PORT = process.env.PORT || 3000;
exports.app.listen(PORT, () => {
    console.log("Server started");
});
