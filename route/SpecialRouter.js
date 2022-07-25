const express = require('express');
const upload = require('express-fileupload')
const { F_Select } = require('../modules/MenuSetupModule');
const { SaveStockImg, DeleteStockImg, SaveSpecialMenuImg, SpecialMonthDateSave, SaveSpecialCatImg } = require('../modules/SpecialModule');
const SpecialRouter = express.Router();
const fs = require('fs');

SpecialRouter.use(upload());

SpecialRouter.get('/category_list', async (req, res) => {
    let sql = `SELECT * FROM md_special_category`;
    var data = await F_Select(sql);
    res.send(data);
})

SpecialRouter.get('/stock_img', async (req, res) => {
    var cat_id = req.query.cat_id;
    let whr = cat_id ? `WHERE img_catg = ${cat_id}` : '';
    let sql = `SELECT * FROM td_stock_image ${whr}`;
    var data = await F_Select(sql);
    res.send(data);
})

SpecialRouter.post('/stock_img', async (req, res) => {
    var stock_file_name = '',
        cat_id = req.body.cat_id,
        id = req.body.id > 0 ? req.body.id : 0,
        data = '';
    if (req.body.stock_img) {
        var stock_buffer = req.body.stock_img;
        stock_file_name = req.body.stock_filename;

        // console.log(ext);
        var stock_buffer_dt = stock_buffer.replace(/^data:image\/png;base64,/, "");
        stock_buffer_dt += stock_buffer_dt.replace('+', ' ');
        let stock_binaer_dt = new Buffer(stock_buffer_dt, 'base64').toString('binary');
        fs.writeFile("uploads/stock/" + stock_file_name, stock_binaer_dt, "binary", async (err) => {
            if (err) console.log(err);
            else {
                data = await SaveStockImg(stock_file_name, cat_id, id)
                res.send(data);
                // await LogoSave(data, filename);
            }
        });
    } else {
        data = { suc: 0, msg: 'No Image Selected' };
        res.send(data);
    }
})

SpecialRouter.get('/del_stock_img', async (req, res) => {
    var id = req.query.id;
    var data = await DeleteStockImg(id);
    res.send(data);
})


SpecialRouter.post('/special_date_time', async (req, res) => {
    var data = await SpecialMonthDateSave(req.body[0]);
    if (req.body[0].img_catg && req.body[0].img_path) {
        var cat_img = await SaveSpecialCatImg(req.body[0]);
    }
    res.send(data);
})

SpecialRouter.get('/get_special_data', async (req, res) => {
    var res_id = req.query.id,
        menu_id = req.query.menu_id;
    var sql = `SELECT a.*, b.name as cat_name FROM td_special_data a, md_special_category b WHERE a.img_catg = b.id AND a.restaurant_id = "${res_id}" AND a.menu_id = "${menu_id}"`;
    var data = await F_Select(sql);
    res.send(data);
})

SpecialRouter.post('/get_special_data', async (req, res) => {
    var data = await SaveSpecialCatImg(req.body);
    res.send(data);
})

SpecialRouter.get('/check_menu_special', async (req, res) => {
    let res_id = req.query.id,
        menu_id = req.query.menu_id,
        msg = '';
    var sql = `SELECT COUNT(*) as cnt FROM td_date_time WHERE restaurant_id = "${res_id}" AND menu_id = "${menu_id}"`;
    console.log(sql);
    var data = await F_Select(sql);
    if (data.msg[0].cnt > 0) {
        msg = { suc: 1, msg: "Menu Exist" };
    } else {
        msg = { suc: 2, msg: "Menu Not Exist" };
    }
    res.send(msg);
})

SpecialRouter.post('/special_start_end', async (req, res) => {
    var data = req.body[0],
        result = '';
    var res_id = data.restaurant_id;
    var v = '',
        v1 = '';
    for (let i = 0; i < data.reg_menu_id.length; i++) {
        if (data.reg_menu_id[i].menu_id > 0) {
            v = data.reg_menu_id[i].menu_id;
            if (v1 != '') {
                v1 = v + ',' + v1;
            } else {
                v1 = v;
            }
        }
    }
    if (v1 != '') {
        let sql = `SELECT MIN(start_time) as start_time, MAX(end_time) as end_time FROM td_date_time WHERE restaurant_id = "${res_id}" AND menu_id IN(${v1})`;
        result = await F_Select(sql);
    } else {
        result = { suc: 0, msg: "No data found" };
    }
    res.send(result);
})

module.exports = { SpecialRouter };