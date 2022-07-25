const db = require('../core/db');
const dateFormat = require('dateformat');
var request = require('request');
const { F_Select } = require('./MenuSetupModule');
var data = '';

const GetPackageData = (data) => {
    var sql = `SELECT * FROM md_package`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) { console.log(err); data = { suc: 0, msg: JSON.stringify(err) }; }
            else {
                if (result.length > 0) {
                    data = { suc: 1, msg: result };
                } else {
                    data = { suc: 2, msg: 'No Data Found' };
                }
            }
            resolve(data);
        })
    })
}

const PackageSave = async (data) => {
    var check = await CheckPackage(data,);
    var user = 'admin@gmail.com';
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = '';
    if (check > 1) {
        sql = `INSERT INTO md_package (pakage_name, no_of_menu, special_menu, setup_fee, monthly_fee, created_by, created_dt) VALUES ("${data.Serial_no}", "${data.Menu_number}", "${data.Special_Menu}", "${data.SetUp_Fee}", "${data.Monthly_Fee}", "${user}", "${datetime}")`;
    } else {
        sql = `UPDATE md_package SET no_of_menu= "${data.Menu_number}", special_menu= "${data.Special_Menu}", setup_fee= "${data.SetUp_Fee}", monthly_fee= "${data.Monthly_Fee}", modified_by= "${user}", modified_dt= "${datetime}" WHERE pakage_name = ${data.Serial_no}`;
    }
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) }
            } else {
                data = { suc: 1, msg: 'Successfully Inserted !!' };
            }
            resolve(data);
        })
    })
}

const CheckPackage = (data) => {
    var sql = `SELECT * FROM md_package WHERE pakage_name = ${data.Serial_no}`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) { console.log(err); data = 0; }
            else {
                if (result.length > 0) {
                    data = 1;
                } else {
                    data = 2;
                }
            }
            resolve(data);
        })
    })
}

const GetResult = (tb_name) => {
    var sql = `SELECT * FROM ${tb_name}`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) { console.log(err); data = { suc: 0, msg: JSON.stringify(err) }; }
            else {
                if (result.length > 0) {
                    data = { suc: 1, msg: result };
                } else {
                    data = { suc: 2, msg: 'No Data Found' };
                }
            }
            resolve(data);
        })
    })
}

const PromoSave = async (data) => {
    var check = await CheckData(data, tb_name = 'md_promo_calander');
    var user = 'admin@gmail.com';
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = '';
    if (check > 1) {
        sql = `INSERT INTO md_promo_calander (id, free_flag, price, created_by, created_dt) VALUES ("${data.serial_no}", "${data.free}", "${data.price}", "${user}", "${datetime}")`;
    } else {
        sql = `UPDATE md_promo_calander SET free_flag= "${data.free}", price= "${data.price}", modified_by= "${user}", modified_dt= "${datetime}" WHERE id = ${data.serial_no}`;
    }
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) }
            } else {
                data = { suc: 1, msg: 'Successfully Inserted !!' };
            }
            resolve(data);
        })
    })
}

const HolderClingSave = async (data) => {
    var check = await CheckData(data, tb_name = 'md_holder_cling');
    var sql = '';
    var user = 'admin@gmail.com',
        free_flag = data.per_Holder_Price > 0 ? 'N' : 'Y',
        price = data.per_Holder_Price > 0 ? data.per_Holder_Price : 0;
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    if (check > 1) {
        sql = `INSERT INTO md_holder_cling (id, free_flag, price, created_by, created_dt) VALUES ("${data.serial_no}", "${free_flag}", "${price}", "${user}", "${datetime}")`;
    } else {
        sql = `UPDATE md_holder_cling SET free_flag= "${free_flag}", price= "${price}", modified_by= "${user}", modified_dt= "${datetime}" WHERE id = ${data.serial_no}`;
    }
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) }
            } else {
                data = { suc: 1, msg: 'Successfully Inserted !!' };
            }
            resolve(data);
        })
    })
}

const CheckData = (data, tb_name) => {
    var sql = `SELECT * FROM ${tb_name} WHERE id = ${data.serial_no}`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) { console.log(err); data = 0; }
            else {
                if (result.length > 0) {
                    data = 1;
                } else {
                    data = 2;
                }
            }
            resolve(data);
        })
    })
}

const UpdateApproval = (flag, res_id) => {
    var sql = `UPDATE md_url SET approval_flag = '${flag}' WHERE restaurant_id = "${res_id}"`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) }
            } else {
                data = { suc: 1, msg: 'Successfully Updated !!' };
            }
            resolve(data);
        })
    })
}

const F_Delete = (tb_name, whr) => {
    let sql = `DELETE FROM ${tb_name} ${whr}`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) }
            } else {
                data = { suc: 1, msg: 'Successfully Deleted !!' };
            }
            resolve(data);
        })
    })
}

