const express = require('express');
const AdmZip = require('adm-zip');
const fs = require('fs');
const { PackageSave, GetPackageData, PromoSave, GetResult, HolderClingSave, UpdateApproval, F_Delete, SaveEmailBody, SaveMenuInfo, ConfigMenu, DelRes, HelpTextSave, OtherText, OrderConfSave, GenerateBitlyUrl } = require('../modules/AdminModule');
const { F_Select } = require('../modules/MenuSetupModule');
const AdmRouter = express.Router();

AdmRouter.post('/package', async (req, res) => {
    var data = await PackageSave(req.body);
    res.send(data);
});

AdmRouter.get('/package', async (req, res) => {
    var data = await GetPackageData(req.body);
    res.send(data);
})

AdmRouter.post('/promo', async (req, res) => {
    var data = await PromoSave(req.body);
    res.send(data);
})

AdmRouter.get('/promo', async (req, res) => {
    var data = await GetResult(tb_name = 'md_promo_calander');
    res.send(data)
})

AdmRouter.post('/holder_cling', async (req, res) => {
    var data = await HolderClingSave(req.body);
    res.send(data);
})

AdmRouter.get('/holder_cling', async (req, res) => {
    var data = await GetResult(tb_name = 'md_holder_cling');
    res.send(data);
})

AdmRouter.get('/update_approval', async (req, res) => {
    var data = await UpdateApproval(req.query.flag, req.query.res_id);
    res.send(data);
})

AdmRouter.get('/res_menu', async (req, res) => {
    let special_menu_id = 5;
    var sql = `SELECT a.menu_id, b.menu_description as menu_name, a.active_flag FROM td_other_image a, md_menu b WHERE a.menu_id=b.id AND a.restaurant_id = "${req.query.id}" AND a.active_flag="Y"`;
    var data = await F_Select(sql);
    var special_sql = `SELECT IF(count(*) > 0, 'Y', 'N') AS special_flag FROM td_menu_image WHERE restaurant_id = "${req.query.id}" AND menu_id = "${special_menu_id}"`;
    var special_data = await F_Select(special_sql);
    var special_flag = special_data.msg[0].special_flag;
    // console.log(special_data.msg[0].special_flag);
    console.log(data.msg.push({ "menu_id": 5, "menu_name": "Special", "active_flag": special_flag }));
    res.send(data);
})

AdmRouter.get('/download_section', async (req, res) => {
    var res_id = req.query.id,
        menu_id = req.query.menu_id;
    let res_sql = `SELECT * FROM td_contacts WHERE id = "${res_id}"`;
    let res_dtls = await F_Select(res_sql);
    var res_name = res_dtls.msg[0].restaurant_name,
        downloadFileName = res_name + '_' + menu_id + '_' + Date.now() + '.zip';
    const zip = new AdmZip();
    var sql = `SELECT * FROM td_section_image_request WHERE restaurant_id = "${res_id}" AND menu_id = "${menu_id}"`;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            result.forEach(dt => {
                var path = "uploads/" + dt.sec_img;
                zip.addLocalFile(path);
                // console.log(path);
            })
            // const downloadFileName = `${req.query.id}.zip`;

            fs.writeFileSync(downloadFileName, zip.toBuffer());
            res.send(zip.toBuffer());
            // res.download(downloadFileName, (err) => {
            //     if (err) {
            //         console.log(err);
            //         res.send('Frror');
            //     }
            // })
        }
    })
})

AdmRouter.get('/download_cov', async (req, res) => {
    var res_id = req.query.id;
    let res_sql = `SELECT * FROM td_contacts WHERE id = "${res_id}"`;
    let res_dtls = await F_Select(res_sql);
    var res_name = res_dtls.msg[0].restaurant_name,
        downloadFileName = res_name + '_' + Date.now() + '.zip';
    const zip = new AdmZip();
    var logo_sql = `SELECT * FROM td_logo WHERE restaurant_id = "${res_id}"`,
        logo_dt = await F_Select(logo_sql),
        logo_path = 'uploads/' + logo_dt.msg[0].logo_path;
    zip.addLocalFile(logo_path);
    var sql = `SELECT * FROM td_other_image WHERE restaurant_id = "${res_id}"`;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            result.forEach(dt => {
                var cov_path = "uploads/" + dt.cover_page_img,
                    top_path = "uploads/" + dt.top_image_img;
                zip.addLocalFile(cov_path);
                zip.addLocalFile(top_path);
                // console.log(path);
            })
            // const downloadFileName = `${req.query.id}.zip`;

            fs.writeFileSync(downloadFileName, zip.toBuffer());
            res.send(zip.toBuffer());
            // res.download(downloadFileName, (err) => {
            //     if (err) {
            //         console.log(err);
            //         res.send('Frror');
            //     }
            // })
        }
    })
})

