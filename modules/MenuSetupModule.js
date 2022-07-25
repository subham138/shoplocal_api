const db = require('../core/db');
const dateFormat = require('dateformat');
var multer = require('multer');

const QRCode = require("qrcode");
const { createCanvas, loadImage } = require("canvas");
const fs = require('fs');

var api_url = 'https://lagunaapi.shoplocal-lagunabeach.com/';

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../assets/files');
    },
    filename: (req, file, cb) => {
        console.log(file);
        var filetype = '';
        if (file.mimetype === 'image/gif') {
            filetype = 'gif';
        }
        if (file.mimetype === 'image/png') {
            filetype = 'png';
        }
        if (file.mimetype === 'image/jpeg') {
            filetype = 'jpg';
        }
        cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});
var upload = multer({ storage: storage });

const BreakfastSave = (upload.array('file'), (req, res, next) => {
    console.log(req.file);
    if (!req.file) {
        res.status(500);
    }
    res.json({ fileUrl: 'http://localhost:3000/assets/files/' + req.file.filename });
})

const MenuSave = async (data) => {
    var mndt = await MenuImageSave(data);
    var othdt = await OtherImageSave(data);
    var secdt = await SectionImageSave(data);
    var mdt = await MonthDateSave(data);
    var dt = '';
    if (mndt && othdt && secdt && mdt) {
        dt = { suc: 1, msg: "Inserted Successfully !!" };
    } else {
        dt = { suc: 0, msg: "Something Went Wrong" };
    }
    return new Promise((resolve, reject) => {
        resolve(dt)
    })
}

const MenuImageSave = async (data, cov_img_path, top_img_path) => {
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = '';
    var cov = cov_img_path != '' ? `, cover_page_img = "${cov_img_path}"` : '';
    var top = top_img_path != '' ? `, top_image_img = "${top_img_path}"` : '';
    var chk_dt = await Check_Data(db_name = 'td_other_image', whr = `WHERE restaurant_id = "${data.restaurant_id}" AND menu_id = "${data.menu_id}"`);
    if (chk_dt > 1) {
        sql = `INSERT INTO td_other_image (restaurant_id, menu_id, active_flag, cover_page_img, cover_page_url, top_image_img, top_img_url, created_by, created_dt) VALUES
    ("${data.restaurant_id}", "${data.menu_id}", "${data.break_check}", "${cov_img_path}", "${data.coverurl}", "${top_img_path}", "${data.topurl}", "${data.restaurant_id}", "${datetime}")`;
    } else {
        sql = `UPDATE td_other_image SET active_flag = "${data.break_check}" ${cov}, cover_page_url = "${data.coverurl}" ${top}, top_img_url = "${data.topurl}", modified_by = "${data.restaurant_id}", modified_dt = "${datetime}"
        WHERE restaurant_id = "${data.restaurant_id}" AND menu_id = "${data.menu_id}"`;
    }
    console.log({ other: sql });
    // var sql = `INSERT INTO td_other_image (restaurant_id, menu_id, active_flag, cover_page_img, cover_page_url, top_image_img, top_img_url, created_by, created_dt) VALUES
    // ("${data.restaurant_id}", "${data.menu_id}", "${data.break_check}", "${cov_img_path}", "${data.coverurl}", "${top_img_path}", "${data.topurl}", "${data.restaurant_id}", "${datetime}")`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                data = false;
            } else {
                data = true;
            }
        })
        resolve(data)
    })
}

