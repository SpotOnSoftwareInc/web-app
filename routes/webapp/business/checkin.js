var style = require('./../../../lib/style.js');
var crypto = require('crypto');
var baby = require('babyparse');
var async = require('async');
var sendgrid  = require('sendgrid')('robobetty', 'NoKcE0FGE4bd');
var ObjectId = require('mongodb').ObjectID;

exports.get = function (req, res, next) {
    console.log("get function checkin")

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

