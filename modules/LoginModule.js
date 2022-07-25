const db = require('../core/db');
const dateFormat = require('dateformat');
const bcrypt = require('bcrypt');
const { F_Select } = require('./MenuSetupModule');
var data = '';

const Login = async (data) => {
    // console.log(data);
    var sql = `SELECT * FROM td_users WHERE email_id = "${data.uname}" AND active_flag = "Y"`;
    return new Promise((resolve, reject) => {
        db.query(sql, async (err, result) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: 'Something Went Wrong' };
            }
            if (result.length > 0) {
                if (await bcrypt.compare(data.psw, result[0].pwd)) {
                    await UpdateLoginTime(email = data.uname);
                    if (result[0].last_login_dt) {
                        data = { suc: 1, msg: result[0] };
                    } else {
                        data = { suc: 2, msg: result[0] };
                    }
                } else {
                    data = { suc: 0, msg: 'Please Check Your User ID Or Password' }
                }
            } else {
                data = { suc: 0, msg: 'User Is Deactivated Or No Data Found' };
            }
            resolve(data);
        })
    })
}

const UpdateLoginTime = (email_id) => {
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = `UPDATE td_users SET last_login_dt = "${datetime}" WHERE email_id = "${email_id}"`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                data = false;
            }
            else {
                data = true;
            }
            resolve(data);
        })
    })
}

const UpdateUser = (data) => {
    var res = '';
    var add2_vl = data.Address2 != '' ? `, addr_line2 = "${data.Address2}"` : '';
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = `UPDATE td_contacts SET restaurant_name = "${data.Name}", contact_name = "${data.Contact}", phone_no = "${data.Telephone}",
    email = "${data.Email}", addr_line1 = "${data.Address1}" ${add2_vl}, city = "${data.cityState}", zip = "${data.zip}", 
    website = "${data.Website}", modified_by = "${data.Email}", modified_dt = "${datetime}" WHERE id = ${data.res_id}`
    // var sql = `INSERT INTO td_contacts (contact_date, restaurant_name, contact_name, phone_no, email, addr_line1 ${add2_fl}, city, zip, country, time_zone, website, created_by, created_at) 
    // VALUES ("${datetime}","${data.Name}", "${data.Contact}","${data.Telephone}","${data.Email}","${data.Address1}" ${add2_vl}, "${data.cityState}","${data.zip}","${data.country}", "${data.time_zone}", "${data.Website}", "${data.Email}", "${datetime}")`;
    return new Promise((resolve, reject) => {
        db.query(sql, async (err, result) => {
            if (err) {
                console.log(err);
                res = { suc: 0, msg: JSON.stringify(err) };
            }
            else {
                res = { suc: 1, msg: 'Successfully Updated !!' };
            }
            resolve(res);
        })
    })
}

const UpdatePassword = async (data) => {
    let chk_sql = `SELECT * FROM td_users WHERE restaurant_id = ${data.res_id}`;
    var chk_dt = await F_Select(chk_sql);
    var res = '';
    var pwd = bcrypt.hashSync(data.psw, 10),
        sql = `UPDATE td_users SET pwd = "${pwd}" WHERE restaurant_id = ${data.res_id}`;
    return new Promise(async (resolve, reject) => {
        if (await bcrypt.compare(data.old_psw, chk_dt.msg[0].pwd)) {
            db.query(sql, (err, lastId) => {
                if (err) {
                    console.log(err);
                    res = { suc: 0, msg: JSON.stringify(err) };
                }
                else {
                    res = { suc: 1, msg: 'Successfully Updated !!' };
                }
                resolve(res);
            })
        } else {
            res = { suc: 0, msg: "Wrong Old Password" };
            resolve(res);
        }
    })
}

module.exports = { Login, UpdateUser, UpdatePassword }