const OtherImageSave = async (data, menu_img) => {
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = '';
    if (Array.isArray(menu_img)) {
        for (let i = 0; i < menu_img.length; i++) {
            let menu_data = await F_Select(`SELECT * FROM td_menu_image WHERE restaurant_id = "${data.restaurant_id}" AND menu_id = "${data.menu_id}" AND menu_img = "${menu_img[i].filename}"`);
            if (menu_data.msg.length < 1) {
                sql = `INSERT INTO td_menu_image (restaurant_id, menu_id, active_flag, menu_url, menu_img, created_by, created_dt) VALUES
            ("${data.restaurant_id}", "${data.menu_id}", "${data.break_check}", "${data.MenuUrl}", "${menu_img[i].filename}", "${data.restaurant_id}", "${datetime}")`;
                // console.log({ arr_sql: sql });
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
     ("${data.restaurant_id}", "${data.menu_id}", "${data.break_check}", "${data.MenuUrl}", "${menu_img}", "${data.restaurant_id}", "${datetime}")`;
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
            sql = `UPDATE td_menu_image SET active_flag = "${data.break_check}", menu_url = "${data.MenuUrl}", modified_by = "${data.restaurant_id}", modified_dt = "${datetime}"
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
    }
    var chk_dt = await Check_Data(db_name = 'td_menu_image', whr = `WHERE restaurant_id = "${data.restaurant_id}" AND menu_id = "${data.menu_id}"`);
    if (chk_dt > 1) {
        sql = `INSERT INTO td_menu_image (restaurant_id, menu_id, active_flag, menu_url, created_by, created_dt) VALUES
     ("${data.restaurant_id}", "${data.menu_id}", "${data.break_check}", "${data.MenuUrl}", "${data.restaurant_id}", "${datetime}")`;
    } else {
        sql = `UPDATE td_menu_image SET active_flag = "${data.break_check}", menu_url = "${data.MenuUrl}", modified_by = "${data.restaurant_id}", modified_dt = "${datetime}"
        WHERE restaurant_id = "${data.restaurant_id}" AND menu_id = "${data.menu_id}"`;
    }
    db.query(sql, (err, lastId) => {
        if (err) {
            console.log(err);
            res = false;
        } else {
            res = true;
        }
    })
}

const SectionImageSave = async (data, sec_img) => {
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = '';

    if (Array.isArray(sec_img)) {
        for (let i = 0; i < sec_img.length; i++) {
            let menu_data = await F_Select(`SELECT * FROM td_section_image_request WHERE restaurant_id = "${data.restaurant_id}" AND menu_id = "${data.menu_id}" AND sec_img = "${sec_img[i].filename}"`);
            if (menu_data.msg.length < 1) {
                sql = `INSERT INTO td_section_image_request (restaurant_id, menu_id, active_flag, sec_img, sec_url, created_by, created_dt) VALUES
        ("${data.restaurant_id}", "${data.menu_id}", "${data.break_check}", "${sec_img[i].filename}", "${data.SectionUrl}", "${data.restaurant_id}", "${datetime}")`;
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
        if (sec_img) {
            let menu_data = await F_Select(`SELECT * FROM td_section_image_request WHERE restaurant_id = "${data.restaurant_id}" AND menu_id = "${data.menu_id}" AND sec_img = "${sec_img}"`);
            if (menu_data.msg.length < 1) {
                sql = `INSERT INTO td_section_image_request (restaurant_id, menu_id, active_flag, sec_img, sec_url, created_by, created_dt) VALUES
            ("${data.restaurant_id}", "${data.menu_id}", "${data.break_check}", "${sec_img}", "${data.SectionUrl}", "${data.restaurant_id}", "${datetime}")`;
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
            sql = `UPDATE td_section_image_request SET active_flag = "${data.break_check}", sec_img = "${sec_img}", sec_url = "${data.SectionUrl}", modified_by = "${data.restaurant_id}", modified_dt = "${datetime}"
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
    var chk_dt = await Check_Data(db_name = 'td_section_image_request', whr = `WHERE restaurant_id = "${data.restaurant_id}" AND menu_id = "${data.menu_id}"`);
    if (chk_dt > 1) {
        sql = `INSERT INTO td_section_image_request (restaurant_id, menu_id, active_flag, sec_url, created_by, created_dt) VALUES
    ("${data.restaurant_id}", "${data.menu_id}", "${data.break_check}", "${data.SectionUrl}", "${data.restaurant_id}", "${datetime}")`;
    } else {
        sql = `UPDATE td_section_image_request SET active_flag = "${data.break_check}", sec_url = "${data.SectionUrl}", modified_by = "${data.restaurant_id}", modified_dt = "${datetime}"
        WHERE restaurant_id = "${data.restaurant_id}" AND menu_id = "${data.menu_id}"`;
    }
    // sql = `UPDATE td_section_image_request SET active_flag = "${data.break_check}", sec_img = "${sec_img}", sec_url = "${data.SectionUrl}", modified_by = "${data.restaurant_id}", modified_dt = "${datetime}"
    // WHERE restaurant_id = "${data.restaurant_id}" AND menu_id = "${data.menu_id}"`;
    db.query(sql, (err, lastId) => {
        if (err) {
            console.log(err);
            res = false;
        } else {
            res = true;
        }
    })
    // var chk_dt = await Check_Data(db_name = 'td_section_image_request', whr = `WHERE restaurant_id = "${data.restaurant_id}" AND menu_id = "${data.menu_id}"`);
    // if (chk_dt > 1) {
    //     sql = `INSERT INTO td_section_image_request (restaurant_id, menu_id, active_flag, sec_img, sec_url, created_by, created_dt) VALUES
    // ("${data.restaurant_id}", "${data.menu_id}", "${data.break_check}", "${sec_img}", "${data.SectionUrl}", "${data.restaurant_id}", "${datetime}")`;
    // } else {
    //     sql = `UPDATE td_section_image_request SET active_flag = "${data.break_check}", sec_img = "${sec_img}", sec_url = "${data.SectionUrl}", modified_by = "${data.restaurant_id}", modified_dt = "${datetime}"
    //     WHERE restaurant_id = "${data.restaurant_id}" AND menu_id = "${data.menu_id}"`;
    // }
    // console.log({ sec: sql });
    // // var sql = `INSERT INTO td_section_image_request (restaurant_id, menu_id, active_flag, sec_img, sec_url, created_by, created_dt) VALUES
    // // ("${data.restaurant_id}", "${data.menu_id}", "${data.break_check}", "${sec_img}" "${data.SectionUrl}", "${data.restaurant_id}", "${datetime}")`;
    // return new Promise((resolve, reject) => {
    //     db.query(sql, (err, lastId) => {
    //         if (err) {
    //             console.log(err);
    //             data = false;
    //         } else {
    //             data = true;
    //         }
    //     })
    //     resolve(data)
    // })
}

const MonthDateSave = async (data) => {

    var sql = '',
        res = true;
    await DeleteDatetime(data);
    return new Promise((resolve, reject) => {
        var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
        data.month_day.forEach(async d => {
            if (d.dt > 0) {
                var chk_dt = await Check_Data(db_name = 'td_date_time', whr = `WHERE restaurant_id = "${data.restaurant_id}" AND menu_id = "${data.menu_id}" AND month_day = "${d.dt}"`);
                if (chk_dt > 1) {
                    sql = `INSERT INTO td_date_time (restaurant_id, menu_id, active_flag, month_day, start_time, end_time, created_by, created_dt) VALUES 
                    ("${data.restaurant_id}", "${data.menu_id}", "${data.break_check}", "${d.dt}", "${data.start_time}", "${data.end_time}", "${data.restaurant_id}", "${datetime}")`;
                } else {
                    sql = `UPDATE td_date_time SET start_time = "${data.start_time}", end_time = "${data.end_time}", modified_by = "${data.restaurant_id}", modified_dt = "${datetime}" 
                    WHERE restaurant_id = "${data.restaurant_id}" AND menu_id = "${data.menu_id}" AND month_day = "${d.dt}"`;
                }
                db.query(sql, (err, lastId) => {
                    if (err) {
                        console.log(err);
                        res = false;
                    } else {
                        res = true;
                    }
                })
            }
        })
        resolve(res);
    })
}

const DeleteDatetime = (data) => {
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
    var sql = `DELETE FROM td_date_time WHERE restaurant_id = "${data.restaurant_id}" AND menu_id = "${data.menu_id}" AND month_day NOT IN(${v1})`;
    db.query(sql, (err, lastId) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Deleted Date-Time");
        }
    })
}

const LogoSave = async (data, logo_img) => {
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var chk_dt = await Check_Data(db_name = 'td_logo', whr = `WHERE restaurant_id = "${data.restaurant_id}"`);
    var sql = '';
    if (chk_dt > 1) {
        sql = `INSERT INTO td_logo (restaurant_id, logo_url, logo_path, created_by, created_dt) VALUES
        ("${data.restaurant_id}", "${data.logo}", "${logo_img}", "${data.restaurant_id}", "${datetime}")`;
    } else if (chk_dt == 1) {
        sql = `UPDATE td_logo SET logo_url = "${data.logo}", logo_path = "${logo_img}", modified_by = "${data.restaurant_id}", modified_dt = "${datetime}"
        WHERE restaurant_id = "${data.restaurant_id}"`;
    }
    console.log(sql);
    // var sql = `INSERT INTO td_logo (restaurant_id, logo_url, created_by, created_dt) VALUES 
    // ("${data.restaurant_id}", "${data.logo}", "${data.restaurant_id}", "${datetime}")`;

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

const AboutUsSave = async (data) => {
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var chk_dt = await Check_Data(db_name = 'td_about', whr = `WHERE restaurant_id = "${data.restaurant_id}"`);
    var sql = '';
    if (chk_dt > 1) {
        sql = `INSERT INTO td_about (restaurant_id, about_us, created_by, created_dt) VALUES 
        ("${data.restaurant_id}", "${data.aboutus}", "${data.restaurant_id}", "${datetime}")`;
    } else if (chk_dt == 1) {
        sql = `UPDATE td_about SET about_us = "${data.aboutus}", modified_by = "${data.restaurant_id}", modified_dt = "${datetime}" WHERE restaurant_id = "${data.restaurant_id}"`;
    }

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

const NoticeSave = async (data) => {
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    let chk_dt = await Check_Data(db_name = 'td_menu_notice', whr = `WHERE restaurant_id = "${data.restaurant_id}" AND menu_id = "${data.menu}"`);
    var sql = '';
    if (chk_dt > 1) {
        sql = `INSERT INTO td_menu_notice (restaurant_id, menu_id, notice_flag, position_id, header_title, font_color, back_color, notice_content, created_by, created_dt) VALUES 
    ("${data.restaurant_id}", "${data.menu}", "${data.notice_flag}", "${data.position}", "${data.headertitle}", "${data.fontcolor}", "${data.back_color}", "${data.notice}", "${data.restaurant_id}", "${datetime}")`;
    } else {
        sql = `UPDATE td_menu_notice SET notice_flag = "${data.notice_flag}", position_id = "${data.position}",
         header_title = "${data.headertitle}", font_color = "${data.fontcolor}", back_color = "${data.back_color}", notice_content = "${data.notice}", 
         modified_by = "${data.restaurant_id}", modified_dt = "${datetime}" WHERE restaurant_id = "${data.restaurant_id}" AND menu_id = "${data.menu}"`;
    }

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

const F_Select = (sql) => {
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) };
            } else {
                data = { suc: 1, msg: result };
            }
            resolve(data)
        })
    })
}

const Check_Data = (db_name, whr) => {
    let sql = `SELECT * FROM ${db_name} ${whr}`;
    // console.log({ sql });
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                data = 0;
            } else {
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

const SectionSave = (data, sec_img) => {
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = '',
        up_fild = '',
        in_field = '';
    if (data.id > 0) {
        up_fild = sec_img != '' ? `, section_img = "${sec_img}"` : '';
        sql = `UPDATE md_section SET menu_id = "${data.menu_id}", section_name = "${data.sec_name}" ${up_fild}, modified_by = "${data.restaurant_id}", modified_dt = "${datetime}"
        WHERE id = "${data.id}"`;
    } else {
        in_field = sec_img != '' ? sec_img : ''
        sql = `INSERT INTO md_section (restaurant_id, menu_id, section_name, section_img, created_by, created_dt) VALUES
        ("${data.restaurant_id}", "${data.menu_id}", "${data.sec_name}", "${in_field}", "${data.restaurant_id}", "${datetime}")`;
    }
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) };
            } else {
                data = { suc: 1, msg: 'Inserted Successfully !!' };
            }
            resolve(data)
        })
    })
}

