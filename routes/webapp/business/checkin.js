var style = require('./../../../lib/style.js');
var crypto = require('crypto');
var baby = require('babyparse');
var async = require('async');
var sendgrid  = require('sendgrid')('robobetty', 'NoKcE0FGE4bd');
var twilioClient = require('../business/twilio-client');
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

    var appointmentDB = req.db.get('appointment');
    var bid = req.user[0].business.toString();
    var name = req.body.name;
    var phone = req.body.phone;
    console.log(name);
    var curtime = getTime();

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
            res.redirect('../' + bid + '/done');
        }
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
