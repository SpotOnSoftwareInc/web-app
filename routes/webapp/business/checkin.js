var style = require('./../../../lib/style.js');
var crypto = require('crypto');
var baby = require('babyparse');
var async = require('async');
var sendgrid  = require('sendgrid')('robobetty', 'NoKcE0FGE4bd');
var ObjectId = require('mongodb').ObjectID;

exports.get = function (req, res, next) {
    console.log("get function checkin");

    //var business = req.session.business;
    res.render('business/checkin', {
        //companyName: business.companyName,
        //bg: business.style.bg,
        //logo: business.logo,
        //buttonBg: style.rgbObjectToCSS(business.style.buttonBg),
        //buttonText: style.rgbObjectToCSS(business.style.buttonText),
        //containerText: style.rgbObjectToCSS(business.style.containerText),
        //containerBg: style.rgbObjectToCSS(business.style.containerBg)
    });
};

exports.post = function(req,res, next) {
    console.log("Someone checking in");

    // On checkin should also send text or email to provider

    var appointmentDB = req.db.get('appointment');
    var bid = req.user[0].business.toString();
    var name = req.body.name;
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
        console.log(doc);
    });

    res.redirect('../' + bid + '/checkin');

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
