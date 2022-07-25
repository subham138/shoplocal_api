const db = require('../core/db');
const dateFormat = require('dateformat');
const { F_Select } = require('./MenuSetupModule');
const { PromoConfirmMail } = require('./EmailModule');

const IntroSave = async (data) => {
    var db_name = data.flag > 0 ? 'md_promotion_restaurant' : 'md_promotion_admin';
    var chk_whr = data.flag > 0 ? `WHERE restaurant_id = ${data.res_id}` : '';
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var chk_sql = `SELECT id, COUNT(id) as cunt_dt FROM ${db_name} ${chk_whr}`;
    var chk_dt = await F_Select(chk_sql);
    var whr = data.flag > 0 ? `WHERE restaurant_id = ${data.res_id}` : `WHERE id = ${chk_dt.msg[0].id}`,
        sql = '',
        fields = data.flag > 0 ? '(restaurant_id, intro, created_by, created_at)' : '(intro, created_by, created_at)',
        vals = data.flag > 0 ? `("${data.res_id}", "${data.intro}", "${data.user}", "${datetime}")` : `("${data.intro}", "${data.user}", "${datetime}")`;
    if (chk_dt.msg[0].cunt_dt > 0) {
        sql = `UPDATE ${db_name} SET intro = "${data.intro}", modified_by = "${data.user}", modified_at = "${datetime}" ${whr}`;
    } else {
        sql = `INSERT INTO ${db_name} ${fields} VALUES ${vals}`;
    }
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                res = { suc: 0, msg: JSON.stringify(err) };
            } else {
                res = { suc: 1, msg: 'Inserted Successfully !!' };
            }
            resolve(res);
        })
    })
}

const ConfEmailSave = async (data) => {
    var db_name = data.flag > 0 ? 'md_promotion_restaurant' : 'md_promotion_admin';
    var chk_whr = data.flag > 0 ? `WHERE restaurant_id = ${data.res_id}` : '';
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var chk_sql = `SELECT id, COUNT(id) as cunt_dt FROM ${db_name} ${chk_whr}`;
    var chk_dt = await F_Select(chk_sql);
    var whr = data.flag > 0 ? `WHERE restaurant_id = ${data.res_id}` : `WHERE id = ${chk_dt.msg[0].id}`,
        sql = '',
        fields = data.flag > 0 ? '(restaurant_id, confirm_email, created_by, created_at)' : '(confirm_email, created_by, created_at)',
        vals = data.flag > 0 ? `("${data.res_id}", "${data.conf_email}", "${data.user}", "${datetime}")` : `("${data.conf_email}", "${data.user}", "${datetime}")`;
    if (chk_dt.msg[0].cunt_dt > 0) {
        sql = `UPDATE ${db_name} SET confirm_email = "${data.conf_email}", modified_by = "${data.user}", modified_at = "${datetime}" ${whr}`;
    } else {
        sql = `INSERT INTO ${db_name} ${fields} VALUES ${vals}`;
    }
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                res = { suc: 0, msg: JSON.stringify(err) };
            } else {
                res = { suc: 1, msg: 'Inserted Successfully !!' };
            }
            resolve(res);
        })
    })
}

const PouUpSave = async (data) => {
    var db_name = data.flag > 0 ? 'md_promotion_restaurant' : 'md_promotion_admin';
    var chk_whr = data.flag > 0 ? `WHERE restaurant_id = ${data.res_id}` : '';
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var chk_sql = `SELECT id, COUNT(id) as cunt_dt FROM ${db_name} ${chk_whr}`;
    var chk_dt = await F_Select(chk_sql);
    var whr = data.flag > 0 ? `WHERE restaurant_id = ${data.res_id}` : `WHERE id = ${chk_dt.msg[0].id}`,
        sql = '',
        fields = data.flag > 0 ? '(restaurant_id, pop_up_offer_title, pop_up_offer_body, created_by, created_at)' : '(pop_up_offer_title, pop_up_offer_body, created_by, created_at)',
        vals = data.flag > 0 ? `("${data.pop_title}", "${data.pop_body}", "${data.conf_email}", "${data.user}", "${datetime}")` : `("${data.pop_title}", "${data.pop_body}", "${data.user}", "${datetime}")`;
    if (chk_dt.msg[0].cunt_dt > 0) {
        sql = `UPDATE ${db_name} SET pop_up_offer_title = "${data.pop_title}", pop_up_offer_body = "${data.pop_body}", modified_by = "${data.user}", modified_at = "${datetime}" ${whr}`;
    } else {
        sql = `INSERT INTO ${db_name} ${fields} VALUES ${vals}`;
    }
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                res = { suc: 0, msg: JSON.stringify(err) };
            } else {
                res = { suc: 1, msg: 'Inserted Successfully !!' };
            }
            resolve(res);
        })
    })
}

