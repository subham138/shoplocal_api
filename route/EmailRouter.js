const express = require('express');
const { ConfirmMenu, ApproveMenu, PromoEmail } = require('../modules/EmailModule');
const EmailRouter = express.Router();

EmailRouter.get('/approve_menu', async (req, res) => {
    let res_id = req.query.id;
    var data = await ConfirmMenu(res_id);
    res.send(data);
})

EmailRouter.post('/approve_menu', async (req, res) => {
    console.log(req.body);
    var data = await ApproveMenu(req.body);
    res.send(data);
})

EmailRouter.get('/dynamic_email_send', (req, res) => {
    var dayInMilliseconds = 1000 * 10;
    var count = 1;
    setInterval(async () => {
        count++;
        await PromoEmail();
        console.log('Welcome ' + count + 'times');
    }, dayInMilliseconds);
    res.send('Welcome ' + count + 'times')
})
// var dayInMilliseconds = 1000 * 60 * 60 * 24;
// var dayInMilliseconds = 1000 * 60 * 60 * 24;
// setInterval(function () { alert("foo"); }, dayInMilliseconds);

module.exports = { EmailRouter }