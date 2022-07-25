const db = require('../core/db');
const dateFormat = require('dateformat');
const { F_Select } = require('./MenuSetupModule');

const InsertCalender = async (data, filename) => {
    var res = '',
        sql = '',
        up_img = filename != undefined && filename != '' ? `, img_path = "${filename}"` : '';
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    // var chk_sql = `SELECT COUNT(id) as count_dt FROM td_calendar WHERE restaurant_id = ${data.res_id} AND event_date = "${data.event_date}"`;
    // var chk_dt = await F_Select(chk_sql);
    if (data.id > 0) {
        sql = `UPDATE td_calendar SET event_name="${data.event_name}", event_time="${data.event_time}", event_title="${data.event_title}", tkt_url="${data.tkt_url}", description="${data.description}" ${up_img}, user_type="${data.user_type}", approval_flag="${data.approval_flag}", modified_by="${data.user}", modified_dt="${datetime}"
        WHERE restaurant_id = ${data.res_id} AND event_date = "${data.event_date}" AND id = ${data.id}`;
    } else {
        sql = `INSERT INTO td_calendar (restaurant_id, event_date, event_name, event_time, event_title, tkt_url, description, img_path, user_type, approval_flag, created_by, created_dt)
        VALUES (${data.res_id}, "${data.event_date}", "${data.event_name}", "${data.event_time}", "${data.event_title}", "${data.tkt_url}", "${data.description}", "${filename}", "${data.user_type}", "${data.approval_flag}", "${data.user}", "${datetime}")`;
    }
    return new Promise((resolve, reject) => {
        db.query(sql, (error, insertId) => {
            if (error) {
                console.log(error);
                res = { suc: 0, msg: JSON.stringify(error) };
            } else {
                res = { suc: 1, msg: "Success !!" }
            }
            resolve(res);
        })
    })
}

const ApproveCal = (data) => {
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    let sql = `UPDATE td_calendar SET approval_flag="${data.approval_flag}", modified_by="${data.user}", modified_dt="${datetime}" WHERE id = ${data.id}`
    return new Promise((resolve, reject) => {
        db.query(sql, (error, insertId) => {
            if (error) {
                console.log(error);
                res = { suc: 0, msg: JSON.stringify(error) };
            } else {
                res = { suc: 1, msg: "Success !!" }
            }
            resolve(res);
        })
    })
}

module.exports = { InsertCalender, ApproveCal };