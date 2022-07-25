const db = require('../core/db');
const dateFormat = require('dateformat');
const { F_Select } = require('./MenuSetupModule');
const nodemailer = require('nodemailer');
const Buffer = require('buffer').Buffer;

var client_url = 'https://shoplocal-lagunabeach.com/#/';
var api_url = 'https://lagunaapi.shoplocal-lagunabeach.com/';

const ConfirmMenu = async (res_id) => {
    var data = '';
    let qr_sql = `SELECT * FROM md_url WHERE restaurant_id = "${res_id}"`;
    let qr = await F_Select(qr_sql);
    let con_sql = `SELECT * FROM td_contacts WHERE id = "${res_id}"`;
    let con = await F_Select(con_sql);
    let parm_sql = `SELECT * FROM md_parm_value`;
    let param = await F_Select(parm_sql);
    var img = qr.msg[0].dynamic_img,
        con_name = con.msg[0].contact_name,
        email = con.msg[0].email,
        pro_name = param.msg[0].param_value,
        email_name = param.msg[1].param_value;
    console.log({ pro_name, email_name, con_name });

    return new Promise(async (resolve, reject) => {
        data = await send_email(res_id, email, img, con_name, pro_name, email_name);
        resolve(data);
    })
    //return data;
    // console.log(qr.msg[0].image);
}

const send_email = async (res_id, email_id, img, con_name, pro_name, email_name) => {
    // const { email_id } = args;
    // var password = 'password';
    // const pass = bcrypt.hashSync(password, 10);
    // var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    // var sql = `UPDATE md_users SET password = "${pass}", modified_by = "${email_id}", modified_dt = "${datetime}" WHERE user_id = "${email_id}"`;
    return new Promise(async (resolve, reject) => {
        // FOR LOCAL
        // var transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         user: 'synergicbbps@gmail.com',
        //         pass: 'Signature@123'
        //     }
        // });

        // FOR SERVER
        var transporter = nodemailer.createTransport({
            //pool: true,
            host: 'webmail.shoplocal-lagunabeach.com',
            port: 25,
            secure: false,
            auth: {
                user: 'admin@shoplocal-lagunabeach.com',
                pass: 'dY786#lw!Laguna'
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false
            }
        });

        var mailOptions = {
            from: 'admin@shoplocal-lagunabeach.com',
            to: email_id,
            subject: 'Shoplocal Menu Approval',
            html: '<!DOCTYPE html>'
                + '<html>'
                + '<head>'
                + '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'
                + '<title>ShopLocal</title>'
                + '<style type="text/css">'
                + 'body{margin:0; padding:0; font-family:14px; font-family:Arial, Helvetica, sans-serif;}'
                + '</style>'
                + '</head>'
                + '<body>'
                + '<div class="sectionArea" style="max-width:750px; width:100%; margin:2% auto 2% auto; padding:15px; background:#faf9f9; border-radius:15px;border: #ececec solid 1px;">'
                + '<table width="100%" border="0" cellspacing="0" cellpadding="0">'
                + '<tr>'
                + '<td align="left" valign="top" class="logoArea" style="padding:0 0 25px 0; text-align:center;"><img src="https://eporiseva.com/sll_logo.png" width="402" height="300" alt="" style="max-width:190px; width:100%; height:auto; margin:0 auto;"></td>'
                + '</tr>'
                + '<tr>'
                + '<td align="left" valign="top">'
                + '<h2 style="font-size:18px; font-weight:700; font-family:Arial, Helvetica, sans-serif;">Hi ' + con_name + ',</h2>'
                + '<h2 style="font-size:18px; font-weight:700; font-family:Arial, Helvetica, sans-serif;">Congratulations</h2>'
                + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:22px; padding-bottom:15px; margin:0;">We are pleased to confirm that we have completed the building of your Digital Menu!</p>'
                + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:22px; padding-bottom:15px; margin:0;">There is now just one final step before it can golive..you must approve the Menu</p>'
                + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:22px; padding-bottom:15px; margin:0;">To do this please scan the QR Code below which will take you to the Menu. Go through the entire Menu and when you have finished click on the button blow to confirm your approval or reject it if there are any errors.</p>'
                + '<p style="padding-bottom:15px; margin:0;"><img src="' + api_url + img + '" width="128" height="128" alt=""></p>'
                + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:19px; padding-bottom:15px; margin:0;"><strong>Your Sincerely</strong>,<br>'
                + email_name + '<br>'
                + pro_name + '</p>'
                + '<p style="font-family:Arial, Helvetica, sans-serif; padding-top:20px; padding-bottom:20px; margin:0;">'
                + '<a href="' + client_url + 'confirmation/' + res_id + '" style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 600;'
                + 'padding: 8px 15px; margin: 0; background: #3fb048; text-decoration: none; color: #fff; border-radius: 34px; width: 100%; display: inline-block; text-align: center; box-sizing: border-box;">Request Amendment</a>'
                + '</p></td>'
                + '</tr>'
                + '</table>'
                + '</div>'
                + '</body>'
                + '</html>'
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                data = { suc: 0, msg: JSON.stringify(error) };
            } else {
                console.log('Email sent: ' + info.response);
                data = { suc: 1, msg: 'Email sent: ' + info.response };
            }
            resolve(data);
        });

    })
}