const QuestionSave = async (data) => {
    var db_name = data.flag > 0 ? 'md_promotion_restaurant' : 'md_promotion_admin';
    var chk_whr = data.flag > 0 ? `WHERE restaurant_id = ${data.res_id}` : '';
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var chk_sql = `SELECT id, COUNT(id) as cunt_dt FROM ${db_name} ${chk_whr}`;
    var chk_dt = await F_Select(chk_sql);
    var whr = data.flag > 0 ? `WHERE restaurant_id = ${data.res_id}` : `WHERE id = ${chk_dt.msg[0].id}`,
        sql = '',
        fields = data.flag > 0 ? '(restaurant_id, questions1, questions2, questions3, created_by, created_at)' : '(questions1, questions2, questions3, created_by, created_at)',
        vals = data.flag > 0 ? `("${data.res_id}", "${data.qn_1}", "${data.qn_2}", "${data.qn_3}", "${data.user}", "${datetime}")` : `("${data.qn_1}", "${data.qn_2}", "${data.qn_3}", "${data.user}", "${datetime}")`;
    if (chk_dt.msg[0].cunt_dt > 0) {
        sql = `UPDATE ${db_name} SET questions1 = "${data.qn_1}", questions2 = "${data.qn_2}", questions3 = "${data.qn_3}", modified_by = "${data.user}", modified_at = "${datetime}" ${whr}`;
    } else {
        sql = `INSERT INTO ${db_name} ${fields} VALUES ${vals}`;
    }
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                res = { suc: 0, msg: JSON.stringify(err) };
            } else {
                res = { suc: 1, msg: 'Inserted Successfully !!' };
            }
            resolve(res);
        })
    })
}

const MailingEmailSave = async (data) => {
    var db_name = data.flag > 0 ? 'md_promotion_restaurant' : 'md_promotion_admin';
    var chk_whr = data.flag > 0 ? `WHERE restaurant_id = ${data.res_id}` : '';
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var chk_sql = `SELECT id, COUNT(id) as cunt_dt FROM ${db_name} ${chk_whr}`;
    var chk_dt = await F_Select(chk_sql);
    var whr = data.flag > 0 ? `WHERE restaurant_id = ${data.res_id}` : `WHERE id = ${chk_dt.msg[0].id}`,
        sql = '',
        fields = data.flag > 0 ? '(restaurant_id, mailing_email_subject, mailing_email_body, created_by, created_at)' : '(mailing_email_subject, mailing_email_body, created_by, created_at)',
        vals = data.flag > 0 ? `("${data.res_id}", "${data.mail_email_sub}", "${data.mail_email_body}", "${data.user}", "${datetime}")` : `( "${data.mail_email_sub}", "${data.mail_email_body}", "${data.user}", "${datetime}")`;
    if (chk_dt.msg[0].cunt_dt > 0) {
        sql = `UPDATE ${db_name} SET mailing_email_subject = "${data.mail_email_sub}", mailing_email_body = "${data.mail_email_body}", modified_by = "${data.user}", modified_at = "${datetime}" ${whr}`;
    } else {
        sql = `INSERT INTO ${db_name} ${fields} VALUES ${vals}`;
    }
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                res = { suc: 0, msg: JSON.stringify(err) };
            } else {
                res = { suc: 1, msg: 'Inserted Successfully !!' };
            }
            resolve(res);
        })
    })
}

const PromoImgSave = async (data) => {
    var db_name = data.flag > 0 ? 'md_promotion_restaurant' : 'md_promotion_admin';
    var chk_whr = data.flag > 0 ? `WHERE restaurant_id = ${data.res_id}` : '';
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var chk_sql = `SELECT id, COUNT(id) as cunt_dt FROM ${db_name} ${chk_whr}`;
    var chk_dt = await F_Select(chk_sql);
    var whr = data.flag > 0 ? `WHERE restaurant_id = ${data.res_id}` : `WHERE id = ${chk_dt.msg[0].id}`,
        sql = '',
        fields = data.flag > 0 ? '(restaurant_id, image, created_by, created_at)' : '(image, created_by, created_at)',
        vals = data.flag > 0 ? `("${data.res_id}", "${data.img}", "${data.user}", "${datetime}")` : `( "${data.img}", "${data.user}", "${datetime}")`;
    if (chk_dt.msg[0].cunt_dt > 0) {
        sql = `UPDATE ${db_name} SET image = "${data.img}", modified_by = "${data.user}", modified_at = "${datetime}" ${whr}`;
    } else {
        sql = `INSERT INTO ${db_name} ${fields} VALUES ${vals}`;
    }
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                res = { suc: 0, msg: JSON.stringify(err) };
            } else {
                res = { suc: 1, msg: 'Inserted Successfully !!' };
            }
            resolve(res);
        })
    })
}

