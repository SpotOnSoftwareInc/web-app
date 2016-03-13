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
    var parsed = req.body.fullName.split(" ");
    console.log(parsed);
    var fname = parsed[0];
    var lname = parsed[1];
    var database =  req.db;
    var visitorDB = database.get('visitor');
    var businessID = req.user[0].business;


    console.log(businessID);
    visitorDB.insert({
        business: ObjectId(businessID),
        fullName: fname + " " + lname,
        email: "",
        apptTime: "",
        assignee: "",
        //values of role saasAdmin, busAdmin, provider, staff, visitor
        role: 'visitor'
    });
    res.redirect('../' + req.user[0].business + '/checkin');
}