const ApproveMenu = async (data) => {
    var res_id = data[0].res_id,
        apr_flag = data[0].apr_flag,
        menu_list = data[0].menu_id,
        desc = data[0].desc,
        res = '';
    if (apr_flag == 'U') {
        await SendAdminUnapproveMail(res_id, apr_flag, menu_list, desc);
    } else if (apr_flag == 'A') {
        var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
        var sql = `UPDATE md_url SET approval_flag = "${apr_flag}", approved_by = "${res_id}", approved_date = "${datetime}" 
        WHERE restaurant_id = "${res_id}"`;
        // console.log(sql);
        return new Promise((resolve, reject) => {
            db.query(sql, (err, lastId) => {
                if (err) {
                    console.log(err);
                    res = { success: 0, message: JSON.stringify(err) };
                } else {
                    res = { success: 0, message: 'Success' };
                }
                resolve(res)
            })
        })
    }
}

const SendAdminUnapproveMail = async (res_id, apr_flag, menu_list, desc) => {
    // console.log({ menu_list });
    var v = '',
        v1 = '';
    for (let i = 0; i < menu_list.length; i++) {
        if (menu_list[i].dt > 0) {
            v = menu_list[i].dt;
            if (v1 != '') {
                v1 = v + ',' + v1;
            } else {
                v1 = v;
            }
        }
    }
    let menu_sql = `SELECT id, menu_description as menu_name FROM md_menu WHERE id IN(${v1})`;
    var menu_dt = await F_Select(menu_sql);

    console.log({ menu_dt: menu_dt.msg });
    let con_sql = `SELECT * FROM td_contacts WHERE id = "${res_id}"`;
    let con = await F_Select(con_sql);
    let con_name = con.msg[0].contact_name;
    let res_name = con.msg[0].restaurant_name;
    let res_email = con.msg[0].email;
    var app_chk = apr_flag == "A" ? "checked" : "",
        unap_chk = apr_flag == "U" ? "checked" : "",
        brk_chk = menu_list[0].dt > 0 ? 'checked="checked"' : "",
        lun_chk = menu_list[1].dt > 0 ? 'checked="checked"' : "",
        din_chk = menu_list[2].dt > 0 ? 'checked="checked"' : "",
        bru_chk = menu_list[3].dt > 0 ? 'checked="checked"' : "";
    var menu_chk_list = '<ul>';
    menu_dt.msg.forEach(dt => {
        console.log(dt.menu_name);
        menu_chk_list = `${menu_chk_list} <li> ${dt.menu_name} </li>`;
        // '<label class="container">' + dt.menu_name
        // '<input type="checkbox" disabled>'
    })
    menu_chk_list = `${menu_chk_list} </ul>`;
    // console.log({menu_chk_list});
    // spe_chk = menu_list[4].dt > 0 ? 'checked="checked"' : "";
    // console.log({ ab: menu_list[0].dt, brk_chk, lun_chk, din_chk });
    return new Promise(async (resolve, reject) => {
        // FOR LOCAL
        // var transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         user: 'synergicbbps@gmail.com',
        //         pass: 'Signature@123'
        //     }
        // });

        // FOR SERVER
        var transporter = nodemailer.createTransport({
            //pool: true,
            host: 'webmail.shoplocal-lagunabeach.com',
            port: 25,
            secure: false,
            auth: {
                user: 'admin@shoplocal-lagunabeach.com',
                pass: 'dY786#lw!Laguna'
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false
            }
        });

        var mailOptions = {
            from: 'admin@shoplocal-lagunabeach.com',
            to: res_email,
            subject: 'Shoplocal Menu Approval',
            html: '<!DOCTYPE html>'
                + '<html>'
                + '<head>'
                + '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'
                + '<title>Shoplocal</title>'
                + '<style type="text/css">'
                + 'body{margin:0; padding:0; font-family:14px; font-family:Arial, Helvetica, sans-serif;}'
                + '</style>'
                + '</head>'
                + '<body>'
                + '<div class="sectionArea" style="max-width:750px; width:100%; margin:2% auto 2% auto; padding:15px; background:#faf9f9; border-radius:15px; border: #ececec solid 1px;">'
                + '<table width="100%" border="0" cellspacing="0" cellpadding="0">'
                + '<tr>'
                + '<td align="left" valign="top" class="logoArea" style="padding:0 0 25px 0; text-align:center;"><img src="https://eporiseva.com/sll_logo.png" width="402" height="300" alt="" style="max-width:190px; width:100%; height:auto; margin:0 auto;"></td>'
                + '</tr>'
                + '<tr>'
                + '<td align="left" valign="top">'
                + '<h2 style="font-size:18px; font-weight:700; font-family:Arial, Helvetica, sans-serif;">Digitial Restaurant Menu </h2>'
                + '<form action="" method="get" id="approval">  '
                + '<label for="rest">Restaurant Name:</label>'
                + '<input type="text" id="rest" name="rest" value="' + res_name + '" readonly style="height: 22px; padding: 5px; font-size: 1rem; font-weight: 400; line-height: 1.5; color: #495057; background-color: #fff; background-clip: padding-box; border: 1px solid #ced4da; border-radius: .25rem; transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out; margin: 0 !important;"><br><br>'
                + '<label for="contact">Name of person:</label>'
                + '<input type="text" id="contact" name="contact" value="' + con_name + '" readonly style="height: 22px;padding: 5px;font-size: 1rem;font-weight: 400;line-height: 1.5;color: #495057;background-color: #fff;background-clip: padding-box;border: 1px solid #ced4da;border-radius: .25rem;transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;margin: 0 !important;"><br>'
                // + '<br>Please signify your approval or request an update of the Menu:<br><br>'
                // + '<input type="radio" id="html" name="fav_language" value="HTML" ' + app_chk + ' disabled>'
                // + '<label for="html">I have reviewed my MENU platform, and I APPROVE</label><br><br>'
                // + '<input type="radio" id="css" name="fav_language" value="CSS" ' + unap_chk + ' disabled>'
                + '<br><br><label for="javascript">I have checked my MENU Platform, and would like to request an update</label><br><br>'
                + 'Menu(s) that require(s) an update<br>'
                + menu_chk_list

                // + '<span class="checkmark"></span>'
                // + '</label>'
                // + '<label class="container">Lunch'
                // + '<input type="checkbox" ' + lun_chk + ' disabled>'
                // + '<span class="checkmark"></span>'
                // + '</label>'
                // + '<label class="container">Dinner'
                // + '<input type="checkbox" ' + din_chk + ' disabled>'
                // + '<span class="checkmark"></span>'
                // + '</label>'
                // + '<label class="container">Brunch'
                // + '<input type="checkbox" ' + bru_chk + ' disabled>'
                // + '<span class="checkmark"></span>'
                // + '</label>'
                // + '<label class="container">Specials'
                // + '<input type="checkbox" ' + spe_chk + ' disabled>'
                // + '<span class="checkmark"></span>'
                // + '</label>'
                + '<br>'
                + 'Description<br> '
                + '<textarea rows="6" cols="60" maxlength="50" readonly style="height:120px; width: 100%;padding: .375rem .75rem;font-size: 1rem; box-sizing: border-box;font-weight: 400;line-height: 1.5;color: #495057;background-color: #fff;background-clip: padding-box;border: 1px solid #ced4da;border-radius: .25rem;transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;margin:15px 0 20px 0 !important;">' + desc + '</textarea>'
                + '</form>'
                + '</td>'
                + '</tr>'
                + '</table>'
                + '</div>'
                + '</body>'
                + '</html>'
        }
        console.log(mailOptions.html);
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                data = { success: 0, message: 'Mail Not Sent Successfully' };
            } else {
                console.log('Email sent: ' + info.response);
                data = { success: 1, message: 'Mail Sent Successfully' };
            }
            resolve(data);
        });
    })
}

