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

    var appointmentDB = req.db.get('appointment');
    var bid = req.user[0].business.toString();
    var name = req.body.name;
    console.log(name);
    var curtime = new Date();

    appointmentDB.findAndModify({
        query : {business: bid},
        update: {

                //checkinTime: curtime,
                state: 'waiting'

        }
    });

    res.redirect('../' + bid + '/checkin');

};

