
const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require("nodemailer");

app.use(bodyParser.json());
app.use(cors());


app.get('/', function (req, res) {
    res.send(JSON.stringify({ Hello: 'World'}));
   });

const db = mysql.createConnection({
    host: "connection-test.cil92r1ztgxe.us-east-2.rds.amazonaws.com",
	user: "mastertest",
	password: "lovetalk",
	port: '3306',
	database: "connection_test",
	timeout: 200000
});

db.connect();


app.post('/data', function(req, res){
	console.log(req.body); 
    var data = {user_email:req.body.email, first_name:req.body.fName, last_name:req.body.lName, first_Language:req.body.firstLanguage, second_Language:req.body.secondLanguage};
    var sql = 'INSERT INTO test_table SET ?';
    db.query(sql, data, (err, result)=>{
    if(err) throw err;
    console.log(result);

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: 'lovetalktest@gmail.com',
        pass: 'Love2019!!'
        }
    });
    
    // setup email data with unicode symbols
    let mailOptions = {
        from: 'LOVETALKTEST', // sender address
        to: req.body.email, // list of receivers
        subject: "Results of your Quiz", // Subject line
        text: "Thank you for taking the test here are your results!", // plain text body
        html: req.body.fName +"," + "<p><br> Your Top 2 Love Languages are: <br></p>" + req.body.firstLanguage +"<p><br></p>" + req.body.secondLanguage // html body
    };
    
    // send mail with defined transport object
    let info = transporter.sendMail(mailOptions)
    res.send({
        status: 'Success!',
        no: null,
		fName: req.body.fName,
        lName: req.body.lName,
        email: req.body.email
	});
});
});

app.listen(process.env.PORT || 5000, ()=>{
    console.log('Server running on port 5000')
});
