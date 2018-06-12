import express = require('express');



function isLoggedIn(req: express.Request, res: express.Response, next: express.NextFunction): void {
    if(req.isAuthenticated()){
        return next();
    }
        res.redirect("/login");
}

export default function routes_module(app: any, passport: any, models: any){
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
    app.get("/graph/rawData",isLoggedIn, function(req: express.Request,res: express.Response){
        let rawData = models.rawData;
        rawData.findAll({
            attributes: [['updatedAt', 't'], ['value', 'y']],
            where: {
                sensorId: 1,
                sensorGroupId: 1,
                basestationId: 1
            },
            order: ['updatedAt']
        }).then(function(raw_data: any) {
            if(!raw_data) {
                // console.log('no data');
                res.send({'raw_data': []});
            }
            // console.log('found raw data: ' + raw_data.length + "lines");
            res.send({'raw_data': raw_data})
        });
    });

    app.get("/configure",isLoggedIn, function(req: express.Request,res: express.Response){
        res.render("configure");
    });

    app.get("/myprofile",isLoggedIn, function(req: express.Request,res: express.Response){
        res.render("profile");
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

    app.get("/logout", function(req: express.Request, res: express.Response){
        req.session.destroy(function(err) {
            res.redirect('/');
        })
    });
}