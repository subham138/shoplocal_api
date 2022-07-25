const express = require('express');
const { BreakfastSave, MenuSave, LogoSave, AboutUsSave, NoticeSave, F_Select, MonthDateSave, SectionSave, ItemSave, ItemPriceSave, GenerateQr, AddMenu, DeleteMenuAdditional } = require('../modules/MenuSetupModule');
const { TestRouter, UploadLogo } = require('./TestRoute');
const MenuSetRouter = express.Router();

MenuSetRouter.post('/menu_setup', async (req, res) => {
    console.log({ body: req.body[0] });
    var data = await MenuSave(req.body[0]);
    res.send(data);
})

// MenuSetRouter.post('/logo', async (req, res) => {
//     console.log({ body: req.body });
//     let res_name = req.body.restaurant_name.replace(' ', '_');
//     var data = await UploadLogo(req.files.logo_img, res_name, req.body);
//     res.send(data);
// })

MenuSetRouter.post('/aboutus', async (req, res) => {
    console.log({ body: req.body });
    var data = await AboutUsSave(req.body);
    res.send(data);
})

MenuSetRouter.post('/notice', async (req, res) => {
    console.log({ body: req.body });
    var data = await NoticeSave(req.body);
    res.send(data);
})

MenuSetRouter.get('/menu_setup', async (req, res) => {
    let id = req.query.id,
        menu_id = req.query.menu_id;
    let whr = menu_id ? `AND menu_id = "${menu_id}"` : '';
    // console.log(whr);
    // let sql = `SELECT b.logo_url, a.menu_id, a.cover_page_url, a.top_img_url, a.active_flag, c.menu_url
    //     FROM td_other_image a
    //     left JOIN td_logo b ON a.restaurant_id = b.restaurant_id
    //     left JOIN td_menu_image c ON a.restaurant_id = c.restaurant_id
    //     WHERE a.restaurant_id = "${id}"`;
    let oth_sql = `SELECT id, menu_id, active_flag, cover_page_img, cover_page_url, top_image_img, top_img_url FROM td_other_image WHERE restaurant_id = "${id}" ${whr}`;
    var oth_dt = await F_Select(oth_sql),
        logo_sql = `SELECT id, logo_url, logo_path FROM td_logo WHERE restaurant_id = "${id}"`,
        logo_dt = await F_Select(logo_sql),
        menu_sql = `SELECT id, menu_id, active_flag, menu_url, menu_img FROM td_menu_image WHERE restaurant_id = "${id}" ${whr}`,
        menu_dt = await F_Select(menu_sql)
    var data = { suc: 1, oth_dt: oth_dt.msg, logo_dt: logo_dt.msg, menu_dt: menu_dt.msg };
    res.send(data);
})

MenuSetRouter.get('/section_image', async (req, res) => {
    let res_id = req.query.id;
    let menu_id = req.query.menu_id;
    let sql = `SELECT id, menu_id, sec_url, sec_img FROM td_section_image_request WHERE restaurant_id = "${res_id}" AND menu_id = "${menu_id}" ORDER BY id`;
    var data = await F_Select(sql);
    res.send(data);
})

MenuSetRouter.get('/date_time', async (req, res) => {
    let res_id = req.query.id;
    let menu_id = req.query.menu_id;
    var data = '';
    let sql = '';
    if (menu_id != 5) {
        sql = `SELECT restaurant_id, menu_id, month_day, start_time, end_time FROM td_date_time WHERE restaurant_id = "${res_id}" AND menu_id = "${menu_id}"`;
        data = await F_Select(sql);
    } else {
        sql = `SELECT * FROM td_special_date_time WHERE restaurant_id = ${req.query.id}`;
        data = await F_Select(sql);
    }
    // console.log(data);
    res.send(data);
})

MenuSetRouter.post('/date_time', async (req, res) => {
    console.log(req.body);
    var dt = await MonthDateSave(req.body[0]);
    var data = dt ? { suc: 1, msg: 'Success' } : { suc: 0, msg: 'Not Inserted' }
    res.send(data);
    // res.send(data);
})

MenuSetRouter.get('/aboutus', async (req, res) => {
    let res_id = req.query.id;
    let sql = `SELECT * FROM td_about WHERE restaurant_id = "${res_id}"`;
    var data = await F_Select(sql);
    res.send(data);
})

// MenuSetRouter.post('/section', async (req, res) => {
//     console.log(req.body);
//     var data = await SectionSave(req.body);
//     res.send(data);
// })

