const express = require('express');
const { OrderEmail, PayEmail } = require('../modules/EmailModule');
const { F_Select } = require('../modules/MenuSetupModule');
const { ResRegistration, EmailCheck, OrderSave, PaySave, MobileCheck, UpdatePackage, UpdateProd, UpdatePay } = require('../modules/RegisterModule');
const RegRouter = express.Router();

RegRouter.post('/registration', async (req, res) => {
    const data = await ResRegistration(req.body);
    res.send(data);
})

RegRouter.get('/email_check', async (req, res) => {
    // console.log(req.query);
    const data = await EmailCheck(req.query);
    res.send(data);
})

RegRouter.get('/mobile_check', async (req, res) => {
    const data = await MobileCheck(req.query.no);
    res.send(data);
})

RegRouter.post('/order', async (req, res) => {
    const data = await OrderSave(req.body);
    res.send(data);
})

RegRouter.post('/pay', async (req, res) => {
    const data = await PaySave(req.body);
    res.send(data);
})

RegRouter.get('/country', async (req, res) => {
    let sql = `SELECT * FROM md_country`;
    var data = await F_Select(sql);
    res.send(data);
})

RegRouter.get('/get_timezone', async (req, res) => {
    let sql = `SELECT * FROM md_time_zone`;
    var data = await F_Select(sql);
    res.send(data);
})

RegRouter.get('/order_dtls', async (req, res) => {
    let sql = `SELECT * FROM td_order_items WHERE restaurant_id = ${req.query.id}`;
    var data = await F_Select(sql);
    res.send(data);
})

RegRouter.get('/pay_email', async (req, res) => {
    var dt = '';//await PayEmail(req.query.id, req.query.en_dt);
    res.send({ suc: 1, msg: 'Email Sent' })
})

RegRouter.get('/pay_check', async (req, res) => {
    let res_id = req.query.id;
    let sql = `SELECT IF(payment_flag = 'Y', 1, 0) as pay_flag FROM td_order_items WHERE restaurant_id = ${res_id}`;
    var dt = await F_Select(sql);
    res.send(dt);
})

RegRouter.post('/update_pack', async (req, res) => {
    var data = req.body;
    var dt = await UpdatePackage(data);
    res.send(dt);
})

RegRouter.post('/update_prod', async (req, res) => {
    var data = req.body;
    var dt = await UpdateProd(data);
    res.send(dt);
})

RegRouter.post('/update_pay', async (req, res) => {
    var data = req.body;
    var dt = await UpdatePay(data);
    res.send(dt);
})

module.exports = { RegRouter };