const OrderEmail = (res_id, email_id, contact_name, en_data) => {
    return new Promise(async (resolve, reject) => {
        var type = 1;
        let sql = `SELECT email_type_id, email_body FROM md_config_email WHERE email_type_id = ${type}`;
        var sql_dt = await F_Select(sql);
        var email_body = sql_dt.msg[0].email_body;
        // FOR LOCAL
        // var transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         user: 'synergicbbps@gmail.com',
        //         pass: 'Signature@123'
        //     }
        // });

        // FOR SERVER
        var transporter = nodemailer.createTransport({
            //pool: true,
            host: 'webmail.shoplocal-lagunabeach.com',
            port: 25,
            secure: false,
            auth: {
                user: 'admin@shoplocal-lagunabeach.com',
                pass: 'dY786#lw!Laguna'
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false
            }
        });

        var email_name = 'Cindy Ferguson',
            pro_name = 'Shop Local Laguna';

        var mailOptions = {
            from: 'admin@shoplocal-lagunabeach.com',
            to: email_id,
            subject: 'Shoplocal Order Now',
            html: '<!DOCTYPE html>'
                + '<html>'
                + '<head>'
                + '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'
                + '<title>ShopLocal</title>'
                + '<style type="text/css">'
                + 'body{margin:0; padding:0; font-family:14px; font-family:Arial, Helvetica, sans-serif;}'
                + '</style>'
                + '</head>'
                + '<body>'
                + '<div class="sectionArea" style="max-width:750px; width:100%; margin:2% auto 2% auto; padding:15px; background:#faf9f9; border-radius:15px;border: #ececec solid 1px;">'
                + '<table width="100%" border="0" cellspacing="0" cellpadding="0">'
                + '<tr>'
                + '<td align="left" valign="top" class="logoArea" style="padding:0 0 25px 0; text-align:center;"><img src="https://eporiseva.com/sll_logo.png" width="402" height="300" alt="" style="max-width:190px; width:100%; height:auto; margin:0 auto;"></td>'
                + '</tr>'
                + '<tr>'
                + '<td align="left" valign="top">'
                + '<h2 style="font-size:18px; font-weight:700; font-family:Arial, Helvetica, sans-serif;">Hi ' + contact_name + ',</h2>'
                + '<h2 style="font-size:18px; font-weight:700; font-family:Arial, Helvetica, sans-serif;">Congratulations</h2>'
                + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:22px; padding-bottom:15px; margin:0;">' + email_body + '</p>'
                // + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:22px; padding-bottom:15px; margin:0;">You have successfully completed your registration..</p>'
                // + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:22px; padding-bottom:15px; margin:0;">Please click on the link bellow to complete your order.</p>'

                + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:19px; padding-bottom:15px; margin:0;"><strong>Your Sincerely</strong>,<br>'
                + email_name + '<br>'
                + pro_name + '</p>'
                + '<p style="font-family:Arial, Helvetica, sans-serif; padding-top:20px; padding-bottom:20px; margin:0;">'
                + '<a href="' + client_url + 'order/' + en_data + '" style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 600;'
                + 'padding: 8px 15px; margin: 0; background: #3fb048; text-decoration: none; color: #fff; border-radius: 34px; width: 100%; display: inline-block; text-align: center; box-sizing: border-box;">Order Now</a>'
                + '</p></td>'
                + '</tr>'
                + '</table>'
                + '</div>'
                + '</body>'
                + '</html>'
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                data = { suc: 0, msg: JSON.stringify(error) };
            } else {
                console.log('Email sent: ' + info.response);
                data = { suc: 1, msg: 'Email sent: ' + info.response };
            }
            resolve(data);
        });

    })
}

