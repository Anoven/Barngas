import express = require('express');
import http = require("http")
import html = require('ejs');
import passport = require('passport');
import passport_local = require("passport-local");
import session = require("express-session");
import body_parser = require('body-parser');
import Sequelize = require('sequelize');
import method_override = require('method-override');

const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(body_parser.urlencoded({ extended: true}));
app.use(body_parser.json());
app.use(method_override('_method'));

// -----------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------
//Database setup
import {create_triggers} from './logic/create_triggers'
let models = require("./models");
models.sequelize.sync().then(function() {    //sync the database

    create_triggers(models);    //create the database triggers
    
    console.log('Nice! Database looks fine');
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
// passport setup

import passport_module from './logic/passport'
passport_module(passport);
// -----------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------
// routes setup

import routes_module from './logic/routes'
routes_module(app, passport, models);
// -----------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------
// Start listening

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server started");
});