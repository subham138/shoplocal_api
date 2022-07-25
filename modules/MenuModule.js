const db = require('../core/db');
const { F_Select } = require('./MenuSetupModule');
var data = '';
const PreviewMenu = (res_id, st_time, end_time, menu_id, date, menu_date) => {
    var dat = {};
    var promo_sql = '',
        promo_dt = '';
    var whr_menu = menu_id > 0 ? `AND a.menu_id = "${menu_id}"` : '';
    var whr_dt = date > 0 ? `AND e.month_day = "${date}"` : '';
    let sec_sql = `SELECT a.id, a.section_id, c.section_img, c.restaurant_id, c.section_name, e.start_time, e.end_time
    FROM md_item_description a, md_section c, td_date_time e
    WHERE a.section_id = c.id
    AND a.menu_id=e.menu_id
    AND a.restaurant_id = "${res_id}"
    AND e.start_time >= '${st_time}'
    AND e.end_time <= '${end_time}' ${whr_menu} ${whr_dt}
    GROUP BY c.id
    ORDER BY c.id`;
    // console.log(sec_sql);
    return new Promise((resolve, reject) => {
        db.query(sec_sql, async (err, result) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) };
            } else {
                for (let i = 0; i < result.length; i++) {
                    var res = await GetDataRes(result[i].section_id, res_id, st_time, end_time, menu_id);
                    dat[result[i].section_name] = { res, sec_img: result[i].section_img };
                    // dat[result[i].section_name] = ;
                    // console.log(dat);
                }
                var promo_ckh = await CheckPromotion(res_id, menu_date, menu_id);
                if (promo_ckh == 'Y') {
                    promo_sql = `SELECT * FROM md_promotion_restaurant WHERE restaurant_id = ${res_id} AND status_id = '0'`;
                    var promo_data = await F_Select(promo_sql);
                    promo_dt = promo_data.msg[0];
                } else {
                    promo_dt = '';
                }
                // CHECK EVENT //
                var event_sql = `SELECT event_calendar FROM td_order_items WHERE restaurant_id = ${res_id}`;
                var event_dt = await F_Select(event_sql);
                var event_flag = event_dt.msg[0].event_calendar;
                data = { suc: 1, msg: 'Success', res: dat, promo_flag: promo_ckh, promo_dt, event_flag };
                // console.log({ dat });
            }
            // console.log(dat);
            resolve(data)
        })
    })

}

const GetDataRes = (sec_id, res_id, st_time, end_time, menu_id, date) => {
    var whr_menu = menu_id > 0 ? `AND a.menu_id = "${menu_id}"` : '';
    var whr_dt = date > 0 ? `AND e.month_day = "${date}"` : '';
    var sql = `SELECT a.id, a.section_id, b.item_name, a.item_price, a.item_desc, a.item_note, a.note_color, a.note_back_color, e.start_time, e.end_time
                FROM md_item_description a, md_items b, md_section c, md_menu d, td_date_time e
                WHERE a.item_id=b.id
                AND a.section_id = c.id
                AND a.menu_id = d.id
                AND a.menu_id=e.menu_id
                AND a.restaurant_id = "${res_id}"
                AND e.start_time <= '${st_time}'
                AND e.end_time >= '${end_time}'
                AND a.section_id = "${sec_id}" ${whr_menu} ${whr_dt}
                GROUP BY a.id
                ORDER BY a.section_id`;
    // console.log({ sql });
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            // dt[sec_name] = result;
            resolve(result);
            // dat[dt.section_name] = result;
            // console.log({ a1: dat });
        })
    })

}

const CheckMenu = (res_id, st_time, end_time, date, menu_id, flag) => {
    let menu_whr = menu_id ? `AND a.menu_id = "${menu_id}"` : '';
    let whr = date ? `AND e.month_day = "${date}"` : '';
    var chk_preview = flag > 0 ? true : false;
    var pre_whr = chk_preview ? `AND d.restaurant_id = 0` : '';
    var sql = `SELECT a.menu_id, d.menu_description, e.start_time, e.end_time
                FROM md_item_description a, md_menu d, td_date_time e
                WHERE a.menu_id = d.id
                AND a.menu_id=e.menu_id AND a.restaurant_id=e.restaurant_id
                AND a.restaurant_id = "${res_id}"
                AND e.start_time <= '${st_time}'
                AND e.end_time >= '${end_time}'
                ${pre_whr} ${whr} ${menu_whr}
                GROUP BY a.menu_id
                ORDER BY a.menu_id`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) };
            } else {
                data = { suc: 1, msg: result };
            }
            resolve(data);
        })
    })
}

