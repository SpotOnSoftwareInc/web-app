var style = require('./../../../lib/style.js');
var crypto = require('crypto');
var baby = require('babyparse');
var async = require('async');
var sendgrid  = require('sendgrid')('robobetty', 'NoKcE0FGE4bd');
var twilioClient = require('../business/twilio-client');
var nodemailer = require('nodemailer');
var smtpTransport = require("nodemailer-smtp-transport");
var ObjectId = require('mongodb').ObjectID;

var Slack = require('node-slack');
var slack = new Slack('https://hooks.slack.com/services/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');

exports.get = function (req, res, next) {
    console.log("get function checkin");

    var bid = req.user[0].business;
    var db = req.db;
    var businesses = db.get('businesses');
    businesses.findById(bid, function (err, result) {
        if (err) {
            return next(err);
        }
        var dbBusiness = result;

        if(!dbBusiness.theme){
            // default theme (BG)
            dbBusiness.theme = '/images/landing/pika.jpg';
        }

        res.render('business/checkin', {
            theme: dbBusiness.theme
        });
    });
};

exports.post = function(req,res, next) {
    console.log("add visitor to db");

    var appointmentDB = req.db.get('appointment'),
        bid = req.user[0].business.toString(),
        name = req.body.name,
        curtime = getTime();

        console.log(name);
    appointmentDB.findAndModify({
        query : {business: bid, visitor: name },
        update: {
            $set: {
                checkinTime: curtime,
                state: 'waiting'
            }
        }
    },
    function(err,doc){
        if(!doc){
            console.log("error checking in");
            res.redirect('../' + bid + '/checkinErr');
        }
        else{

            var messageBody = name +' has checked in!';
            twilioClient.sendSmsToPhoneNumber('+16018133403', messageBody);

            var dd = {text: "A new customer [" + name + "] with phone number: [" + phone + "] just checked in!"};
            slack.send(dd);
            // Send an email to the provider and all of the staff
            sendToProvider(req,bid,doc.provider);
            sendToStaff(req,bid);
            res.redirect('../' + bid + '/done');
        }
    });



var sendToProvider = function(req,bid,provider){
    var employeeDB = req.db.get('employees');
    var providerArr = provider.split(' ');
    var fnameProv = providerArr[0];
    var lnameProv = providerArr[1];

    employeeDB.find( {business: req.user[0].business,role: 'provider', fname: fnameProv/*, lname:lnameProv */} )
        .on('success', function(provider) {
            // Customize the message and message properties
            var mailOptions = {
                to: provider[0].email,
                from: 'iReceptionistCorp@gmail.com',
                subject: req.body.name + ' has checked in and is waiting in the lobby!',
                text: req.body.name + ' is waiting for you in the waiting area!'
            };
            sendCheckedInEMail(req,mailOptions);
        });
};

var sendToStaff = function(req,bid){
    var employeeDB = req.db.get('employees');

    employeeDB.find( { business: req.user[0].business, role: 'staff' })
        .on('success', function(staff) {
            var emailAddrs = [];
            for(var i = 0; i < staff.length; i++){
                emailAddrs.push(staff[i].email);
            }
            // Customize the message and message properties
            console.log(emailAddrs);
            var mailOptions = {
                to: emailAddrs.length > 1 ? emailAddrs:emailAddrs[0],
                from: 'iReceptionistCorp@gmail.com',
                subject: req.body.name + ' has checked in and is waiting in the lobby!',
                text: req.body.name + ' is in the waiting area'
            };
            sendCheckedInEMail(req,mailOptions);
        });
};

var sendCheckedInEMail = function(req,mailOptions){
    // Login to our email
    var transport = nodemailer.createTransport(smtpTransport({
        service:'gmail',
        auth : {
            user : "ireceptionistcorp@gmail.com",
            pass : "sossossos"
        }
    }));

    // Send the user an email
    transport.sendMail(mailOptions, function(err) {
        req.flash('info', 'An e-mail has been sent to ' + req.body.email + ' with further instructions.');
    });
};



function getTime(){
    //
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();
    var isNoon = false;

    if (seconds < 10){
        seconds = "0" + seconds
    }
    if (minutes < 10){
        minutes = "0" + minutes
    }

    if(hours > 12){
        hours -= 12;
        isNoon = true;
    }
    var t_str = hours + ":" + minutes + ":" + seconds + " ";
    if(isNoon){
        t_str += "PM";
    } else {
        t_str += "AM";
    }

    return t_str;
}
