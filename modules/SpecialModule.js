const db = require('../core/db');
const dateFormat = require('dateformat');
const { F_Select, Check_Data } = require('./MenuSetupModule');

const SaveStockImg = (img_path, cat_id, id) => {
    var created = 'admin@gmail.com';
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    let sql = `INSERT INTO td_stock_image (img_catg, img_path, created_by, created_dt) 
    VALUES ("${cat_id}", "${img_path}", "${created}", "${datetime}")`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) };
            } else {
                data = { suc: 1, msg: "Inserted Successfully !!" };
            }
            resolve(data)
        })
    })
}

const DeleteStockImg = (id) => {
    let sql = `DELETE FROM td_stock_image WHERE id = "${id}"`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) };
            } else {
                data = { suc: 1, msg: "Deleted Successfully !!" };
            }
            resolve(data)
        })
    })
}

const SaveSpecialMenuImg = async (data, menu_img) => {
    // console.log({ menu_img, t: Array.isArray(menu_img) });
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = '';
    if (Array.isArray(menu_img)) {
        for (let i = 0; i < menu_img.length; i++) {
            let menu_data = await F_Select(`SELECT * FROM td_menu_image WHERE restaurant_id = "${data.restaurant_id}" AND menu_id = "${data.menu_id}" AND menu_img = "${menu_img[i].filename}"`);
            if (menu_data.msg.length < 1) {
                sql = `INSERT INTO td_menu_image (restaurant_id, menu_id, active_flag, menu_url, menu_img, created_by, created_dt) VALUES
            ("${data.restaurant_id}", "${data.menu_id}", "${data.break_check}", "${data.special_url}", "${menu_img[i].filename}", "${data.restaurant_id}", "${datetime}")`;
                console.log({ arr_sql: sql });
                db.query(sql, (err, lastId) => {
                    if (err) {
                        console.log(err);
                        res = false;
                    } else {
                        res = true;
                    }
                })
            }
        }
    } else {
        if (menu_img) {
            let menu_data = await F_Select(`SELECT * FROM td_menu_image WHERE restaurant_id = "${data.restaurant_id}" AND menu_id = "${data.menu_id}" AND menu_img = "${menu_img}"`);
            if (menu_data.msg.length < 1) {
                sql = `INSERT INTO td_menu_image (restaurant_id, menu_id, active_flag, menu_url, menu_img, created_by, created_dt) VALUES
     ("${data.restaurant_id}", "${data.menu_id}", "${data.break_check}", "${data.special_url}", "${menu_img}", "${data.restaurant_id}", "${datetime}")`;
                db.query(sql, (err, lastId) => {
                    if (err) {
                        console.log(err);
                        res = false;
                    } else {
                        res = true;
                    }
                })
            }
        } else {
            sql = `UPDATE td_menu_image SET active_flag = "${data.break_check}", menu_url = "${data.special_url}", modified_by = "${data.restaurant_id}", modified_dt = "${datetime}"
        WHERE restaurant_id = "${data.restaurant_id}" AND menu_id = "${data.menu_id}"`;
            db.query(sql, (err, lastId) => {
                if (err) {
                    console.log(err);
                    res = false;
                } else {
                    res = true;
                }
            })
        }
        console.log({ el_sql: sql });

    }
    var chk_dt = await Check_Data(db_name = 'td_menu_image', whr = `WHERE restaurant_id = "${data.restaurant_id}" AND menu_id = "${data.menu_id}"`);
    if (chk_dt > 1) {
        sql = `INSERT INTO td_menu_image (restaurant_id, menu_id, active_flag, menu_url, created_by, created_dt) VALUES
     ("${data.restaurant_id}", "${data.menu_id}", "${data.break_check}", "${data.special_url}", "${data.restaurant_id}", "${datetime}")`;
    } else {
        sql = `UPDATE td_menu_image SET active_flag = "${data.break_check}", menu_url = "${data.special_url}", modified_by = "${data.restaurant_id}", modified_dt = "${datetime}"
        WHERE restaurant_id = "${data.restaurant_id}" AND menu_id = "${data.menu_id}"`;
    }
    // sql = `UPDATE td_menu_image SET active_flag = "${data.break_check}", menu_url = "${data.special_url}", modified_by = "${data.restaurant_id}", modified_dt = "${datetime}"
    //     WHERE restaurant_id = "${data.restaurant_id}" AND menu_id = "${data.menu_id}"`;
    db.query(sql, (err, lastId) => {
        if (err) {
            console.log(err);
            res = false;
        } else {
            res = true;
        }
    })
}

