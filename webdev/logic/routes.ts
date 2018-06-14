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
    
    app.get("/graph",isLoggedIn, function(req: express.Request,res: express.Response){
        res.render("graph");
    });

    app.get("/graph/basestations",isLoggedIn, function(req: express.Request,res: express.Response){
        let session: Express.Session = req.session;
        
        //GET THE USERS STUFF - we will use this later, but for now we will just use user_id = 1
        // let user_id = session.passport.user
        // console.log(user_id);
        let user_id: number = 1;

         models.sequelize.query(
            ' SELECT b.id as id, b.name AS name, b.description as description' +
                ' FROM users AS u, basestations AS b' +
                ' WHERE u.id = ' + user_id + ';'
        ).then(function(data: any) {
            if(!data){
                res.send({'data': []});
            }
            else {
                res.send({'data': data[0]});
            }
        })
    });

    app.get("/graph/groups",isLoggedIn, function(req: express.Request,res: express.Response){
        let session: Express.Session = req.session;
        
        //GET THE USERS STUFF - we will use this later, but for now we will just use user_id = 1
        // let user_id = session.passport.user
        // console.log(user_id);
        let user_id: number = 1;

         models.sequelize.query(
            ' SELECT g.id AS id, g.name AS name, g.description as description, b.id AS basestation_id' +
                ' FROM users AS u, basestations AS b, groups AS g' +
                ' WHERE u.id = ' + user_id + ' AND b.id = g.basestation_id;'
        ).then(function(data: any) {
            if(!data){
                res.send({'data': []});
            }
            else {
                res.send({'data': data[0]});
            }
        })
    });
    function query_data(data_model: any, basestation_id: number, group_id: number,  start_date: string, end_date: string): any {
        // Helper function for graphing page
        if (group_id ==  null){
            return new Promise((resolve: any, reject: any) => {
                models.sequelize.query(
                    ' SELECT m.updatedAt AS t, m.value AS y, s.id as id, s.name as name, s.type as type' +
                    ' FROM ' + data_model + ' AS m, sensors  AS s' +
                    ' WHERE s.id = m.sensor_id AND m.basestation_id = ' + basestation_id + ' AND m.updatedAt >= ' + start_date + ' AND m.updatedAt < ' + end_date +
                    ' ORDER BY m.updatedAt;'
                ).then(function(data: any) {
                    if(!data) {
                        resolve([]);
                    }
                    console.log(data[0].length);
                    resolve(data[0]);
                });
            });
        }
        else {
          return new Promise((resolve: any, reject: any) => {
                models.sequelize.query(
                    ' SELECT m.updatedAt AS t, m.value AS y, s.id as id, s.name as name, s.type as type' +
                    ' FROM ' + data_model + ' AS m, sensors  AS s' +
                    ' WHERE s.id = m.sensor_id AND m.group_id = ' + group_id + ' AND m.basestation_id = ' + basestation_id + ' AND m.updatedAt >= ' + start_date + ' AND m.updatedAt <= ' + end_date +
                    ' ORDER BY m.updatedAt;'
                ).then(function(data: any) {
                    if(!data) {
                        resolve([]);
                    }
                    console.log(data.length);
                    resolve(data[0]);
                });
            });  
        }
    } 

    app.post('/graph/data', isLoggedIn, function(req: express.Request,res: express.Response){
        console.log(req.body);
        let time_unit = req.body.time_unit;
        let start = new Date(req.body.start_date).toISOString().slice(0, 19).replace('T', ' ');
        let end = new Date(req.body.end_date).toISOString().slice(0, 19).replace('T', ' ');

        let basestation_id = Number(req.body.b_id);
        let group_id = req.body.g_id;
        if(group_id === '' || group_id === 'None'){
            group_id = null;
        }
        else{
            group_id = Number(group_id);
        }

        if(req.body.time_unit === 'hourly') {
            let start_date = '"' + start + '"'
            let end_date = '"' + end + '"'

            query_data('raw_data', basestation_id, group_id, start_date, end_date).then(function(data: any) {
                res.send({'data': data})
            });
        }
        else if(req.body.time_unit === 'daily') {
            let start_date = '"' + start + '"'
            let end_date = '"' + end + '"'

            query_data('hourly_data', basestation_id, group_id, start_date, end_date).then(function(data: any) {
                res.send({'data': data})
            });
            
        }
        else if(req.body.time_unit === 'monthly') {
            let start_date = '"' + start + '"'
            let end_date = '"' + end + '"'

            query_data('daily_data', basestation_id, group_id, start_date, end_date).then(function(data: any) {
                res.send({'data': data})
            });
        }
        else if(req.body.time_unit === 'yearly') {
            let start_date = '"' + start + '"'
            let end_date = '"' + end + '"'

            query_data('monthly_data', basestation_id, group_id, start_date, end_date).then(function(data: any) {
                res.send({'data': data})
            });
        }

        else {
            res.send({'data': []})
        }
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