const express = require('express')
const upload = require('express-fileupload')
const fs = require('fs');
const { MenuImageSave, SectionImageSave, OtherImageSave, MonthDateSave, LogoSave } = require('../modules/MenuSetupModule');
const TestRouter = express.Router();
// const db = require('./db')

TestRouter.use(upload());

var dir = 'public';
var subDir = "public/uploads";

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);

    fs.mkdirSync(subDir);
}

TestRouter.post('/testing', async (req, res) => {
    console.log({ bd: req.body });

    let res_name = req.body.restaurant_name.replace(' ', '_');
    let menu_name = req.body.menu_id == 1 ? 'breakfast' : (req.body.menu_id == 2 ? 'lunch' : (req.body.menu_id == 3 ? 'dinner' : (req.body.menu_id == 4 ? 'brunch' : 'special')));
    // var upload_cover_top = await UploadCover(req.files.cov_img, req.files.top_img, menu_name, res_name, req.body),
    //     upload_sec = await UploadSection(req.files.section_img, menu_name, res_name, req.body),
    //     upload_menu = await UploadMenu(req.files.menu_img, menu_name, res_name, req.body);
    var upload_cover_top = await UploadCover(req.files.cov_img, req.files.top_img, menu_name, res_name, req.body),
        upload_sec = await UploadSection(menu_name, res_name, req.body),
        upload_menu = await UploadMenu(menu_name, res_name, req.body);
    // month_day_save = await MonthDateSave(req.body);
    if (upload_cover_top && upload_sec && upload_menu) {
        res.send({ suc: 1, msg: 'Success' });
    } else {
        res.send({ suc: 0, msg: 'Not Inserted' });
    }
})

const UploadCover = async (menu_name, res_name, data) => {
    var top_file_path = '',
        cov_file_path = '';
    if (cov_img && top_img) {
        var cov_file = cov_img;
        var top_file = top_img;
        var filename = cov_file.name,
            top_fl_name = top_img.name,
            top_file_ext = top_fl_name.split('.')[1],
            top_file_name = "top." + top_file_ext;
        top_file_path = "uploads/" + top_file_name;
        let file_ext = filename.split('.')[1];
        var ResIdPath = "uploads/";
        var UploadsPath = ResIdPath + "/" + menu_name;
        var cov_file_name = "cover." + file_ext;
        cov_file_path = "uploads/" + cov_file_name;

        if (!fs.existsSync(ResIdPath)) {
            fs.mkdirSync(ResIdPath);
            fs.mkdirSync(UploadsPath);
        } else {
            if (!fs.existsSync(UploadsPath)) {
                fs.mkdirSync(UploadsPath);
            }
        }
        // console.log(filename);

        cov_file.mv(UploadsPath + cov_file_name, async (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Other Image Cover Uploaded');
            }
        })

        top_file.mv(UploadsPath + top_file_name, async (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Other Image Top Uploaded');
            }
        })

        // return new Promise(async (resolve, reject) => {
        //     if (await MenuImageSave(data, cov_file_path, top_file_path)) {
        //         res = true;
        //     } else {
        //         res = false
        //     }
        //     resolve(res);
        // })
    }

    return new Promise(async (resolve, reject) => {
        if (await MenuImageSave(data, cov_file_path, top_file_path)) {
            res = true;
        } else {
            res = false
        }
        resolve(res);
    })
}

