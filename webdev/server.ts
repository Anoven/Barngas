import express = require('express');
import http = require("http")
import html = require('ejs');
import passport = require('passport');
import passport_local = require("passport-local")
import session = require("express-session")
import body_parser = require('body-parser')

import bcrypt = require('bcrypt-nodejs');

import Sequelize = require('sequelize')
import mysql = require('mysql');

import method_override = require('method-override')

export const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(body_parser.urlencoded({ extended: true}));
app.use(body_parser.json());
app.use(method_override('_method'));

// -----------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------
//Database Models
let models = require("./models");
const User = models.user;
//Sync Database
models.sequelize.sync().then(function() {
    console.log('Nice! Database looks fine');
    models.sequelize.query(
        'DROP TRIGGER IF EXISTS aggregate_hourly;'
    );
    models.sequelize.query(
        ' CREATE TRIGGER aggregate_hourly AFTER INSERT ON rawData' +
        ' FOR EACH ROW' +
        ' BEGIN' +
            ' DELETE FROM hourlyData' +
            ' WHERE year = new.year AND month = new.month AND day = new.day AND hour = new.hour AND sensorId = new.sensorId AND sensorGroupId = new.sensorGroupId AND basestationId = new.basestationId;' +

            ' INSERT INTO hourlyData (id, value, year, month, day, hour, createdAt, updatedAt, sensorId, sensorGroupId, basestationId)' + 
            ' SELECT NULL as id, avg(value) as value, year, month, day, hour, NOW() as createdAt, NOW() as updatedAt, sensorId, sensorGroupId, basestationId' +
            ' FROM rawData' +
            ' WHERE year = new.year AND month = new.month AND day = new.day AND hour = new.hour AND sensorId = new.sensorId AND sensorGroupId = new.sensorGroupId AND basestationId = new.basestationId' +
            ' GROUP BY year, month, day, hour, sensorId, sensorGroupId, basestationId;' + 
        ' END;'
    );
    models.sequelize.query(
        'DROP TRIGGER IF EXISTS aggregate_daily;'
    );
    models.sequelize.query(
        ' CREATE TRIGGER aggregate_daily AFTER INSERT ON hourlyData' +
        ' FOR EACH ROW' +
        ' BEGIN' +
            ' DELETE FROM dailyData' +
            ' WHERE year = new.year AND month = new.month AND day = new.day AND sensorId = new.sensorId AND sensorGroupId = new.sensorGroupId AND basestationId = new.basestationId;' +

            ' INSERT INTO dailyData (id, value, year, month, day, createdAt, updatedAt, sensorId, sensorGroupId, basestationId)' + 
            ' SELECT NULL as id, avg(value) as value, year, month, day, NOW() as createdAt, NOW() as updatedAt, sensorId, sensorGroupId, basestationId' +
            ' FROM hourlyData' +
            ' WHERE year = new.year AND month = new.month AND day = new.day AND sensorId = new.sensorId AND sensorGroupId = new.sensorGroupId AND basestationId = new.basestationId' +
            ' GROUP BY year, month, day, sensorId, sensorGroupId, basestationId;' + 
        ' END;'
    );
    models.sequelize.query(
        'DROP TRIGGER IF EXISTS aggregate_monthly;'
    );
    models.sequelize.query(
        ' CREATE TRIGGER aggregate_monthly AFTER INSERT ON dailyData' +
        ' FOR EACH ROW' +
        ' BEGIN' +
            ' DELETE FROM monthlyData' +
            ' WHERE year = new.year AND month = new.month AND sensorId = new.sensorId AND sensorGroupId = new.sensorGroupId AND basestationId = new.basestationId;' +

            ' INSERT INTO monthlyData (id, value, year, month, createdAt, updatedAt, sensorId, sensorGroupId, basestationId)' + 
            ' SELECT NULL as id, avg(value) as value, year, month, NOW() as createdAt, NOW() as updatedAt, sensorId, sensorGroupId, basestationId' +
            ' FROM dailyData' +
            ' WHERE year = new.year AND month = new.month AND sensorId = new.sensorId AND sensorGroupId = new.sensorGroupId AND basestationId = new.basestationId' +
            ' GROUP BY year, month, sensorId, sensorGroupId, basestationId;' + 
        ' END;'
    );
    models.sequelize.query(
        'DROP TRIGGER IF EXISTS aggregate_yearly;'
    );
    models.sequelize.query(
        ' CREATE TRIGGER aggregate_yearly AFTER INSERT ON monthlyData' +
        ' FOR EACH ROW' +
        ' BEGIN' +
            ' DELETE FROM yearlyData' +
            ' WHERE year = new.year AND sensorId = new.sensorId AND sensorGroupId = new.sensorGroupId AND basestationId = new.basestationId;' +

            ' INSERT INTO yearlyData (id, value, year, createdAt, updatedAt, sensorId, sensorGroupId, basestationId)' + 
            ' SELECT NULL as id, avg(value) as value, year, NOW() as createdAt, NOW() as updatedAt, sensorId, sensorGroupId, basestationId' +
            ' FROM monthlyData' +
            ' WHERE year = new.year AND sensorId = new.sensorId AND sensorGroupId = new.sensorGroupId AND basestationId = new.basestationId' +
            ' GROUP BY year, sensorId, sensorGroupId, basestationId;' + 
        ' END;'
    );
}).catch(function(err: Error) {
    console.log(err, "Something went wrong with the Database Update!")
});

