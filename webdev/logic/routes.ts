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
    app.get("/basestations",isLoggedIn, function(req: express.Request,res: express.Response){
        res.render("config_basestations");
    });

    app.get("/configure/basestations",isLoggedIn, function(req: express.Request,res: express.Response){
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

    app.get("/configure/groups",isLoggedIn, function(req: express.Request,res: express.Response){
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
    app.get("/configure/sensors",isLoggedIn, function(req: express.Request,res: express.Response){
        let session: Express.Session = req.session;
        
        //GET THE USERS STUFF - we will use this later, but for now we will just use user_id = 1
        // let user_id = session.passport.user
        // console.log(user_id);
        let user_id: number = 1;

        models.sequelize.query(
            ' SELECT s.id AS id, s.name AS name, s.description as description, s.type as type, g.id as group_id, b.id AS basestation_id' +
                ' FROM users AS u, basestations AS b, groups AS g, sensors AS s' +
                ' WHERE u.id = ' + user_id + ' AND b.id = g.basestation_id AND g.id = s.group_id;'
        ).then(function(data: any) {
            if(!data){
                res.send({'data': []});
            }
            else {
                res.send({'data': data[0]});
            }
        })
    });

    app.post("/basestations/updateName",isLoggedIn, function(req: express.Request,res: express.Response){
        console.log(req.body);
        if(req.body && req.body.id && req.body.name) {
            let name = req.body.name;
            let id = req.body.id;
            models.sequelize.query(
                ' UPDATE basestations' +
                    ' SET name = "' + name + '", updatedAt = NOW()' +
                    ' WHERE id = ' + id + ';'
            ).then(function() {
                res.send({'data': 'updated'});
            });
        }
    });
    app.post("/basestations/updateDescription",isLoggedIn, function(req: express.Request,res: express.Response){
        console.log(req.body);
        if(req.body && req.body.id && req.body.description) {
            let description = req.body.description;
            let id = req.body.id;
            models.sequelize.query(
                ' UPDATE basestations' +
                    ' SET description = "' + description + '",  updatedAt = NOW()' +
                    ' WHERE id = ' + id + ';'
            ).then(function() {
                res.send({'data': 'updated'});
            });
        }
    });

    // ------------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------------
    app.get("/groups",isLoggedIn, function(req: express.Request,res: express.Response){
        res.render("config_groups");
    });

    app.post("/groups/updateName",isLoggedIn, function(req: express.Request,res: express.Response){
        console.log(req.body);
        if(req.body && req.body.id && req.body.name) {
            let name = req.body.name;
            let id = req.body.id;
            models.sequelize.query(
                ' UPDATE groups' +
                    ' SET name = "' + name + '", updatedAt = NOW()' +
                    ' WHERE id = ' + id + ';'
            ).then(function() {
                res.send({'data': 'updated'});
            });
        }
    });
    app.post("/groups/updateDescription",isLoggedIn, function(req: express.Request,res: express.Response){
        console.log(req.body);
        if(req.body && req.body.id && req.body.description) {
            let description = req.body.description;
            let id = req.body.id;
            models.sequelize.query(
                ' UPDATE groups' +
                    ' SET description = "' + description + '",  updatedAt = NOW()' +
                    ' WHERE id = ' + id + ';'
            ).then(function() {
                res.send({'data': 'updated'});
            });
        }
    });

    app.post("/groups/addGroup",isLoggedIn, function(req: express.Request,res: express.Response){
        console.log(req.body);
        if(req.body && req.body.name && req.body.description && req.body.bid) {
            let name = req.body.name;
            let description = req.body.description;
            let bid: number = Number(req.body.bid);
            models.sequelize.query(
                ' INSERT INTO groups' +
                    ' VALUES(NULL, "' + name + '","' + description + '", NOW(), NOW(), ' + bid + ');'
            ).then(function() {
                res.send({'data': 'updated'});
            });
        }
    });

    // ------------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------------
    app.get("/sensors",isLoggedIn, function(req: express.Request,res: express.Response){
        res.render("config_sensors");
    });

    app.post("/sensors/updateName",isLoggedIn, function(req: express.Request,res: express.Response){
        console.log(req.body);
        if(req.body && req.body.id && req.body.name) {
            let name = req.body.name;
            let id = req.body.id;
            models.sequelize.query(
                ' UPDATE sensors' +
                    ' SET name = "' + name + '", updatedAt = NOW()' +
                    ' WHERE id = ' + id + ';'
            ).then(function() {
                res.send({'data': 'updated'});
            });
        }
    });
    app.post("/sensors/updateDescription",isLoggedIn, function(req: express.Request,res: express.Response){
        console.log(req.body);
        if(req.body && req.body.id && req.body.description) {
            let description = req.body.description;
            let id = req.body.id;
            models.sequelize.query(
                ' UPDATE sensors' +
                    ' SET description = "' + description + '",  updatedAt = NOW()' +
                    ' WHERE id = ' + id + ';'
            ).then(function() {
                res.send({'data': 'updated'});
            });
        }
    });

    app.post("/sensors/updateGroup",isLoggedIn, function(req: express.Request,res: express.Response){
        console.log(req.body);
        if(req.body && req.body.id && req.body.group_id) {
            let group_id = req.body.group_id;
            let id = req.body.id;
            models.sequelize.query(
                ' UPDATE sensors' +
                    ' SET group_id = "' + Number(group_id) + '",  updatedAt = NOW()' +
                    ' WHERE id = ' + id + ';'
            ).then(function() {
                res.send({'data': 'updated'});
            });
        }
    });

    // ------------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------------
    // Profile Page
    app.get("/myprofile",isLoggedIn, function(req: express.Request,res: express.Response){
        res.render("profile");
    });

    app.post("/myprofile",isLoggedIn, function(req: express.Request,res: express.Response){
        console.log(req.body);
        if(req.body && req.body.profile_user_id && req.body.profile_first_name && req.body.profile_last_name && req.body.profile_email && req.body.profile_phone) {
            let id: number = Number(req.body.profile_user_id);
            let fn: string = req.body.profile_first_name;
            let ln: string = req.body.profile_last_name;
            let email: string = req.body.profile_email;
            let phone: string = req.body.profile_phone;
            models.sequelize.query(
                ' UPDATE users' +
                    ' SET first_name = "' + fn + '", last_name = "' + ln + '", email = "' + email + '", phone = "' + phone + '"' +
                    ' WHERE id = ' + id + ';'
            ).then(function() {
                res.redirect('/myprofile');  
            });
        }
        
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