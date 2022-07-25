const express = require('express');
const { InsertCalender, ApproveCal } = require('../modules/CalenderModule');
const { F_Select } = require('../modules/MenuSetupModule');
const CalenderRouter = express.Router();

CalenderRouter.get('/calender_dtls', async (req, res) => {
    var res_id = req.query.id,
        sql = '',
        data = '',
        flag = req.query.flag;
    if (flag == 1) {
        sql = `SELECT * FROM td_calendar WHERE restaurant_id = ${res_id} AND approval_flag = 'Y' AND user_type IN('R', 'A')`;
    } else if (flag == 0) {
        sql = `SELECT * FROM td_calendar WHERE restaurant_id = ${res_id} AND user_type IN('U')`;
    } else {
        sql = `SELECT * FROM td_calendar WHERE restaurant_id = ${res_id} AND approval_flag = 'Y' AND user_type IN('R', 'A', 'U')`;
    }
    data = await F_Select(sql);
    res.send(data);
})

CalenderRouter.get('/get_cal', async (req, res) => {
    var id = req.query.id,
        whr = id > 0 ? `WHERE id = ${id}` : '';
    var sql = `SELECT * FROM td_calendar ${whr}`;
    var data = await F_Select(sql);
    res.send(data);
})

CalenderRouter.get('/check_calender', async (req, res) => {
    var res_id = req.query.id;
    let sql = `SELECT restaurant_id, event_calendar FROM td_order_items WHERE  restaurant_id = ${res_id}`;
    var data = await F_Select(sql);
    res.send(data);
})

CalenderRouter.get('/get_res_dtls', async (req, res) => {
    var res_id = req.query.id;
    let whr = res_id > 0 ? `AND a.id = "${res_id}"` : '';
    let sql = `SELECT a.*, c.setup_fee, c.monthly_fee FROM td_contacts a
                JOIN td_order_items b ON a.id=b.restaurant_id
                JOIN md_package c ON b.package_id=c.pakage_name
                WHERE b.event_calendar = 'Y' ${whr}`;
    var data = await F_Select(sql);
    res.send(data);
})

CalenderRouter.post('/approve_cal', async (req, res) => {
    var data = req.body;
    var dt = await ApproveCal(data);
    res.send(dt);
})

// CalenderRouter.post('/calender_dtls', async (req, res) => {
//     var data = req.body;
//     var dt = await InsertCalender(data);
//     res.send(dt);
// })

module.exports = { CalenderRouter }