const PayEmail = async (res_id, en_data) => {
    var type = 2;
    let sql = `SELECT email_type_id, email_body FROM md_config_email WHERE email_type_id = ${type}`;
    var sql_dt = await F_Select(sql);
    var email_body = sql_dt.msg[0].email_body;

    var str = Buffer.from(en_data, 'base64').toString('ascii');
    var de_id = str.split('/');
    var de_res_id = de_id[0],
        de_res_email = de_id[1];

    var new_date = new Date(),
        mod_dt = new_date.setHours(new_date.getHours() + 5),
        new_dt = dateFormat(mod_dt, "yyyy-mm-dd HH:MM:ss"),
        str = `${de_res_id}/${de_res_email}/${new_dt}`,
        new_en_data = Buffer.from(str).toString('base64');
    // console.log({ date_1, str, new_en_data });
    let con_sql = `SELECT * FROM td_contacts WHERE id = "${res_id}"`;
    let con = await F_Select(con_sql);
    let parm_sql = `SELECT * FROM md_parm_value`;
    let param = await F_Select(parm_sql);
    var contact_name = con.msg[0].contact_name,
        email_id = con.msg[0].email,
        pro_name = param.msg[0].param_value,
        email_name = param.msg[1].param_value;
    return new Promise(async (resolve, reject) => {
        // FOR LOCAL
        // var transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         user: 'synergicbbps@gmail.com',
        //         pass: 'Signature@123'
        //     }
        // });

        // FOR SERVER
        var transporter = nodemailer.createTransport({
            //pool: true,
            host: 'webmail.shoplocal-lagunabeach.com',
            port: 25,
            secure: false,
            auth: {
                user: 'admin@shoplocal-lagunabeach.com',
                pass: 'dY786#lw!Laguna'
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false
            }
        });

        var mailOptions = {
            from: 'admin@shoplocal-lagunabeach.com',
            to: email_id,
            subject: 'Shoplocal Pay Now',
            html: '<!DOCTYPE html>'
                + '<html>'
                + '<head>'
                + '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'
                + '<title>ShopLocal</title>'
                + '<style type="text/css">'
                + 'body{margin:0; padding:0; font-family:14px; font-family:Arial, Helvetica, sans-serif;}'
                + '</style>'
                + '</head>'
                + '<body>'
                + '<div class="sectionArea" style="max-width:750px; width:100%; margin:2% auto 2% auto; padding:15px; background:#faf9f9; border-radius:15px;border: #ececec solid 1px;">'
                + '<table width="100%" border="0" cellspacing="0" cellpadding="0">'
                + '<tr>'
                + '<td align="left" valign="top" class="logoArea" style="padding:0 0 25px 0; text-align:center;"><img src="https://eporiseva.com/sll_logo.png" width="402" height="300" alt="" style="max-width:190px; width:100%; height:auto; margin:0 auto;"></td>'
                + '</tr>'
                + '<tr>'
                + '<td align="left" valign="top">'
                + '<h2 style="font-size:18px; font-weight:700; font-family:Arial, Helvetica, sans-serif;">Hi ' + contact_name + ',</h2>'
                + '<h2 style="font-size:18px; font-weight:700; font-family:Arial, Helvetica, sans-serif;">Congratulations</h2>'
                + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:22px; padding-bottom:15px; margin:0;">' + email_body + '</p>'
                // + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:22px; padding-bottom:15px; margin:0;">Your order has been placed successfully.</p>'
                // + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:22px; padding-bottom:15px; margin:0;">Please click on the link bellow to complete your payment.</p>'

                + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:19px; padding-bottom:15px; margin:0;"><strong>Your Sincerely</strong>,<br>'
                + email_name + '<br>'
                + pro_name + '</p>'
                + '<p style="font-family:Arial, Helvetica, sans-serif; padding-top:20px; padding-bottom:20px; margin:0;">'
                + '<a href="' + client_url + 'payment/' + new_en_data + '" style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 600;'
                + 'padding: 8px 15px; margin: 0; background: #3fb048; text-decoration: none; color: #fff; border-radius: 34px; width: 100%; display: inline-block; text-align: center; box-sizing: border-box;">Pay Now</a>'
                + '</p></td>'
                + '</tr>'
                + '</table>'
                + '</div>'
                + '</body>'
                + '</html>'
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                data = { suc: 0, msg: JSON.stringify(error) };
            } else {
                console.log('Email sent: ' + info.response);
                data = { suc: 1, msg: 'Email sent: ' + info.response };
            }
            resolve(data);
        });

    })
}

