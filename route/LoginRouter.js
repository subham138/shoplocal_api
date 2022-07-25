const express = require('express');
const { CheckData } = require('../modules/AdminModule');
const { Login, UpdateUser, UpdatePassword } = require('../modules/LoginModule');
const { F_Select } = require('../modules/MenuSetupModule');
const LogRouter = express.Router();

LogRouter.post('/login', async (req, res) => {
    var data = await Login(req.body);
    res.send(data);
})

LogRouter.get('/forgot_password', async (req, res) => {
    var data = '';
    var sql = `SELECT * FROM td_users WHERE email_id = "${req.query.Email}"`;
    var dt = await F_Select(sql);
    if (dt.msg.length > 0) {
        data = { suc: 1, msg: "Email Already Exist" };
    } else {
        data = { suc: 2, msg: "Fresh Email" };
    }
    res.send(data);
    // console.log(dt.msg.length);
})

LogRouter.get('/check_activity', async (req, res) => {
    let res_id = req.query.id;
    var sql = `SELECT approval_flag, url, image FROM md_url WHERE restaurant_id = ${res_id}`;
    var data = await F_Select(sql);
    res.send(data);
})

LogRouter.get('/check_menu_setup', async (req, res) => {
    let res_id = req.query.id;
    var sql = `SELECT a.restaurant_id, a.email_id, a.pwd, b.restaurant_name, b.contact_name, b.phone_no,
            (SELECT group_concat(DISTINCT c.menu_id separator ',') FROM td_other_image c WHERE a.restaurant_id=c.restaurant_id AND c.active_flag = 'Y' GROUP BY a.restaurant_id) as menu,
            (SELECT e.no_of_menu FROM td_order_items d JOIN md_package e ON d.package_id=e.pakage_name WHERE a.restaurant_id=d.restaurant_id GROUP BY a.restaurant_id) as menu_name
            FROM td_users a, td_contacts b
            WHERE a.restaurant_id=b.id AND a.restaurant_id = "${res_id}"`;
    var data = await F_Select(sql);
    res.send(data);
})

LogRouter.get('/check_active_status', async (req, res) => {
    var res_id = req.query.id;
    let sql = `SELECT * FROM md_url WHERE restaurant_id = ${res_id}`;
    var data = await F_Select(sql);
    res.send(data);
})

LogRouter.post('/update_user', async (req, res) => {
    var data = req.body;
    var dt = await UpdateUser(data);
    res.send(dt);
})

LogRouter.post('/update_password', async (req, res) => {
    var data = req.body;
    var dt = await UpdatePassword(data);
    res.send(dt);
})

module.exports = { LogRouter };