const SaveEmailBody = async (data) => {
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
        sql = '';
    let chk_sql = `SELECT COUNT(id) as cunt_dt FROM md_config_email WHERE email_type_id = ${data.email_type}`;
    var chk_dt = await F_Select(chk_sql);
    if (chk_dt.msg[0].cunt_dt > 0) {
        sql = `UPDATE md_config_email SET email_body = "${data.body}", modified_by = ${data.user}, modified_dt = "${datetime}"
        WHERE email_type_id = ${data.email_type}`;
    } else {
        sql = `INSERT INTO md_config_email (email_type_id, email_body, created_by, created_dt) VALUES 
        (${data.email_type}, "${data.body}", "${data.user}", "${datetime}")`
    }
    return new Promise((resolve, reject) => {
        db.query(sql, (err) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) }
            } else {
                data = { suc: 1, msg: 'Successfully Inserted !!' };
            }
            resolve(data);
        })
    })
}

const SaveMenuInfo = (data) => {
    var sql = '',
        datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    if (data.id > 0) {
        sql = `UPDATE md_menu SET info = "${data.info}", modified_by = '${data.user}', modified_dt = "${datetime}" WHERE id = ${data.id}`;
    }
    return new Promise((resolve, reject) => {
        db.query(sql, (err) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) }
            } else {
                data = { suc: 1, msg: 'Successfully Inserted !!' };
            }
            resolve(data);
        })
    })
}

const ConfigMenu = async (data) => {
    let chk_sql = `SELECT id FROM md_config_menu`;
    var chk_dt = await F_Select(chk_sql);
    var id = chk_dt.msg.length > 0 ? chk_dt.msg[0].id : 0,
        sql = '',
        res = '';
    if (chk_dt.msg.length > 0) {
        sql = `UPDATE md_config_menu SET footer_color = "${data.foo_col}", footer_content = '${data.foo_con}', text_color = "${data.txt_col}", greet_text_color = "${data.greet_col}" WHERE id = ${id}`
    } else {
        sql = `INSERT INTO md_config_menu (footer_color, footer_content, text_color, greet_text_color) 
        VALUES ("${data.foo_col}", '${data.foo_con}', "${data.txt_col}", "${data.greet_col}")`
    }
    return new Promise((resolve, reject) => {
        db.query(sql, (err) => {
            if (err) {
                console.log(err);
                res = { suc: 0, msg: JSON.stringify(err) }
            } else {
                res = { suc: 1, msg: 'Successfully Inserted !!' };
            }
            resolve(res);
        })
    })
}

const DelRes = (res_id) => {
    let sql = `UPDATE td_users SET active_flag = 'N' WHERE restaurant_id = ${res_id}`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err) => {
            if (err) {
                console.log(err);
                res = { suc: 0, msg: JSON.stringify(err) }
            } else {
                res = { suc: 1, msg: 'Successfully Deleted !!' };
            }
            resolve(res);
        })
    })
}

const HelpTextSave = async (data) => {
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    let chk_sql = `SELECT id, count(id) as chk_cunt FROM md_config_inst`;
    var chk_dt = await F_Select(chk_sql);
    var sql = '';
    if (chk_dt.msg[0].chk_cunt > 0) {
        sql = `UPDATE md_config_inst SET menu_help = "${data.menu_help}", calender_help = "${data.cal_help}", qr_help = "${data.qr_help}", birthday_help = "${data.bir_help}", cantact_info_help = "${data.con_help}", modified_by = "${data.user}", modified_dt = "${datetime}" WHERE id = ${chk_dt.msg[0].id}`;
    } else {
        sql = `INSERT INTO md_config_inst (menu_help, calender_help, qr_help, birthday_help, cantact_info_help, created_by, created_dt) 
        VALUES ("${data.menu_help}", "${data.cal_help}", "${data.qr_help}", "${data.bir_help}", "${data.con_help}", "${data.user}", "${datetime}")`
    }
    return new Promise((resolve, reject) => {
        db.query(sql, (err) => {
            if (err) {
                console.log(err);
                res = { suc: 0, msg: JSON.stringify(err) }
            } else {
                res = { suc: 1, msg: 'Successfully Inserted !!' };
            }
            resolve(res);
        })
    })
}

const OtherText = async (data) => {
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    let chk_sql = `SELECT id, count(id) as chk_cunt FROM md_config_inst`;
    var chk_dt = await F_Select(chk_sql);
    var sql = '';
    if (chk_dt.msg[0].chk_cunt > 0) {
        sql = `UPDATE md_config_inst SET birthday_body = "${data.bir_text}", event_body = "${data.event_text}", modified_by = "${data.user}", modified_dt = "${datetime}" WHERE id = ${chk_dt.msg[0].id}`;
    } else {
        sql = `INSERT INTO md_config_inst (birthday_body, event_body, created_by, created_dt)
        VALUES ("${data.bir_text}", "${data.event_text}", "${data.user}", "${datetime}")`
    }
    return new Promise((resolve, reject) => {
        db.query(sql, (err) => {
            if (err) {
                console.log(err);
                res = { suc: 0, msg: JSON.stringify(err) }
            } else {
                res = { suc: 1, msg: 'Successfully Inserted !!' };
            }
            resolve(res);
        })
    })
}