MenuSetRouter.get('/section', async (req, res) => {
    let res_id = req.query.id;
    let menu_id = req.query.menu_id;
    let whr = menu_id > 0 ? `AND menu_id = "${menu_id}"` : ''
    let sql = `SELECT a.*, b.menu_description menu_name FROM md_section a, md_menu b WHERE a.menu_id=b.id AND a.restaurant_id = "${res_id}" ${whr}`;
    var data = await F_Select(sql);
    res.send(data);
})

MenuSetRouter.post('/items', async (req, res) => {
    console.log(req.body);
    var data = await ItemSave(req.body);
    res.send(data);
})

MenuSetRouter.get('/items', async (req, res) => {
    let res_id = req.query.id;
    let menu_id = req.query.menu_id;
    let sec_id = req.query.sec_id;
    let whr = menu_id > 0 && sec_id > 0 ? `AND a.menu_id = "${menu_id}" AND a.section_id = "${sec_id}"` : ''
    let sql = `SELECT a.*, b.menu_description menu_name FROM md_items a, md_menu b WHERE a.menu_id=b.id AND a.restaurant_id = "${res_id}" ${whr}`;
    var data = await F_Select(sql);
    res.send(data);
})

MenuSetRouter.post('/item_price', async (req, res) => {
    console.log(req.body);
    var data = await ItemPriceSave(req.body);
    res.send(data);
})

MenuSetRouter.get('/item_price', async (req, res) => {
    var res_id = req.query.id;
    let sql = `SELECT a.*, b.item_name, c.menu_description menu_name FROM md_item_description a, md_items b, md_menu c WHERE a.item_id=b.id AND a.menu_id = c.id AND a.restaurant_id = "${res_id}"`;
    var data = await F_Select(sql);
    res.send(data);
})

MenuSetRouter.get('/notice', async (req, res) => {
    var res_id = req.query.id;
    var menu_id = req.query.menu_id;
    var whr = menu_id > 0 ? `AND menu_id = "${menu_id}"` : '';
    let sql = `SELECT * FROM td_menu_notice WHERE restaurant_id = "${res_id}" ${whr}`;
    var data = await F_Select(sql);
    res.send(data);
})

MenuSetRouter.get('/res_details', async (req, res) => {
    var res_id = req.query.id;
    let whr = res_id > 0 ? `WHERE a.id = "${res_id}"` : '';
    let sql = `SELECT a.*, c.setup_fee, c.monthly_fee, d.approval_flag, e.name as country FROM td_contacts a
                LEFT JOIN td_order_items b ON a.id=b.restaurant_id
                LEFT JOIN md_package c ON b.package_id=c.pakage_name
                LEFT JOIN md_url d ON a.id=d.restaurant_id
                JOIN md_country e ON a.country = e.id ${whr}`;
    var data = await F_Select(sql);
    res.send(data);
})

MenuSetRouter.get('/res_dtls', async (req, res) => {
    var res_id = req.query.id;
    let whr = res_id > 0 ? `WHERE a.id = "${res_id}"` : '';
    let sql = `SELECT a.*, c.setup_fee, c.monthly_fee, d.approval_flag FROM td_contacts a
                JOIN td_order_items b ON a.id=b.restaurant_id
                JOIN md_package c ON b.package_id=c.pakage_name
                JOIN md_url d ON a.id=d.restaurant_id
                JOIN td_users e ON a.id = e.restaurant_id AND e.active_flag = "Y" ${whr}`;
    var data = await F_Select(sql);
    res.send(data);
})

MenuSetRouter.get('/get_url', async (req, res) => {
    var res_id = req.query.id;
    let sql = `SELECT * FROM md_url WHERE restaurant_id = "${res_id}"`;
    var data = await F_Select(sql);
    res.send(data);
})

MenuSetRouter.post('/generate_qr', async (req, res) => {
    console.log(req.body);
    var data = await GenerateQr(req.body);
    console.log(data);
    res.send(data);
})

MenuSetRouter.post('/add_menu', async (req, res) => {
    var data = req.body;
    var dt = await AddMenu(data);
    res.send(dt);
})

MenuSetRouter.get('/add_menu', async (req, res) => {
    var res_id = req.query.res_id;
    let sql = `SELECT * FROM md_menu WHERE restaurant_id = ${res_id}`;
    var data = await F_Select(sql);
    res.send(data);
})

MenuSetRouter.get('/delete_menu', async (req, res) => {
    var id = req.query.id;
    var data = await DeleteMenuAdditional(id);
    res.send(data);
})

module.exports = { MenuSetRouter };