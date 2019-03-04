"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}
function routes_module(app, passport, models) {
    let user_id = 1;
    app.get("/", function (req, res) {
        res.redirect('/login');
    });
    app.get("/dashboard", isLoggedIn, function (req, res) {
        res.render("dashboard");
    });
    app.get("/graph", isLoggedIn, function (req, res) {
        res.render("graph");
    });
    app.get("/graph/basestations", isLoggedIn, function (req, res) {
        let session = req.session;
        models.sequelize.query(' SELECT b.id as id, b.name AS name, b.description as description' +
            ' FROM users AS u, basestations AS b' +
            ' WHERE u.id = ' + user_id + ';').then(function (data) {
            if (!data) {
                res.send({ 'data': [] });
            }
            else {
                res.send({ 'data': data[0] });
            }
        });
    });
    app.get("/graph/groups", isLoggedIn, function (req, res) {
        let session = req.session;
        models.sequelize.query(' SELECT g.id AS id, g.name AS name, g.description as description, b.id AS basestation_id' +
            ' FROM users AS u, basestations AS b, groups AS g' +
            ' WHERE u.id = ' + user_id + ' AND b.id = g.basestation_id AND g.archived = FALSE;').then(function (data) {
            if (!data) {
                res.send({ 'data': [] });
            }
            else {
                res.send({ 'data': data[0] });
            }
        });
    });
    function query_data(data_model, basestation_id, group_id, start_date, end_date) {
        if (group_id == null) {
            return new Promise((resolve, reject) => {
                models.sequelize.query(' SELECT m.updatedAt AS t, m.value AS y, s.id as id, s.name as name, s.type as type' +
                    ' FROM ' + data_model + ' AS m, sensors  AS s' +
                    ' WHERE s.id = m.sensor_id AND m.basestation_id = ' + basestation_id + ' AND m.updatedAt >= ' + start_date + ' AND m.updatedAt < ' + end_date +
                    ' ORDER BY m.updatedAt;').then(function (data) {
                    if (!data) {
                        resolve([]);
                    }
                    console.log(data[0].length);
                    resolve(data[0]);
                });
            });
        }
        else {
            return new Promise((resolve, reject) => {
                models.sequelize.query(' SELECT m.updatedAt AS t, m.value AS y, s.id as id, s.name as name, s.type as type' +
                    ' FROM ' + data_model + ' AS m, sensors  AS s' +
                    ' WHERE s.id = m.sensor_id AND m.group_id = ' + group_id + ' AND m.basestation_id = ' + basestation_id + ' AND m.updatedAt >= ' + start_date + ' AND m.updatedAt <= ' + end_date +
                    ' ORDER BY m.updatedAt;').then(function (data) {
                    if (!data) {
                        resolve([]);
                    }
                    console.log(data.length);
                    resolve(data[0]);
                });
            });
        }
    }
    app.post('/graph/data', isLoggedIn, function (req, res) {
        console.log(req.body);
        let time_unit = req.body.time_unit;
        let start = new Date(req.body.start_date).toISOString().slice(0, 19).replace('T', ' ');
        let end = new Date(req.body.end_date).toISOString().slice(0, 19).replace('T', ' ');
        let start_date = '"' + start + '"';
        let end_date = '"' + end + '"';
        let basestation_id = Number(req.body.b_id);
        let group_id = req.body.g_id;
        if (group_id === '' || group_id === 'None') {
            group_id = null;
        }
        else {
            group_id = Number(group_id);
        }
        if (req.body.time_unit === 'hourly') {
            query_data('raw_data', basestation_id, group_id, start_date, end_date).then(function (data) {
                res.send({ 'data': data });
            });
        }
        else if (req.body.time_unit === 'daily') {
            query_data('hourly_data', basestation_id, group_id, start_date, end_date).then(function (data) {
                res.send({ 'data': data });
            });
        }
        else if (req.body.time_unit === 'monthly') {
            query_data('daily_data', basestation_id, group_id, start_date, end_date).then(function (data) {
                res.send({ 'data': data });
            });
        }
        else if (req.body.time_unit === 'yearly') {
            query_data('monthly_data', basestation_id, group_id, start_date, end_date).then(function (data) {
                res.send({ 'data': data });
            });
        }
        else {
            res.send({ 'data': [] });
        }
    });
    app.post("/graph/notes", isLoggedIn, function (req, res) {
        let session = req.session;
        console.log(req.body);
        let time_unit = req.body.time_unit;
        let start = new Date(req.body.start_date).toISOString().slice(0, 19).replace('T', ' ');
        let end = new Date(req.body.end_date).toISOString().slice(0, 19).replace('T', ' ');
        let start_date = '"' + start + '"';
        let end_date = '"' + end + '"';
        let basestation_id = Number(req.body.b_id);
        let group_id = req.body.g_id;
        if (group_id === '' || group_id === 'None') {
            group_id = null;
        }
        else {
            group_id = Number(group_id);
        }
        if (group_id == null) {
            models.sequelize.query(' SELECT n.updatedAt AS t, n.text AS y, s.id as id, s.name as name, s.type as type' +
                ' FROM notes AS n, sensors  AS s' +
                ' WHERE s.id = n.sensor_id AND n.basestation_id = ' + basestation_id + ' AND n.updatedAt >= ' + start_date + ' AND n.updatedAt < ' + end_date +
                ' ORDER BY n.updatedAt;').then(function (data) {
                if (!data) {
                    res.send({ 'data': [] });
                }
                else {
                    res.send({ 'data': data[0] });
                }
            });
        }
        else {
            models.sequelize.query(' SELECT n.updatedAt AS t, n.text AS y, s.id as id, s.name as name, s.type as type' +
                ' FROM notes AS n, sensors  AS s' +
                ' WHERE s.id = n.sensor_id AND n.group_id = ' + group_id + ' AND n.basestation_id = ' + basestation_id + ' AND n.updatedAt >= ' + start_date + ' AND n.updatedAt < ' + end_date +
                ' ORDER BY n.updatedAt;').then(function (data) {
                if (!data) {
                    res.send({ 'data': [] });
                }
                else {
                    res.send({ 'data': data[0] });
                }
            });
        }
    });
    app.get("/log", isLoggedIn, function (req, res) {
        res.render("log");
    });
    app.get("/log/notes", isLoggedIn, function (req, res) {
        let session = req.session;
        console.log(req.body);
        models.sequelize.query(' SELECT n.updatedAt AS date, n.text AS text, n.id AS id, n.basestation_id AS bid, n.group_id AS gid, n.sensor_id AS sid' +
            ' FROM notes AS n, basestations  AS b, users AS u' +
            ' WHERE n.basestation_id = b.id AND b.user_id = u.id AND u.id = ' + user_id +
            ' ORDER BY n.updatedAt;').then(function (data) {
            if (!data) {
                res.send({ 'data': [] });
            }
            else {
                res.send({ 'data': data[0] });
            }
        });
    });
    app.post('/log/addNote', isLoggedIn, function (req, res) {
        console.log(req.body);
        if (req.body && req.body.text && req.body.bid && req.body.gid) {
            let text = req.body.text;
            let bid = req.body.bid;
            let gid = req.body.gid;
            models.sequelize.query(' INSERT INTO notes' +
                ' VALUES(NULL, "' + text + '", NOW(), NOW(), NULL, ' + gid + ', ' + bid + ');').then(function () {
                res.send({ 'data': 'updated' });
            });
        }
    });
    app.get("/basestations", isLoggedIn, function (req, res) {
        res.render("config_basestations");
    });
    app.get("/configure/basestations", isLoggedIn, function (req, res) {
        let session = req.session;
        models.sequelize.query(' SELECT b.id as id, b.name AS name, b.description as description' +
            ' FROM users AS u, basestations AS b' +
            ' WHERE b.user_id = u.id AND u.id = ' + user_id + ';').then(function (data) {
            if (!data) {
                res.send({ 'data': [] });
            }
            else {
                res.send({ 'data': data[0] });
            }
        });
    });
    app.get("/configure/groups", isLoggedIn, function (req, res) {
        let session = req.session;
        let user_id = 1;
        models.sequelize.query(' SELECT g.id AS id, g.name AS name, g.description as description, b.id AS basestation_id' +
            ' FROM users AS u, basestations AS b, groups AS g' +
            ' WHERE b.user_id = u.id AND u.id = ' + user_id + ' AND b.id = g.basestation_id AND archived = FALSE;').then(function (data) {
            if (!data) {
                res.send({ 'data': [] });
            }
            else {
                res.send({ 'data': data[0] });
            }
        });
    });
    app.get("/configure/sensors", isLoggedIn, function (req, res) {
        let session = req.session;
        let user_id = 1;
        models.sequelize.query(' SELECT s.id AS id, s.name AS name, s.description as description, s.type as type, g.id as group_id, b.id AS basestation_id' +
            ' FROM users AS u, basestations AS b, groups AS g, sensors AS s' +
            ' WHERE b.user_id = u.id AND u.id = ' + user_id + ' AND b.id = g.basestation_id AND g.id = s.group_id;').then(function (data) {
            if (!data) {
                res.send({ 'data': [] });
            }
            else {
                res.send({ 'data': data[0] });
            }
        });
    });
    app.post("/basestations/updateName", isLoggedIn, function (req, res) {
        console.log(req.body);
        if (req.body && req.body.id && req.body.name) {
            let name = req.body.name;
            let id = req.body.id;
            models.sequelize.query(' UPDATE basestations' +
                ' SET name = "' + name + '", updatedAt = NOW()' +
                ' WHERE id = ' + id + ';').then(function () {
                res.send({ 'data': 'updated' });
            });
        }
    });
    app.post("/basestations/updateDescription", isLoggedIn, function (req, res) {
        console.log(req.body);
        if (req.body && req.body.id && req.body.description) {
            let description = req.body.description;
            let id = req.body.id;
            models.sequelize.query(' UPDATE basestations' +
                ' SET description = "' + description + '",  updatedAt = NOW()' +
                ' WHERE id = ' + id + ';').then(function () {
                res.send({ 'data': 'updated' });
            });
        }
    });
    app.get("/groups", isLoggedIn, function (req, res) {
        res.render("config_groups");
    });
    app.post("/groups/updateName", isLoggedIn, function (req, res) {
        console.log(req.body);
        if (req.body && req.body.id && req.body.name) {
            let name = req.body.name;
            let id = req.body.id;
            models.sequelize.query(' UPDATE groups' +
                ' SET name = "' + name + '", updatedAt = NOW()' +
                ' WHERE id = ' + id + ';').then(function () {
                res.send({ 'data': 'updated' });
            });
        }
    });
    app.post("/groups/updateDescription", isLoggedIn, function (req, res) {
        console.log(req.body);
        if (req.body && req.body.id && req.body.description) {
            let description = req.body.description;
            let id = req.body.id;
            models.sequelize.query(' UPDATE groups' +
                ' SET description = "' + description + '",  updatedAt = NOW()' +
                ' WHERE id = ' + id + ';').then(function () {
                res.send({ 'data': 'updated' });
            });
        }
    });
    app.post("/groups/addGroup", isLoggedIn, function (req, res) {
        console.log(req.body);
        if (req.body && req.body.name && req.body.description && req.body.bid) {
            let name = req.body.name;
            let description = req.body.description;
            let bid = Number(req.body.bid);
            models.sequelize.query(' INSERT INTO groups' +
                ' VALUES(NULL, "' + name + '","' + description + '", FALSE, NOW(), NOW(), ' + bid + ');').then(function () {
                res.send({ 'data': 'updated' });
            });
        }
    });
    app.post("/groups/deleteGroup", isLoggedIn, function (req, res) {
        console.log(req.body);
        if (req.body && req.body.id) {
            let id = Number(req.body.id);
            models.sequelize.query(' UPDATE groups' +
                ' SET archived = TRUE,  updatedAt = NOW()' +
                ' WHERE id = ' + id + ';').then(function () {
                res.send({ 'data': 'deleted' });
            });
        }
    });
    app.get("/sensors", isLoggedIn, function (req, res) {
        res.render("config_sensors");
    });
    app.post("/sensors/updateName", isLoggedIn, function (req, res) {
        console.log(req.body);
        if (req.body && req.body.id && req.body.name) {
            let name = req.body.name;
            let id = req.body.id;
            models.sequelize.query(' UPDATE sensors' +
                ' SET name = "' + name + '", updatedAt = NOW()' +
                ' WHERE id = ' + id + ';').then(function () {
                res.send({ 'data': 'updated' });
            });
        }
    });
    app.post("/sensors/updateDescription", isLoggedIn, function (req, res) {
        console.log(req.body);
        if (req.body && req.body.id && req.body.description) {
            let description = req.body.description;
            let id = req.body.id;
            models.sequelize.query(' UPDATE sensors' +
                ' SET description = "' + description + '",  updatedAt = NOW()' +
                ' WHERE id = ' + id + ';').then(function () {
                res.send({ 'data': 'updated' });
            });
        }
    });
    app.post("/sensors/updateGroup", isLoggedIn, function (req, res) {
        console.log(req.body);
        if (req.body && req.body.id && req.body.group_id) {
            let group_id = req.body.group_id;
            let id = req.body.id;
            models.sequelize.query(' UPDATE sensors' +
                ' SET group_id = "' + Number(group_id) + '",  updatedAt = NOW()' +
                ' WHERE id = ' + id + ';').then(function () {
                res.send({ 'data': 'updated' });
            });
        }
    });
    app.get("/myprofile", isLoggedIn, function (req, res) {
        res.render("profile");
    });
    app.post("/myprofile", isLoggedIn, function (req, res) {
        console.log(req.body);
        if (req.body && req.body.profile_user_id && req.body.profile_first_name && req.body.profile_last_name && req.body.profile_email && req.body.profile_phone) {
            let id = Number(req.body.profile_user_id);
            let fn = req.body.profile_first_name;
            let ln = req.body.profile_last_name;
            let email = req.body.profile_email;
            let phone = req.body.profile_phone;
            models.sequelize.query(' UPDATE users' +
                ' SET first_name = "' + fn + '", last_name = "' + ln + '", email = "' + email + '", phone = "' + phone + '"' +
                ' WHERE id = ' + id + ';').then(function () {
                res.redirect('/myprofile');
            });
        }
    });
    app.get('/login', function (req, res) {
        res.render('login');
    });
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/dashboard',
        failureRedirect: '/login'
    }));
    app.get('/register', function (req, res) {
        res.render('register');
    });
    app.post('/register', passport.authenticate('local-register', {
        successRedirect: '/dashboard',
        failureRedirect: '/register'
    }));
    app.get('/forgot_password', function (req, res) {
        res.render('forgot_password');
    });
    app.get("/logout", function (req, res) {
        req.session.destroy(function (err) {
            res.redirect('/');
        });
    });
}
exports.default = routes_module;