const DifImgSave = async (filename, user_name) => {
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    let chk_sql = `SELECT id, count(id) as chk_cunt FROM md_config_inst`;
    var chk_dt = await F_Select(chk_sql);
    var sql = '';
    if (chk_dt.msg[0].chk_cunt > 0) {
        sql = `UPDATE md_config_inst SET event_img = "${filename}", modified_by = "${user_name}", modified_dt = "${datetime}" WHERE id = ${chk_dt.msg[0].id}`;
    } else {
        sql = `INSERT INTO md_config_inst (event_img, created_by, created_dt)
        VALUES ("${filename}", "${user_name}", "${datetime}")`
    }
    return new Promise((resolve, reject) => {
        db.query(sql, (err) => {
            if (err) {
                console.log(err);
                res = { suc: 0, msg: JSON.stringify(err) }
            } else {
                res = { suc: 1, msg: 'Successfully Inserted !!' };
            }
            resolve(res);
        })
    })
}

const DifCovImgSave = async (filename, user_name) => {
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    let chk_sql = `SELECT id, count(id) as chk_cunt FROM md_config_inst`;
    var chk_dt = await F_Select(chk_sql);
    var sql = '';
    if (chk_dt.msg[0].chk_cunt > 0) {
        sql = `UPDATE md_config_inst SET cover_img = "${filename}", modified_by = "${user_name}", modified_dt = "${datetime}" WHERE id = ${chk_dt.msg[0].id}`;
    } else {
        sql = `INSERT INTO md_config_inst (cover_img, created_by, created_dt)
        VALUES ("${filename}", "${user_name}", "${datetime}")`
    }
    console.log(sql);
    return new Promise((resolve, reject) => {
        db.query(sql, (err) => {
            if (err) {
                console.log(err);
                res = { suc: 0, msg: JSON.stringify(err) }
            } else {
                res = { suc: 1, msg: 'Successfully Inserted !!' };
            }
            resolve(res);
        })
    })
}

const OrderConfSave = async (data) => {
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    let chk_sql = `SELECT id, count(id) as chk_cunt FROM md_config_inst`;
    var chk_dt = await F_Select(chk_sql);
    var sql = '';
    if (chk_dt.msg[0].chk_cunt > 0) {
        sql = `UPDATE md_config_inst SET order_conf = "${data.order_conf}", modified_by = "${data.user}", modified_dt = "${datetime}" WHERE id = ${chk_dt.msg[0].id}`;
    } else {
        sql = `INSERT INTO md_config_inst (order_conf, created_by, created_dt)
        VALUES ("${data.order_conf}", "${data.user}", "${datetime}")`
    }
    return new Promise((resolve, reject) => {
        db.query(sql, (err) => {
            if (err) {
                console.log(err);
                res = { suc: 0, msg: JSON.stringify(err) }
            } else {
                res = { suc: 1, msg: 'Successfully Inserted !!' };
            }
            resolve(res);
        })
    })
}

const GenerateBitlyUrl = async (url, res_id) => {
    var res = '',
        data = '';

    var options = {
        'method': 'POST',
        'url': 'https://api-ssl.bitly.com/v4/shorten',
        'headers': {
            'Authorization': '9f526219992d43ac22e50e289fb09fd7c9cc25a2',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "domain": "bit.ly",
            "long_url": url
        })

    };
    // console.log({body: options.body});
    return new Promise((resolve, reject) => {
        request(options, function (error, response) {
            if (error) throw new Error(error);
            // console.log({ response: response.body });
            data = JSON.parse(response.body);
            // console.log({ data_link: data.link });
            if (data.id) {
                var link = data.link; //'https://' + data.id;
                // console.log({ link });
                var sql = `UPDATE md_url SET bitly_url = "${link}" WHERE restaurant_id = "${res_id}"`;
                // console.log({ sql });
                // return new Promise((resolve, reject) => {
                db.query(sql, (err, lastId) => {
                    if (err) {
                        console.log(err);
                        res = { suc: 0, msg: JSON.stringify(err) }
                    } else {
                        res = { suc: 1, msg: link };
                    }
                    // console.log({ res });
                    resolve(res);
                })
                // })
            } else {
                // return new Promise((resolve, reject) => {
                res = { suc: 0, msg: 'No URL Generated !!' };
                resolve(res);
                // })
            }
        });
    })

}

module.exports = { PackageSave, GetPackageData, PromoSave, GetResult, HolderClingSave, UpdateApproval, CheckData, F_Delete, SaveEmailBody, SaveMenuInfo, ConfigMenu, DelRes, HelpTextSave, OtherText, DifImgSave, OrderConfSave, GenerateBitlyUrl, DifCovImgSave };