const UploadSection = async (menu_name, res_name, data) => {
    var file_path = '';
    // if (sec_img) {
    //     // console.log();
    //     var sec_file = sec_img,
    //         // filename = sec_file.name,
    //         // file_ext = filename.split('.')[1],
    //         ResIdPath = "public/uploads/" + res_name,
    //         UploadsPath = ResIdPath + "/" + menu_name + "/";
    //     // file_path = "uploads/" + res_name + "/" + menu_name + "/section/" + file_name;

    //     if (!fs.existsSync(ResIdPath)) {
    //         fs.mkdirSync(ResIdPath);
    //         fs.mkdirSync(UploadsPath);
    //     } else {
    //         if (!fs.existsSync(UploadsPath)) {
    //             fs.mkdirSync(UploadsPath);
    //         }
    //     }
    //     if (Array.isArray(sec_img)) {
    //         sec_file.forEach(dt => {
    //             var file = dt;
    //             var filename = file.name;
    //             // file_name = filename.split('.')[0] + '_' + new Date() + '.' + filename.split('.')[1],
    //             file_path = "uploads/" + res_name + "/" + menu_name + "/" + filename;
    //             // console.log(filename);

    //             file.mv(UploadsPath + filename, async (err) => {
    //                 if (err) {
    //                     console.log(`${filename} not uploaded`);
    //                 } else {
    //                     console.log(`Successfully ${filename} uploaded`);
    //                     // await SectionImageSave(data, file_path);
    //                 }
    //             })
    //             // return new Promise((resolve, reject) => {
    //             //     resolve(true);
    //             // });
    //         })
    //     } else {
    //         var filename = sec_file.name,
    //             // file_name = filename.split('.')[0] + '_' + new Date() + '.' + filename.split('.')[1],
    //             file_path = "uploads/" + res_name + "/" + menu_name + "/" + filename;
    //         // console.log(filename);

    //         sec_file.mv(UploadsPath + filename, async (err) => {
    //             if (err) {
    //                 console.log(`${filename} not uploaded`);
    //             } else {
    //                 console.log(`Successfully ${filename} uploaded`);
    //                 console.log(data);
    //                 // await SectionImageSave(data, file_path);
    //             }
    //         })
    //         // return new Promise((resolve, reject) => {
    //         //     resolve(true);
    //         // });
    //     }


    // }

    return new Promise(async (resolve, reject) => {
        if (await SectionImageSave(data, file_path)) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
}

const UploadMenu = async (menu_name, res_name, data) => {
    var file_path = '';
    // if (menu_img) {
    //     var sec_file = menu_img,
    //         // filename = sec_file.name,
    //         // file_ext = filename.split('.')[1],
    //         ResIdPath = "public/uploads/" + res_name,
    //         UploadsPath = ResIdPath + "/" + menu_name + "/";
    //     // file_path = "uploads/" + res_name + "/" + menu_name + "/section/" + file_name;

    //     if (!fs.existsSync(ResIdPath)) {
    //         fs.mkdirSync(ResIdPath);
    //         fs.mkdirSync(UploadsPath);
    //     } else {
    //         if (!fs.existsSync(UploadsPath)) {
    //             fs.mkdirSync(UploadsPath);
    //         }
    //     }
    //     if (Array.isArray(sec_file)) {
    //         sec_file.forEach(dt => {
    //             var file = dt;
    //             var filename = file.name;
    //             // file_name = filename.split('.')[0] + '_' + new Date() + '.' + filename.split('.')[1],
    //             file_path = "uploads/" + res_name + "/" + menu_name + "/" + filename;
    //             // console.log(filename);

    //             file.mv(UploadsPath + filename, async (err) => {
    //                 if (err) {
    //                     console.log(`${filename} not uploaded`);
    //                 } else {
    //                     console.log(`Successfully ${filename} uploaded`);
    //                     // await OtherImageSave(data, file_path);
    //                 }
    //             })
    //             // return new Promise((resolve, reject) => {
    //             //     resolve(true);
    //             // });
    //         })
    //     } else {
    //         var filename = sec_file.name,
    //             // file_name = filename.split('.')[0] + '_' + new Date() + '.' + filename.split('.')[1],
    //             file_path = "uploads/" + res_name + "/" + menu_name + "/" + filename;
    //         // console.log(filename);

    //         sec_file.mv(UploadsPath + filename, async (err) => {
    //             if (err) {
    //                 console.log(`${filename} not uploaded`);
    //             } else {
    //                 console.log(`Successfully ${filename} uploaded`);
    //                 // await OtherImageSave(data, file_path);
    //             }
    //         })
    //         // return new Promise((resolve, reject) => {
    //         //     resolve(true);
    //         // });
    //     }

    // }
    return new Promise(async (resolve, reject) => {
        if (await OtherImageSave(data, file_path)) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
}

TestRouter.post('/logo', async (req, res) => {
    console.log({ body: req.body, fl: req.files, req });
    let res_name = req.body.restaurant_name.replace(' ', '_');
    // var data = await UploadLogo(req.files.logo_img, res_name, req.body);
    var data = await UploadLogo(res_name, req.body);
    res.send(data);
})

const UploadLogo = async (res_name, data) => {
    var dt = '',
        file_path = '';
    // if (logo_img) {
    //     var file = logo_img;
    //     var filename = file.name,
    //         file_ext = filename.split('.')[1],
    //         file_name = "logo." + file_ext,
    //         file_path = "uploads/" + res_name + "/" + file_name;
    //     var ResIdPath = "public/uploads/" + res_name + "/";

    //     if (!fs.existsSync(ResIdPath)) {
    //         fs.mkdirSync(ResIdPath);
    //     }

    //     file.mv(ResIdPath + file_name, async (err) => {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             console.log('Logo Uploaded ' + file_path);
    //         }
    //     })

    //     // return new Promise(async (resolve, reject) => {
    //     //     dt = await LogoSave(data, file_path)
    //     //     resolve(dt);
    //     // })

    // }

    return new Promise(async (resolve, reject) => {
        dt = await LogoSave(data, file_path)
        resolve(dt);
    })
}

TestRouter.post('/t', (req, res) => {
    console.log(req.body);
    var dt = req.body;
    // var dt = {
    //     coverurl: 'asdsadasd',
    //     topurl: '123.com',
    //     MenuUrl: 'asdsad',
    //     SectionUrl: 'asdsa',
    //     restaurant_id: '55',
    //     menu_id: '3',
    //     break_check: 'Y',
    //     start_time: '22:11',
    //     end_time: '22:11',
    //     month_day: [
    //         { dt: 2 },
    //         { dt: 3 },
    //         { dt: 0 },
    //         { dt: 5 },
    //         { dt: 0 },
    //         { dt: 7 },
    //         { dt: 8 }
    //     ]
    // };
    var v = '',
        v1 = '';
    for (let i = 0; i < dt.month_day.length; i++) {
        if (dt.month_day[i].dt > 0) {
            v = dt.month_day[i].dt;
            if (v1 != '') {
                v1 = v + ',' + v1;
            } else {
                v1 = v;
            }
        }
    }
    var sql = `DELETE FROM td_date_time WHERE restaurant_id = "${dt.restaurant_id}" AND menu_id = "${dt.menu_id}" AND month_day NOT IN(${v1})`;
    // db.query(sql, (err, lastId) => {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log("Deleted Date-Time");
    //     }
    // })
    console.log(sql);
    res.send(v1)
})

module.exports = { TestRouter, UploadLogo };