const MenuData = (res_id, st_time, end_time, menu_id, date, greet, menu_active_flag, replace_menu_id, reg_menu_flag, sp_st_time, sp_end_time, more_menu_flag) => {
    var dat = {},
        sp_menu_sql = '',
        sp_menu = '',
        promo_sql = '',
        promo_dt = '';
    var whr_menu = menu_id > 0 ? `AND a.menu_id = "${menu_id}"` : '';
    var whr_dt = date > 0 ? `AND e.month_day = "${date}"` : '';
    let sec_sql = `SELECT a.id, a.menu_id, a.section_id, c.section_img, c.restaurant_id, c.section_name, e.start_time, e.end_time
    FROM md_item_description a, md_section c, md_menu d, td_date_time e
    WHERE a.section_id = c.id
    AND a.menu_id = d.id
    AND a.menu_id=e.menu_id
	AND a.restaurant_id=e.restaurant_id
    AND a.restaurant_id = "${res_id}"
    AND e.start_time <= '${st_time}'
    AND e.end_time >= '${end_time}' 
    AND d.restaurant_id = 0 ${whr_menu} ${whr_dt}
    GROUP BY c.id
    ORDER BY c.id`;
    return new Promise((resolve, reject) => {
        db.query(sec_sql, async (err, result) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) };
            } else {
                for (let i = 0; i < result.length; i++) {
                    var res = await GetDataRes(result[i].section_id, res_id, st_time, end_time, menu_id);
                    dat[result[i].section_name] = { res, sec_img: result[i].section_img };
                    // dat[result[i].section_name] = ;
                    // console.log(dat);
                }
                var menu_id = result.length > 0 ? result[0].menu_id : 0;
                // console.log(dat);
                let oth_sql = `SELECT a.* FROM td_other_image a, md_menu b WHERE a.menu_id=b.id AND a.restaurant_id = "${res_id}" AND a.menu_id = "${menu_id}" AND b.restaurant_id = 0`;
                let oth_data = await F_Select(oth_sql)
                let menu_check = await CheckMenu(res_id, st_time, end_time, date, null, 1);
                let cov_img = oth_data.msg.length > 0 ? oth_data.msg[0].cover_page_img : '',
                    top_img = oth_data.msg.length > 0 ? oth_data.msg[0].top_image_img : '';
                if (menu_active_flag != 'N') {
                    sp_menu_sql = `SELECT a.*, b.name as cat_name FROM td_special_data a, md_special_category b WHERE a.img_catg=b.id AND a.restaurant_id = "${res_id}" AND a.menu_id = 5`;
                    let sp_menu_dt = await F_Select(sp_menu_sql);
                    sp_menu = sp_menu_dt.msg[0];
                    if (reg_menu_flag != 'E') {
                        menu_check.msg.push({ menu_id: 5, menu_description: 'Special Menu', start_time: sp_st_time, end_time: sp_end_time })
                    }
                } else {
                    sp_menu = '';
                }
                var promo_ckh = await CheckPromotion(res_id, date, menu_id);
                if (promo_ckh == 'Y') {
                    promo_sql = `SELECT * FROM md_promotion_restaurant WHERE restaurant_id = ${res_id} AND status_id = '0'`;
                    var promo_data = await F_Select(promo_sql);
                    promo_dt = promo_data.msg[0];
                } else {
                    promo_dt = '';
                }
                // CHECK EVENT //
                var event_sql = `SELECT event_calendar FROM td_order_items WHERE restaurant_id = ${res_id}`;
                var event_dt = await F_Select(event_sql);
                var event_flag = event_dt.msg[0].event_calendar;
                // console.log(dat);
                // MORE MENU CHECK AND DATA //
                var more_menu_name = '';
                if (more_menu_flag != 'N') {
                    more_menu_name = await MoreMenuList(res_id, date, st_time);
                }
                // END //
                data = { suc: 1, msg: 'Success', res: dat, cov_img: cov_img, top_img: top_img, menu_check: menu_check.msg, len: sec_sql, dt: oth_data, greet: greet, menu_active_flag, reg_menu_flag, event_flag, sp_menu: sp_menu, promo_flag: promo_ckh, promo_dt, more_flag: more_menu_flag, more_menu: more_menu_name };
            }
            // console.log(dat);
            resolve(data)
        })
    })
}