AdmRouter.get('/delete_sec', async (req, res) => {
    var id = req.query.id,
        db_name = 'md_section',
        whr = `WHERE id = ${id}`;
    var data = await F_Delete(db_name, whr);
    res.send(data);
})

AdmRouter.get('/delete_item', async (req, res) => {
    var id = req.query.id,
        db_name = 'md_items',
        whr = `WHERE id = ${id}`;
    var data = await F_Delete(db_name, whr);
    res.send(data);
})

AdmRouter.get('/delete_price_desc', async (req, res) => {
    var id = req.query.id,
        db_name = 'md_item_description',
        whr = `WHERE id = ${id}`;
    var data = await F_Delete(db_name, whr);
    res.send(data);
})

AdmRouter.post('/email_body', async (req, res) => {
    var body = req.body;
    var data = await SaveEmailBody(body);
    res.send(data);
})

AdmRouter.get('/email_body', async (req, res) => {
    var id = req.query.id;
    var whr = id > 0 ? `AND a.email_type_id = ${id}` : '';
    var sql = `SELECT a.* FROM md_config_email a, md_email_type b WHERE a.email_type_id=b.id ${whr}`;
    var data = await F_Select(sql);
    res.send(data);
})

AdmRouter.get('/get_email_type', async (req, res) => {
    var sql = `SELECT * FROM md_email_type`;
    var data = await F_Select(sql);
    res.send(data);
})

AdmRouter.get('/get_menu_dtls', async (req, res) => {
    var id = req.query.id,
        res_id = req.query.res_id;
    // id = 0 -> REGULAR || 1 -> UNLIMITED || 2 -> CUSTOM || '' -> ALL //
    // var whr = id == 0 ? `WHERE menu_flag = 'R'` : (id == 1 ? `WHERE menu_flag = 'U'` : (id == 2 ? `WHERE menu_flag = 'C'` : ''));

    // var whr = id >= 0 ? `WHERE id = ${id} AND restaurant_id = 0` : `WHERE restaurant_id = ${res_id}`;
    var whr = id > 0 ? `WHERE id = ${id} AND restaurant_id = 0` : `WHERE restaurant_id = 0`;
    let sql = `SELECT * FROM md_menu ${whr}`;
    var data = await F_Select(sql);
    res.send(data);
})

AdmRouter.post('/get_menu_dtls', async (req, res) => {
    var data = req.body;
    var dt = await SaveMenuInfo(data);
    res.send(dt);
})

AdmRouter.get('/config_menu', async (req, res) => {
    let sql = `SELECT * FROM md_config_menu`;
    var data = await F_Select(sql);
    res.send(data);
})

AdmRouter.post('/config_menu', async (req, res) => {
    var data = req.body;
    var dt = await ConfigMenu(data);
    res.send(dt);
})

AdmRouter.get('/del_res', async (req, res) => {
    var res_id = req.query.id;
    var data = await DelRes(res_id);
    res.send(data);
})

AdmRouter.post('/help_text', async (req, res) => {
    var data = req.body;
    var dt = await HelpTextSave(data);
    res.send(dt);
})

AdmRouter.get('/help_text', async (req, res) => {
    let sql = `SELECT * FROM md_config_inst`;
    var data = await F_Select(sql);
    res.send(data);
})

AdmRouter.post('/other_text', async (req, res) => {
    var data = req.body;
    var dt = await OtherText(data);
    res.send(dt);
})

AdmRouter.post('/order_conf', async (req, res) => {
    var data = req.body;
    var dt = await OrderConfSave(data);
    res.send(dt);
})

AdmRouter.post('/create_bitly_url', async (req, res) => {
    var url = req.body.url,
        res_id = req.body.res_id;
    var data = await GenerateBitlyUrl(url, res_id);
    res.send(data);
})

module.exports = { AdmRouter };