const UserCredential = async (res_id, password) => {
    var type = 3;
    let sql = `SELECT email_type_id, email_body FROM md_config_email WHERE email_type_id = ${type}`;
    var sql_dt = await F_Select(sql);
    var email_body = sql_dt.msg[0].email_body;

    let con_sql = `SELECT * FROM td_contacts WHERE id = "${res_id}"`;
    let con = await F_Select(con_sql);
    let parm_sql = `SELECT * FROM md_parm_value`;
    let param = await F_Select(parm_sql);
    var contact_name = con.msg[0].contact_name,
        email_id = con.msg[0].email,
        pro_name = param.msg[0].param_value,
        email_name = param.msg[1].param_value;
    return new Promise(async (resolve, reject) => {
        // FOR LOCAL
        // var transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         user: 'synergicbbps@gmail.com',
        //         pass: 'Signature@123'
        //     }
        // });

        // FOR SERVER
        var transporter = nodemailer.createTransport({
            //pool: true,
            host: 'webmail.shoplocal-lagunabeach.com',
            port: 25,
            secure: false,
            auth: {
                user: 'admin@shoplocal-lagunabeach.com',
                pass: 'dY786#lw!Laguna'
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false
            }
        });

        var mailOptions = {
            from: 'admin@shoplocal-lagunabeach.com',
            to: email_id,
            subject: 'Shoplocal User Credential',
            html: '<!DOCTYPE html>'
                + '<html>'
                + '<head>'
                + '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'
                + '<title>ShopLocal</title>'
                + '<style type="text/css">'
                + 'body{margin:0; padding:0; font-family:14px; font-family:Arial, Helvetica, sans-serif;}'
                + '</style>'
                + '</head>'
                + '<body>'
                + '<div class="sectionArea" style="max-width:750px; width:100%; margin:2% auto 2% auto; padding:15px; background:#faf9f9; border-radius:15px;border: #ececec solid 1px;">'
                + '<table width="100%" border="0" cellspacing="0" cellpadding="0">'
                + '<tr>'
                + '<td align="left" valign="top" class="logoArea" style="padding:0 0 25px 0; text-align:center;"><img src="https://eporiseva.com/sll_logo.png" width="402" height="300" alt="" style="max-width:190px; width:100%; height:auto; margin:0 auto;"></td>'
                + '</tr>'
                + '<tr>'
                + '<td align="left" valign="top">'
                + '<h2 style="font-size:18px; font-weight:700; font-family:Arial, Helvetica, sans-serif;">Hi ' + contact_name + ',</h2>'
                + '<h2 style="font-size:18px; font-weight:700; font-family:Arial, Helvetica, sans-serif;">Congratulations</h2>'
                // + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:22px; padding-bottom:15px; margin:0;">We are happy to have you as a part of the Shop Local Laguna family!</p>'
                // + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:22px; padding-bottom:15px; margin:0;">Your payment has been done successfully.</p>'
                + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:22px; padding-bottom:15px; margin:0;">' + email_body + '</p>'
                + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:22px; padding-bottom:15px; margin:0;">Your login credentials are as follow</p>'
                + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:22px; padding-bottom:15px; margin:0;"><b>UserName:</b> ' + email_id + '<br><b>Password:</b> ' + password + '</p>'
                // + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:22px; padding-bottom:15px; margin:0;">Please click on the link bellow to login.</p>'
                + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:19px; padding-bottom:15px; margin:0;"><strong>Your Sincerely</strong>,<br>'
                + email_name + '<br>'
                + pro_name + '</p>'
                + '<p style="font-family:Arial, Helvetica, sans-serif; padding-top:20px; padding-bottom:20px; margin:0;">'
                + '<a href="' + client_url + '" style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 600;'
                + 'padding: 8px 15px; margin: 0; background: #3fb048; text-decoration: none; color: #fff; border-radius: 34px; width: 100%; display: inline-block; text-align: center; box-sizing: border-box;">Login</a>'
                + '</p></td>'
                + '</tr>'
                + '</table>'
                + '</div>'
                + '</body>'
                + '</html>'
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                data = { suc: 0, msg: JSON.stringify(error) };
            } else {
                console.log('Email sent: ' + info.response);
                data = { suc: 1, msg: 'Email sent: ' + info.response };
            }
            resolve(data);
        });

    })
}