// -----------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------
// Initialize Static Directories
app.use(express.static(__dirname));
app.use(express.static(__dirname + "/views"));

// -----------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------
// Initialize Session (AKA Cookies)
app.use(session({
    secret: "Secret Shhh",
    resave: true,
    saveUninitialized: true,
    cookie:{ path: '/', httpOnly: true, secure: false, maxAge: null }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
    // user would either be undefined or the signed in user
    res.locals.user = req.user;
    next();
});
// -----------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------
// LOGIN VERIFICATION

let LocalStrategy = passport_local.Strategy;
passport.use('local-register', new LocalStrategy({
    usernameField: 'reg_username',
    passwordField: 'reg_password',
    passReqToCallback: true
},
function(req, username, password, done) {
    let generate_hash = function(password: string) {

        // return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
        return bcrypt.hashSync(password);
    };
    User.findOne({
        where: {
            username: username
        }
    }).then(function(user: any) {
        if (user){
            return done(null, false, {
                message: 'That username is already taken'
            });
        } 
        else{
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
            User.create(data).then(function(new_user: any, created: any) {
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
//LOCAL SIGNIN
passport.use('local-login', new LocalStrategy({
    usernameField: 'lg_username',
    passwordField: 'lg_password',
    passReqToCallback: true
},
function(req, username, password, done) {
    var isValidPassword = function(userpass: string, password: string) {
        return bcrypt.compareSync(password, userpass);
    }
    User.findOne({
        where: {
            username: username
        }
    }).then(function(user: any) {
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
        console.log('gotem')
        return done(null, user);
    }).catch(function(err: Error) {
        console.log("Error:", err);
        return done(null, false, {
            message: 'Something went wrong with your Signin'
        });
    });
}));
//serialize
passport.serializeUser(function(user: any, done) {
    done(null, user.id);
});

// deserialize user 
passport.deserializeUser(function(id: number, done) {
    User.findById(id).then(function(user: any) {
        if (user) {
            done(null, user.get());
        } else {
            done(user.errors, null);
        }
    });
});

app.get("/logout", function(req: express.Request, res: express.Response){
    req.session.destroy(function(err) {
        res.redirect('/');
    })
});

// // Checks if user is loggedIn
function isLoggedIn(req: express.Request, res: express.Response, next: express.NextFunction){
    if(req.isAuthenticated()){
        return next();
    }
        res.redirect("/login");
}

// -----------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------
// Routes
app.get("/",function(req: express.Request,res: express.Response){
    // res.render("home");
    res.redirect('/login');
});

app.get("/dashboard",isLoggedIn, function(req: express.Request,res: express.Response){
    res.render("dashboard");
});

app.get("/graph",isLoggedIn, function(req: express.Request,res: express.Response){
    res.render("graph");
});

app.get('/login', function(req: express.Request, res: express.Response){
    res.render('login');
});

app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
}));

app.get('/register', function(req: express.Request, res: express.Response){
    res.render('register');
});

app.post('/register', passport.authenticate('local-register', {
    successRedirect: '/dashboard',
    failureRedirect: '/register'
}));

app.get('/forgot_password', function(req: express.Request, res: express.Response){
    res.render('forgot_password');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server started");
});