const ItemSave = (data) => {
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = '';
    if (data.id > 0) {
        sql = `UPDATE md_items SET menu_id = "${data.menu_id}", section_id = "${data.sec_id}", item_name = "${data.item_name}", modified_by = "${data.restaurant_id}", modified_dt = "${datetime}"
        WHERE id = "${data.id}"`;
    } else {
        sql = `INSERT INTO md_items (restaurant_id, menu_id, section_id, item_name, created_by, created_dt)
     VALUES ("${data.restaurant_id}", "${data.menu_id}", "${data.sec_id}", "${data.item_name}", "${data.restaurant_id}", "${datetime}")`;
    }
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) };
            } else {
                data = { suc: 1, msg: 'Inserted Successfully !!' };
            }
            resolve(data)
        })
    })
}

const ItemPriceSave = (data) => {
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = '';
    if (data.id > 0) {
        sql = `UPDATE md_item_description SET menu_id = "${data.menu_id}", section_id = "${data.sec_id}", item_id = "${data.item_id}", item_price = "${data.item_price}", 
        item_desc = "${data.item_desc}", item_note = "${data.item_note}", note_color = "${data.note_color}", note_back_color = "${data.note_back_color}", modified_by = "${data.restaurant_id}", modified_dt = "${datetime}"
        WHERE id = "${data.id}"`;
    } else {
        sql = `INSERT INTO md_item_description (restaurant_id, menu_id, section_id, item_id, item_price, item_desc, item_note, note_color, note_back_color, created_by, created_dt)
    VALUES ("${data.restaurant_id}", "${data.menu_id}", "${data.sec_id}", "${data.item_id}", "${data.item_price}", "${data.item_desc}", "${data.item_note}", "${data.note_color}", "${data.note_back_color}", "${data.restaurant_id}", "${datetime}")`;
    }

    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) };
            } else {
                data = { suc: 1, msg: 'Inserted Successfully !!' };
            }
            resolve(data)
        })
    })
}

