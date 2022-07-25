const express = require('express');
const { F_Select } = require('../modules/MenuSetupModule');
const { IntroSave, ConfEmailSave, PouUpSave, QuestionSave, MailingEmailSave, PromoImgSave, StatusSave, PromoSave, OtherSave } = require('../modules/PromoModule');
const PromoRouter = express.Router();

PromoRouter.get('/adm_promo_dt', async (req, res) => {
    let sql = `SELECT * FROM md_promotion_admin`;
    var data = await F_Select(sql);
    res.send(data);
})

PromoRouter.get('/res_promo_dt', async (req, res) => {
    var res_id = req.query.id;
    let sql = `SELECT * FROM md_promotion_restaurant WHERE restaurant_id = ${res_id}`;
    var data = await F_Select(sql);
    res.send(data);
})

PromoRouter.post('/intro_save', async (req, res) => {
    var data = req.body;
    var dt = await IntroSave(data);
    res.send(dt);
})

PromoRouter.post('/conf_email_save', async (req, res) => {
    var data = req.body;
    var dt = await ConfEmailSave(data);
    res.send(dt);
})

PromoRouter.post('/pop_save', async (req, res) => {
    var data = req.body;
    var dt = await PouUpSave(data);
    res.send(dt);
})

PromoRouter.post('/qn_save', async (req, res) => {
    var data = req.body;
    var dt = await QuestionSave(data);
    res.send(dt);
})

PromoRouter.post('/mailing_email_save', async (req, res) => {
    var data = req.body;
    var dt = await MailingEmailSave(data);
    res.send(dt);
})

PromoRouter.post('/img_save', async (req, res) => {
    var data = req.body;
    var dt = await PromoImgSave(data);
    res.send(dt);
})

PromoRouter.post('/status_save', async (req, res) => {
    var data = req.body;
    var dt = await StatusSave(data);
    res.send(dt);
})

PromoRouter.post('/promo_save', async (req, res) => {
    var data = req.body;
    var dt = await PromoSave(data);
    res.send(dt);
})

PromoRouter.post('/promo_other_save', async (req, res) => {
    var data = req.body;
    var dt = await OtherSave(data);
    res.send(dt);
})

PromoRouter.get('/get_promotion_dt', async (req, res) => {
    let sql = `SELECT * FROM td_promotions WHERE restaurant_id = ${req.query.id}`;
    var data = await F_Select(sql);
    res.send(data);
})

PromoRouter.get('/get_promo_dt', async (req, res) => {
    var frm_dt = req.query.frm_dt,
        to_dt = req.query.to_dt,
        res_id = req.query.id;
    let sql = `SELECT * FROM td_promotions WHERE restaurant_id = ${res_id} AND DATE(created_at) >= "${frm_dt}" AND DATE(created_at) <= "${to_dt}"`;
    var data = await F_Select(sql);
    res.send(data);
})

PromoRouter.get('/get_promo_cat_dtls', async (req, res) => {
    var bth_id = 24,
        ani_id = 25;
    var sql = `SELECT * FROM md_special_category WHERE id in(${bth_id}, ${ani_id})`;
    var data = await F_Select(sql);
    res.send(data);
})

PromoRouter.get('/promo_stock_img', async (req, res) => {
    var cat_id = req.query.cat_id;
    var bth_id = 24,
        ani_id = 25;
    let whr = cat_id > 0 ? `WHERE img_catg = ${cat_id}` : `WHERE img_catg IN (${bth_id}, ${ani_id})`;
    let sql = `SELECT * FROM td_stock_image ${whr}`;
    var data = await F_Select(sql);
    res.send(data);
})

module.exports = { PromoRouter }