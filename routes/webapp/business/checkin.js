var style = require('./../../../lib/style.js');
var crypto = require('crypto');
var baby = require('babyparse');
var async = require('async');
var sendgrid  = require('sendgrid')('robobetty', 'NoKcE0FGE4bd');
var ObjectId = require('mongodb').ObjectID;

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

        res.render('business/checkin', {
            theme: dbBusiness.theme
        });
    });
};

exports.post = function(req,res, next) {
    console.log("add visitor to db");

    var appointmentDB = req.db.get('appointment');
    var bid = req.user[0].business;

    var time = req.body.time;
    var provider = req.body.provider;
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;

    console.log(req.body);

    appointmentDB.insert({
        privider: provider,
        time: time,
        visitor: name,
        business: bid,
        email: email,
        phone: phone,
        state: 'waiting'
    });

    res.redirect('../' + req.user[0].business + '/checkin');


};