const create = async (dataForQRcode, center_image, width, cwidth, data) => {
    const canvas = createCanvas(width, width);
    QRCode.toCanvas(
        canvas,
        dataForQRcode,
        {
            errorCorrectionLevel: "H",
            margin: 1,
            color: {
                dark: "#2196F3",
                light: "#ffffff",
            },
        }
    );

    const ctx = canvas.getContext("2d");
    const img = await loadImage(api_url + center_image);
    const center = (width - cwidth) / 2;
    let img_name = data.res_id + '_qr.png';
    let path = 'uploads/' + img_name;
    ctx.drawImage(img, center, center, cwidth, cwidth);
    const out = fs.createWriteStream(path);
    const stream = canvas.createPNGStream();
    stream.pipe(out)
    // const buffer = canvas.toBuffer("image/png");
    // fs.writeFileSync(path, buffer)
    return new Promise((resolve, reject) => {
        resolve({ path, img_name });
    })
    // return canvas.toDataURL("image/png");
}

const GenerateQr = async (data) => {
    const qrCode = await create(
        data.url,
        data.img,
        150,
        50,
        data
    );
    let chk_dt = await Check_Data(db_name = 'md_url', whr = `WHERE restaurant_id = "${data.res_id}"`);
    var sql = '';
    if (chk_dt > 1) {
        sql = `INSERT INTO md_url (restaurant_id, url, image) VALUES ("${data.res_id}", "${data.url}", "${qrCode.img_name}")`;
    } else {
        sql = `UPDATE md_url SET url = "${data.url}", image = "${qrCode.img_name}" WHERE restaurant_id = "${data.res_id}"`;
    }
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) };
            } else {
                data = { suc: 1, msg: 'Inserted Successfully !!' };
            }
            // console.log(data);
            resolve(data)
        })
    })
    // let ckh_sql = `SELECT * FROM md_url WHERE `;
}

