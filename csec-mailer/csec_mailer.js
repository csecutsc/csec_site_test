/**
 * @author K-M Samiul Haque <sammy.haque@mail.utoronto.ca>
 */

var express = require('express');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var request = require('request');
var validator = require('validator');
var jsonfile = require('jsonfile');
var app = express();
var file = '../../params.json';
var params = jsonfile.readFileSync(file);

var transporter = nodemailer.createTransport({
    service: params["email-service"],
    auth: {
        user: params["serverEmail"],
        pass: params["serverPass"]
    }
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.get('/mailer', function (req, res) {
    res.send("Message Received");
});

app.post('/mailer', function (req, res) {
    var formData = req.body;
    console.log(formData);
    for (var curr in ["g-recaptcha-response", "Name", "Email", "Phone", "Message"]) {
        if (!(curr in formData) && ((typeof curr !== 'string'))) {
            res.json({"success": false});
        }
    }

    request.post({
        url: params["apiURL"], form: {
            secret: params["apiSecret"],
            response: formData["g-recaptcha-response"]
        }
    }, function (err, httpResponse, body) {
        if (JSON.parse(body)["success"] === true) {

            console.log(JSON.parse(body)["success"]);
            var name = formData["Name"], email = formData["Email"], phone = formData["Phone"],
                msg = formData["Message"];
            if (name && email && phone && msg && validator.isEmail(email)) {
                var mailOptions = {
                    from: email,
                    to: params["destinationEmail"],
                    subject: 'UTSC SERVER',
                    text: "Name: " + name + "\nEmail: " + email + "\nPhone: " + phone + "\nMessage:\n" + msg + "\n",
                    replyTo: email
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                res.json({"success": true});
            } else {
                res.json({"success": false});
            }
        }
    });
});


var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("CSEC Mailer at http://%s:%s", host, port);
});
