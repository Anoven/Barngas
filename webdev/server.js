"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const body_parser = require("body-parser");
const method_override = require("method-override");
const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());
app.use(method_override('_method'));
const create_triggers_1 = require("./logic/create_triggers");
let models = require("./models");
models.sequelize.sync().then(function () {
    create_triggers_1.create_triggers(models);
    console.log('Nice! Database looks fine');
}).catch(function (err) {
    console.log(err, "Something went wrong with the Database Update!");
});
app.use(express.static(__dirname));
app.use(express.static(__dirname + "/views"));
app.use(session({
    secret: "Secret Shhh",
    resave: true,
    saveUninitialized: true,
    cookie: { path: '/', httpOnly: true, secure: false, maxAge: null }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
});
const passport_1 = require("./logic/passport");
passport_1.default(passport);
const routes_1 = require("./logic/routes");
routes_1.default(app, passport, models);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server started");
});