const SpecialMonthDateSave = async (data) => {
    console.log(data);
    var sql = '',
        res = '';
    var delete_dt = await DeleteEveryDay(data.restaurant_id, data.menu_id);

    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var date_field = data.day_flag == 'E' ? 'month_day' : 'menu_date';
    return new Promise((resolve, reject) => {
        if (delete_dt) {
            if (data.day_flag != 'E') {
                data.reg_menu_id.forEach(dt => {
                    if (dt.menu_id > 0) {
                        sql = `INSERT INTO td_special_date_time (restaurant_id, menu_id, active_flag, regular_menu_flag, day_flag, ${date_field}, regular_menu_id, start_time, end_time, created_by, created_dt) VALUES
            ("${data.restaurant_id}", "${data.menu_id}", "${data.break_check}", "${data.regular_menu_flag}", "${data.day_flag}", "${data.menu_date}", "${dt.menu_id}", "${data.start_time}", "${data.end_time}", "${data.restaurant_id}", "${datetime}")`;
                        console.log(sql);
                        db.query(sql, (err, lastId) => {
                            if (err) {
                                console.log(err);
                                res = { suc: 0, msg: JSON.stringify(err) };
                            } else {
                                res = { suc: 1, msg: "Success" };
                            }
                            resolve(res)
                        })
                    }
                })
            } else {
                data.month_day.forEach(d => {
                    if (d.dt > 0) {
                        data.reg_menu_id.forEach(dt => {
                            if (dt.menu_id > 0) {
                                sql = `INSERT INTO td_special_date_time (restaurant_id, menu_id, active_flag, regular_menu_flag, day_flag, month_day, regular_menu_id, start_time, end_time, created_by, created_dt) VALUES
                    ("${data.restaurant_id}", "${data.menu_id}", "${data.break_check}", "${data.regular_menu_flag}", "${data.day_flag}", "${d.dt}", "${dt.menu_id}", "${data.start_time}", "${data.end_time}", "${data.restaurant_id}", "${datetime}")`;
                                console.log({ menu: sql });
                                db.query(sql, (err, lastId) => {
                                    if (err) {
                                        console.log(err);
                                        res = { suc: 0, msg: JSON.stringify(err) };
                                    } else {
                                        res = { suc: 1, msg: "Success" };
                                    }
                                    resolve(res)
                                })
                            }
                        })
                    }
                })

            }
        } else {
            res = { suc: 0, msg: "ERROR" };
            resolve(res);
        }

    })

}

const DeleteEveryDay = (res_id, menu_id) => {
    var res = false;
    var sql = `DELETE FROM td_special_date_time WHERE restaurant_id = "${res_id}" AND menu_id = "${menu_id}"`;
    console.log({ delete: sql });
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                res = false;
            } else {
                console.log("Deleted Date-Time");
                res = true;
            }
            resolve(res);
        })
    })
}

const SaveSpecialCatImg = async (data) => {
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = '',
        res = '',
        in_desc_val = data.menu_desc ? data.menu_desc : null,
        up_desc = data.menu_desc ? `, menu_desc = '${data.menu_desc}'` : '';
    var chk_sql = `SELECT count(id) chk_dt FROM td_special_data WHERE restaurant_id = "${data.restaurant_id}" AND menu_id = "${data.menu_id}"`;
    var chk_dt = await F_Select(chk_sql);
    if (chk_dt.msg[0].chk_dt > 0) {
        sql = `UPDATE td_special_data SET img_catg = "${data.img_catg}", img_path = "${data.img_path}" ${up_desc}, 
        modified_by = "${data.restaurant_id}", modified_dt = "${datetime}" WHERE restaurant_id = "${data.restaurant_id}" AND menu_id = "${data.menu_id}"`
    } else {
        sql = `INSERT INTO td_special_data (restaurant_id, menu_id, menu_desc, img_catg, img_path, created_by, created_dt) VALUES
        ("${data.restaurant_id}", "${data.menu_id}", "${in_desc_val}", "${data.img_catg}", "${data.img_path}", "${data.restaurant_id}", "${datetime}")`
    }
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                res = { suc: 0, msg: JSON.stringify(err) };
            } else {
                res = { suc: 1, msg: "Success" };
            }
            resolve(res)
        })
    })
}

const DeleteSpecialDatetime = (data) => {
    var v = '',
        v1 = '';
    for (let i = 0; i < data.month_day.length; i++) {
        if (data.month_day[i].dt > 0) {
            v = data.month_day[i].dt;
            if (v1 != '') {
                v1 = v + ',' + v1;
            } else {
                v1 = v;
            }
        }
    }
    var sql = `DELETE FROM td_special_date_time WHERE restaurant_id = "${data.restaurant_id}" AND menu_id = "${data.menu_id}" AND month_day NOT IN(${v1})`;
    db.query(sql, (err, lastId) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Deleted Date-Time");
        }
    })
}

module.exports = { SaveStockImg, DeleteStockImg, SaveSpecialMenuImg, SpecialMonthDateSave, SaveSpecialCatImg };