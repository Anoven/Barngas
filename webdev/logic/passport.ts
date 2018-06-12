import passport = require('passport');
import passport_local = require("passport-local");
import bcrypt = require('bcrypt-nodejs');

// Import user model
let models = require("../models");
const User = models.user;

export default function passport_module(passport: any){
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
	    let isValidPassword = function(userpass: string, password: string) {
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
	passport.serializeUser(function(user: any, done: any) {
	    done(null, user.id);
	});

	// deserialize user 
	passport.deserializeUser(function(id: number, done: any) {
	    User.findById(id).then(function(user: any) {
	        if (user) {
	            done(null, user.get());
	        } else {
	            done(user.errors, null);
	        }
	    });
	});
}