const CheckPromotion = async (res_id, date, menu_id) => {
    var promo_flag = 'N';
    var chk_sql = `SELECT * FROM md_promotion_restaurant WHERE restaurant_id = ${res_id} AND status_id = '0'`;
    var chk_dt = await F_Select(chk_sql);

    if (chk_dt.msg.length > 0) {
        if (chk_dt.msg[0].menu_id == 0 && chk_dt.msg[0].month_day == 1) {
            promo_flag = 'Y';
        } else if (chk_dt.msg[0].menu_id == 0 && chk_dt.msg[0].month_day == date) {
            promo_flag = 'Y';
        } else if (chk_dt.msg[0].menu_id == menu_id && chk_dt.msg[0].month_day == 1) {
            promo_flag = 'Y';
        } else if (chk_dt.msg[0].menu_id == menu_id && chk_dt.msg[0].month_day == date) {
            promo_flag = 'Y';
        } else {
            promo_flag = 'N';
        }
    } else {
        promo_flag = 'N';
    }

    return new Promise((resolve, reject) => {
        resolve(promo_flag);
    })
}

const MoreMenuList = async (res_id, date, curr_time) => {
    var result = '';
    return new Promise(async (resolve, reject) => {
        var chk = `SELECT b.id menu_id, b.menu_description menu_name, a.start_time, a.end_time
            FROM td_date_time a, md_menu b
            WHERE a.menu_id=b.id
            AND a.restaurant_id = ${res_id}
            AND b.restaurant_id = ${res_id}
            AND a.month_day = ${date}
            AND a.start_time <= "${curr_time}"
            AND a.end_time >= "${curr_time}"`;
        // console.log(chk);
        var checking_dt = await F_Select(chk);
        if (checking_dt.msg.length > 0) {
            result = checking_dt.msg;
        } else {
            result = '';
        }
        // res.send(result);
        resolve(result);
    })
}

const AllMenu = (res_id) => {
    var dat = {},
        dt = {};
    let sec_sql = `SELECT a.id, a.section_id, c.section_img, c.restaurant_id, c.section_name, e.start_time, e.end_time, d.menu_description menu_name
        FROM md_item_description a, md_menu d, md_section c, td_date_time e
        WHERE a.section_id = c.id
        AND a.menu_id = d.id
        AND a.menu_id=e.menu_id
        AND a.restaurant_id = "${res_id}"
        GROUP BY c.id
        ORDER BY d.id, c.id`;
    // console.log(sec_sql);
    return new Promise((resolve, reject) => {
        db.query(sec_sql, async (err, result) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) };
            } else {
                for (let i = 0; i < result.length; i++) {
                    var res = await GetAllMenuItem(res_id, result[i].section_id);
                    dat[result[i].section_name] = { res, sec_img: result[i].section_img };
                    dt[result[i].menu_name] = dat;
                    // dat[result[i].section_name] = ;
                    // console.log(dat);
                }
                // console.log(dat);
                data = { suc: 1, msg: 'Success', res: dt };
                // console.log({ dat });
            }
            // console.log(dat);
            resolve(data)
        })
    })
}

const GetAllMenuItem = (res_id, sec_id) => {
    var sql = `SELECT a.id, a.section_id, b.item_name, a.item_price, a.item_desc, a.item_note, e.start_time, e.end_time, d.menu_description menu_name
                FROM md_item_description a, md_items b, md_section c, md_menu d, td_date_time e
                WHERE a.item_id=b.id
                AND a.section_id = c.id
                AND a.menu_id = d.id
                AND a.menu_id=e.menu_id
                AND a.restaurant_id = "${res_id}"
                AND a.section_id = "${sec_id}"
                GROUP BY a.id
                ORDER BY a.section_id`;
    // console.log({ sql });
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            resolve(result);
        })
    })
}

module.exports = { PreviewMenu, CheckMenu, MenuData, AllMenu };