const StatusSave = async (data) => {
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var chk_sql = `SELECT id, COUNT(id) as cunt_dt FROM md_promotion_restaurant WHERE restaurant_id = ${data.res_id}`;
    var chk_dt = await F_Select(chk_sql);
    if (chk_dt.msg[0].cunt_dt > 0) {
        sql = `UPDATE md_promotion_restaurant SET menu_id = "${data.menu_id}", month_day = "${data.sec_id}", status_id = "${data.status}", modified_by = "${data.user}", modified_at = "${datetime}" WHERE restaurant_id = ${data.res_id}`;
    } else {
        sql = `INSERT INTO md_promotion_restaurant (restaurant_id, menu_id, month_day, status_id, created_by, created_at) VALUES ("${data.res_id}", "${data.menu_id}", "${data.sec_id}", "${data.status}", "${data.user}", "${datetime}")`;
    }
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                res = { suc: 0, msg: JSON.stringify(err) };
            } else {
                res = { suc: 1, msg: 'Inserted Successfully !!' };
            }
            resolve(res);
        })
    })
}

const PromoSave = async (data) => {
    let chk_sql = `SELECT * FROM td_promotions WHERE email = "${data.email}" AND restaurant_id = ${data.res_id}`;
    var chk_dt = await F_Select(chk_sql);
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
        sql = '',
        up_ani_col = data.anni_dt != '' ? `, anniversary_dt="${data.anni_dt}"` : '',
        up_bir_col = data.birth_dt ? `, birth_dt="${data.birth_dt}"` : '',
        in_ani_col = data.anni_dt != '' ? ', anniversary_dt' : '',
        in_ani_val = data.anni_dt != '' ? `, "${data.anni_dt}"` : '',
        in_bir_col = data.birth_dt ? `, birth_dt` : '',
        in_bir_val = data.birth_dt ? `, "${data.birth_dt}"` : '';
    if (chk_dt.msg.length > 0) {
        sql = `UPDATE td_promotions SET first_name="${data.f_name}",last_name="${data.l_name}" ${up_bir_col} ${up_ani_col},
        authorization="${data.auth}",mobile_no="${data.mob_no}",questions1="${data.q_1}",
        questions2="${data.q_2}",questions3="${data.q_3}",modified_by="${data.user}",modified_at="${datetime}"
        WHERE email = "${data.email}" AND restaurant_id = ${data.res_id}`;
    } else {
        sql = `INSERT INTO td_promotions (restaurant_id, first_name, last_name, email ${in_bir_col} ${in_ani_col}, authorization, mobile_no, questions1, questions2, questions3, created_by, created_at)
        VALUES ("${data.res_id}", "${data.f_name}", "${data.l_name}", "${data.email}" ${in_bir_val} ${in_ani_val}, "${data.auth}", "${data.mob_no}", "${data.q_1}", "${data.q_2}", "${data.q_3}", "${data.user}", "${datetime}")`;
    }
    return new Promise((resolve, reject) => {
        db.query(sql, async (err, lastId) => {
            if (err) {
                console.log(err);
                res = { suc: 0, msg: JSON.stringify(err) };
            } else {
                var name = data.f_name + ' ' + data.l_name;
                var promo_dt = await PromoConfirmMail(data.res_id, data.email, name);
                res = { suc: 1, msg: 'Inserted Successfully !!' };
            }
            resolve(res);
        })
    })
}

const OtherSave = async (data) => {
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var chk_sql = `SELECT id, COUNT(id) as cunt_dt FROM md_promotion_admin`;
    var chk_dt = await F_Select(chk_sql);
    var sql = '';
    if (chk_dt.msg[0].cunt_dt > 0) {
        sql = `UPDATE md_promotion_admin SET privacy = "${data.privacy}", authorization = "${data.auth}", back_color = "${data.back_color}", modified_by = "${data.user}", modified_at = "${datetime}" WHERE id = ${chk_dt.msg[0].id}`;
    } else {
        sql = `INSERT INTO md_promotion_admin (privacy, authorization, back_color, created_by, created_at)
        VALUES ("${data.privacy}", "${data.auth}", "${data.back_color}", "${data.user}", "${datetime}")`;
    }
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                res = { suc: 0, msg: JSON.stringify(err) };
            } else {
                res = { suc: 1, msg: 'Inserted Successfully !!' };
            }
            resolve(res);
        })
    })
}

module.exports = { IntroSave, ConfEmailSave, PouUpSave, QuestionSave, MailingEmailSave, PromoImgSave, StatusSave, PromoSave, OtherSave };