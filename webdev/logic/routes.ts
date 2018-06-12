import express = require('express');



function isLoggedIn(req: express.Request, res: express.Response, next: express.NextFunction): void {
    if(req.isAuthenticated()){
        return next();
    }
        res.redirect("/login");
}

export default function routes_module(app: any, passport: any, models: any): any{
    app.get("/",function(req: express.Request,res: express.Response){
        // res.render("home");
        res.redirect('/login');
    });

    app.get("/dashboard",isLoggedIn, function(req: express.Request,res: express.Response){
        res.render("dashboard");
    });
    // ------------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------------
    // Graphing Page
    function query_data(data_model: any, sensor_id: number, group_id: number, basestation_id: number): any {
        // Helper function for graphing page
        return new Promise((resolve: any, reject: any) => {
            let sensor = models.sensor;
            data_model.findAll({
                attributes: [['updatedAt', 't'], ['value', 'y']],
                where: {
                    sensor_id: sensor_id,
                    group_id: group_id,
                    basestation_id: basestation_id
                },
                include: [{
                    model: sensor,
                    as: 'sensor',
                    attributes: ['name']
                }],
                order: ['updatedAt']
            }).then(function(data: any) {
                if(!data) {
                    // console.log('no data');
                    resolve([]);
                }
                // console.log('found raw data: ' + raw_data.length + "lines");
                resolve(data);
            });
        })
    } 

    app.get("/graph",isLoggedIn, function(req: express.Request,res: express.Response){
        res.render("graph");
    });
    app.post("/graph/select",isLoggedIn, function(req: express.Request,res: express.Response){
        // res.render("graph");
        console.log(req.body);
        let time_view: string = req.body.time_view

        res.redirect('/graph/' + time_view);
    });

    app.get("/graph/hourly",isLoggedIn, function(req: express.Request,res: express.Response){
        query_data(models.raw_data, 1, 1, 1).then(function(data: any) {
            res.send({'data': data})
        });
    });

    app.get("/graph/daily",isLoggedIn, function(req: express.Request,res: express.Response){
        query_data(models.hourly_data, 1, 1, 1).then(function(data: any) {
            res.send({'data': data})
        });
    });

    app.get("/graph/monthly",isLoggedIn, function(req: express.Request,res: express.Response){
        query_data(models.daily_data, 1, 1, 1).then(function(data: any) {
            res.send({'data': data})
        });
    });

    app.get("/graph/yearly",isLoggedIn, function(req: express.Request,res: express.Response){
        query_data(models.monthly_data, 1, 1, 1).then(function(data: any) {
            res.send({'data': data})
        });
    });
    // ------------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------------
    // Configure Page
    app.get("/configure",isLoggedIn, function(req: express.Request,res: express.Response){
        res.render("configure");
    });
    // ------------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------------
    // Profile Page
    app.get("/myprofile",isLoggedIn, function(req: express.Request,res: express.Response){
        res.render("profile");
    });
    // ------------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------------
    // Login Page
    app.get('/login', function(req: express.Request, res: express.Response){
        res.render('login');
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/dashboard',
        failureRedirect: '/login'
    }));
    // ------------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------------
    // Registration Page
    app.get('/register', function(req: express.Request, res: express.Response){
        res.render('register');
    });

    app.post('/register', passport.authenticate('local-register', {
        successRedirect: '/dashboard',
        failureRedirect: '/register'
    }));
    // ------------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------------
    // Forgot Password Page
    app.get('/forgot_password', function(req: express.Request, res: express.Response){
        res.render('forgot_password');
    });
    // ------------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------------
    // Logout Function
    app.get("/logout", function(req: express.Request, res: express.Response){
        req.session.destroy(function(err) {
            res.redirect('/');
        })
    });
}