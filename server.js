//Branch backend
// EXPORTING MODULES //
const express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    db = require('./core/db'),
    cors = require("cors"),
    bcrypt = require('bcrypt'),
    dateFormat = require('dateformat'),
    Buffer = require('buffer').Buffer,
    port = process.env.PORT || 3000;
// const dateFormat = require('dateformat');

// USING CORS //
app.use(cors());
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

app.use(express.static('uploads'));

// CALLING ROUTER MODULE FOLDER LOCATION //
const { RegRouter } = require('./route/RegistrationRoute');
const { AdmRouter } = require('./route/AdminRouter');
const { LogRouter } = require('./route/LoginRouter');
const { MenuSetRouter } = require('./route/MenuSetupRouter');
const { TestRouter } = require('./route/TestRoute');
const { EmailRouter } = require('./route/EmailRouter');
const { MenuRouter } = require('./route/MenuRouter');
const { SpecialRouter } = require('./route/SpecialRouter');
const { CalenderRouter } = require('./route/CalenderRouter');
const { PromoRouter } = require('./route/PromoRouter');
const { F_Select } = require('./modules/MenuSetupModule');
const { PayEmail } = require('./modules/EmailModule');
///////////////////////////////////////////

// REGISTRATION ROUTER RegistrationRouter.js FOLDER //
app.use(RegRouter);

// ADMIN ROUTER AdminRouter.js FOLDER //
app.use(AdmRouter);

// LOGIN ROUTER LoginRouter.js FOLDER //
app.use(LogRouter);

// MENU SETUP ROUTER LoginRouter.js FOLDER //
app.use(MenuSetRouter);

app.use(TestRouter);

app.use(EmailRouter);

app.use(MenuRouter);

app.use(SpecialRouter);

app.use(CalenderRouter);

app.use(PromoRouter);


app.get('/', async (req, res) => {
    var alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
        'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
        'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    var a = alpha[Math.floor(Math.random() * 62)];
    var b = alpha[Math.floor(Math.random() * 62)];
    var c = alpha[Math.floor(Math.random() * 62)];
    var d = alpha[Math.floor(Math.random() * 62)];
    var e = alpha[Math.floor(Math.random() * 62)];
    var sum = '123';//a + b + c + d + e;
    var pwd = '$2b$10$SSokJhSzqi5bw5w.PR0eAu.AGE5qHVxwJfGaATBabs078KY5diGOm';//bcrypt.hashSync(sum, 10);
    // var random_num = Math.random().toString(36).substr(2);
    // console.log({ comp: await bcrypt.compare(pwd, sum) });
    // var date = new Date(),
    //     mod_hr = date.setMinutes(date.getMinutes() + 10),
    //     n = dateFormat(mod_hr, "yyyy-MM-dd hh:mm:ss");
    // console.log({ hr: n });
    res.send({ random_num: pwd, sum });
})

////////// SEND PAY EMAIL ONCE PER DAY ///////////////////
var dayInMilliseconds = 1000 * 60 * 60 * 22;
setInterval(async () => {
    let sql = `SELECT a.id, a.restaurant_name, a.email, DATE(b.created_dt) as order_date, b.payment_flag, b.pay_mail_send
    FROM td_contacts a, td_order_items b
    WHERE a.id=b.restaurant_id
    AND b.payment_flag = 'N'
    AND b.pay_mail_send = 'N'`;
    var select_data = await F_Select(sql),
        data = select_data.msg.length > 0 ? select_data.msg : false;
    var date = new Date(),
        now_date = dateFormat(date, "yyyy-mm-dd");
    if (data) {
        data.forEach(async dt => {
            if (now_date == dt.order_date) {
                let str = dt.id + '/' + dt.email;
                let en_dt = Buffer.from(str).toString('base64');
                var res_dt = await PayEmail(dt.id, en_dt);
                if (res_dt.suc > 0) {
                    var up_sql = `UPDATE td_order_items SET pay_mail_send = 'Y' WHERE restaurant_id = ${dt.id}`;
                    db.query(up_sql, (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Success');
                        }
                    })
                }
            }
        })
    }
}, dayInMilliseconds);

// CREATE EXPRESS SERVER //
app.listen(port, (err) => {
    if (err) console.log(err);
    else console.log(`App is Running at PORT - ${port}`);
})