// PROMOTION CONFIRMATION MAIL TO USER //
const PromoConfirmMail = async (res_id, email, user_name) => {
    let con_sql = `SELECT * FROM td_contacts WHERE id = "${res_id}"`;
    var con = await F_Select(con_sql);
    var promo_sql = `SELECT * FROM md_promotion_restaurant WHERE restaurant_id = ${res_id}`,
        promo_dt = await F_Select(promo_sql),
        body = promo_dt.msg[0].confirm_email;
    var contact_name = user_name,
        email_id = email,
        res_name = con.msg[0].restaurant_name,
        res_contact_name = con.msg[0].contact_name;
    return new Promise(async (resolve, reject) => {
        // FOR LOCAL
        // var transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         user: 'synergicbbps@gmail.com',
        //         pass: 'Signature@123'
        //     }
        // });

        // FOR SERVER
        var transporter = nodemailer.createTransport({
            //pool: true,
            host: 'webmail.shoplocal-lagunabeach.com',
            port: 25,
            secure: false,
            auth: {
                user: 'admin@shoplocal-lagunabeach.com',
                pass: 'dY786#lw!Laguna'
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false
            }
        });

        var mailOptions = {
            from: 'admin@shoplocal-lagunabeach.com',
            to: email_id,
            subject: 'Congratulations! Your Promotions is on the way',
            html: '<!DOCTYPE html>'
                + '<html>'
                + '<head>'
                + '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'
                + '<title>ShopLocal</title>'
                + '<style type="text/css">'
                + 'body{margin:0; padding:0; font-family:14px; font-family:Arial, Helvetica, sans-serif;}'
                + '</style>'
                + '</head>'
                + '<body>'
                + '<div class="sectionArea" style="max-width:750px; width:100%; margin:2% auto 2% auto; padding:15px; background:#faf9f9; border-radius:15px;border: #ececec solid 1px;">'
                + '<table width="100%" border="0" cellspacing="0" cellpadding="0">'
                + '<tr>'
                + '<td align="left" valign="top" class="logoArea" style="padding:0 0 25px 0; text-align:center;"><img src="https://eporiseva.com/sll_logo.png" width="402" height="300" alt="" style="max-width:190px; width:100%; height:auto; margin:0 auto;"></td>'
                + '</tr>'
                + '<tr>'
                + '<td align="left" valign="top">'
                + '<h2 style="font-size:18px; font-weight:700; font-family:Arial, Helvetica, sans-serif;">Hi ' + contact_name + ',</h2>'
                + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:22px; padding-bottom:15px; margin:0;">' + body + '</p>'
                + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:19px; padding-bottom:15px; margin:0;"><strong>Your Sincerely</strong>,<br>'
                + res_contact_name + '<br>'
                + res_name + '</p>'
                + '</td>'
                + '</tr>'
                + '</table>'
                + '</div>'
                + '</body>'
                + '</html>'
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                data = { suc: 0, msg: JSON.stringify(error) };
            } else {
                console.log('Email sent: ' + info.response);
                data = { suc: 1, msg: 'Email sent: ' + info.response };
            }
            resolve(data);
        });

    })
}