const AddMenu = (data) => {
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = '',
        id = data.id;
    if (id > 0) {
        sql = `UPDATE md_menu SET menu_description = "${data.menu_name}", modified_by = "${data.user}", modified_dt = "${datetime}" WHERE restaurant_id = "${res_id}" AND id = ${id}`;
    } else {
        sql = `INSERT INTO md_menu (menu_description, restaurant_id, created_by, created_dt) VALUES 
    ("${data.menu_name}", "${data.res_id}", "${data.user}", "${datetime}")`;
    }
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) };
            } else {
                data = { suc: 1, msg: 'Inserted Successfully !!' };
            }
            resolve(data);
        })
    })
}

const DeleteMenuAdditional = (id) => {
    var data = '';
    return new Promise((resolve, reject) => {
        if (id > 0) {
            let sql = `DELETE md_menu WHERE id = ${id}`;
            db.query(sql, (err, lastId) => {
                if (err) {
                    console.log(err);
                    data = { suc: 0, msg: JSON.stringify(err) };
                } else {
                    data = { suc: 1, msg: 'Deleted Successfully !!' };
                }
                resolve(data);
            })
        } else {
            data = { suc: 0, msg: 'Id can not be 0' };
            resolve()
        }
    })
}

module.exports = {
    BreakfastSave, MenuSave, LogoSave, AboutUsSave, NoticeSave, F_Select, MonthDateSave, SectionSave, ItemSave, ItemPriceSave, GenerateQr, MenuImageSave, OtherImageSave, SectionImageSave, Check_Data, AddMenu, DeleteMenuAdditional
};