const PromoEmail = async () => {
    var now_date = dateFormat(new Date(), "dd-mm");
    var sql = `SELECT a.id, a.restaurant_id, CONCAT(a.first_name, ' ', a.last_name) as name, a.email as user_email,
        date_format(date(a.birth_dt - INTERVAL 14 DAY), "%d-%m") as bd_dt,
        date_format(date(a.anniversary_dt - INTERVAL 14 DAY), "%d-%m") as ani_dt,
        a.birth_dt, a.anniversary_dt, b.restaurant_name, b.contact_name, b.phone_no, b.email, b.addr_line1 as address, c.mailing_email_subject mail_subj, c.mailing_email_body mail_body, d.url
        FROM td_promotions a, td_contacts b, md_promotion_restaurant c, md_url d
        WHERE a.restaurant_id=b.id
        AND a.restaurant_id=c.restaurant_id
        AND a.restaurant_id=d.restaurant_id
        AND (date_format(date(a.birth_dt - INTERVAL 14 DAY), "%d-%m") = "${now_date}"
        OR date_format(date(a.anniversary_dt - INTERVAL 14 DAY), "%d-%m") = "${now_date}")`;
    // console.log({ sql });
    var data = await F_Select(sql);
    if (data.msg.length > 0) {
        data.msg.forEach(async dt => {
            var mail_body = dt.mail_body;
            var bd_greet = dt.bd_dt == now_date ? 'Birthday' : '',
                ani_greet = dt.ani_dt == now_date ? 'Anniversary' : '',
                greet = bd_greet != '' & ani_greet != '' ? 'Birthday & Anniversary' : (bd_greet != '' ? bd_greet : ani_greet),
                res_email = dt.email,
                user_email = dt.user_email;
            // console.log(greet);
            // var body = mail_body.replace('[User Name]!', dt.name).replace('[Birthday/Anniversary]!', greet).replace('[Birthday/Anniversary]!', greet).replace("[Restaurant's Contact Name]!", dt.contact_name).replace('[Name of Restaurant]!', dt.restaurant_name).replace('[Address]!', dt.address).replace('[Phone]!', dt.phone_no).replace('[Email]!', dt.email).replace('[Menu Url]!', dt.url);
            var body = mail_body.split("[User Name]!").join(dt.name)
            body = body.split("[Birthday/Anniversary]!").join(greet)
            body = body.split("[Restaurant's Contact Name]!").join(dt.contact_name)
            body = body.split("[Name of Restaurant]!").join(dt.restaurant_name)
            body = body.split("[Address]!").join(dt.address)
            body = body.split("[Phone]!").join(dt.phone_no)
            body = body.split("[Email]!").join(dt.email)
            body = body.split("[Menu Url]!").join(dt.url)
            var mail_subj = dt.mail_subj
            var subj = mail_subj.split("[Birthday/Anniversary]!").join(greet)
            subj = subj.split("[Name of Restaurant]!").join(dt.restaurant_name)
            var logo_sql = `SELECT restaurant_id, logo_path, logo_url FROM td_logo WHERE restaurant_id = ${dt.restaurant_id}`;
            var logo_dt = await F_Select(logo_sql),
                logo = logo_dt.msg[0].logo_path;
            // FOR LOCAL
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'synergicbbps@gmail.com',
                    pass: 'Signature@123'
                }
            });

            // FOR SERVER
            // var transporter = nodemailer.createTransport({
            //     //pool: true,
            //     host: 'webmail.shoplocal-lagunabeach.com',
            //     port: 25,
            //     secure: false,
            //     auth: {
            //         user: 'admin@shoplocal-lagunabeach.com',
            //         pass: 'dY786#lw!Laguna'
            //     },
            //     tls: {
            //         // do not fail on invalid certs
            //         rejectUnauthorized: false
            //     }
            // });

            var mailOptions = {
                from: res_email,
                to: user_email,
                subject: subj,
                html: '<!DOCTYPE html>'
                    + '<html>'
                    + '<head>'
                    + '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'
                    + '<title>ShopLocal</title>'
                    + '<style type="text/css">'
                    + 'body{margin:0; padding:0; font-family:14px; font-family:Arial, Helvetica, sans-serif;}'
                    + '</style>'
                    + '</head>'
                    + '<body>'
                    + '<div class="sectionArea" style="max-width:750px; width:100%; margin:2% auto 2% auto; padding:15px; background:#faf9f9; border-radius:15px;border: #ececec solid 1px;">'
                    + '<table width="100%" border="0" cellspacing="0" cellpadding="0">'
                    + '<tr>'
                    + '<td align="left" valign="top" class="logoArea" style="padding:0 0 25px 0; text-align:center;"><img src="https://lagunaapi.shoplocal-lagunabeach.com/' + logo + '" width="402" height="300" alt="" style="max-width:190px; width:100%; height:auto; margin:0 auto;"></td>'
                    + '</tr>'
                    + '<tr>'
                    + '<td align="left" valign="top">'
                    // + '<h2 style="font-size:18px; font-weight:700; font-family:Arial, Helvetica, sans-serif;">Hi ' + contact_name + ',</h2>'
                    + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:22px; padding-bottom:15px; margin:0;">' + body + '</p>'
                    // + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:19px; padding-bottom:15px; margin:0;"><strong>Your Sincerely</strong>,<br>'
                    // + res_contact_name + '<br>'
                    // + res_name + '</p>'
                    + '</td>'
                    + '</tr>'
                    + '</table>'
                    + '</div>'
                    + '</body>'
                    + '</html>'
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    data = { suc: 0, msg: JSON.stringify(error) };
                } else {
                    console.log('Email sent: ' + info.response);
                    data = { suc: 1, msg: 'Email sent: ' + info.response };
                }
            });
            // console.log(body);
        })
    }
    // var user_name = data.msg[0].
}

module.exports = { ConfirmMenu, ApproveMenu, OrderEmail, PayEmail, UserCredential, PromoConfirmMail, PromoEmail };