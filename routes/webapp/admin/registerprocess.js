/**
 * Created by sean on 2/18/2016.
 */
var crypto = require('crypto');
var baby = require('babyparse');
var async = require('async');
var ObjectId = require('mongodb').ObjectID;
var auth = require('../../../lib/auth');
var bcrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');
var smtpTransport = require("nodemailer-smtp-transport");

exports.get = function (req, res) {


    //console.log('Inside register process get method');
    var businessDB = req.db.get('businesses'),
        bid = req.user[0].business;
    console.log('Get function dashboard');
    var database = req.db;
    var employeeDB = database.get('employees');

    console.log("also find business owner ID lol");
    //employeeDB.find( { business: bid , password: { $ne: '' } })
    employeeDB.find( { business: bid  })
        .on('success', function(employees) {
            //console.log(req.user[0]);
            businessDB.findById(bid)
                .on('success', function(newBiz) {
                    res.render('admin/registerprocess', {
                        companyName: newBiz.companyName,
                        businessdb: '/' + newBiz._id + '/dashboard',
                        checkinFrame: '/' + newBiz._id + '/checkin',
                        companyAddress: newBiz.companyAddress,
                        phone: newBiz.phone,
                        theme: newBiz.theme,
                        emps: employees,
                        fname: req.user[0].fname,
                        lname: req.user[0].lnae,
                        emailz: req.user[0].email,
                        logo: newBiz.logo

                    });
                });
            //res.render('admin/registerprocess', {
            //
            //    phone: req.user[0].phone,
            //    message: req.flash("permission")
            //});

        });


};

exports.post = function (req, res) {

    var companyName = req.body.companyName;
    var companyAddress = req.body.companyAddress;
    var phone = req.body.phone;

    var callingFunc = req.body.callingFunc;
    var planName = req.body.planName;

    var businessDB = req.db.get('businesses');
    var bid = req.user[0].business;


    if(callingFunc == 'Insert'){
        var database = req.db,
            employeeDB = database.get('employees'),
            businessID = req.user[0].business.toString(),
            fname = req.body.fname,
            lname = req.body.lname,
            email = req.body.email,
            role = req.body.role,
            defaultPW = 'canthackus',
            password = auth.hashPassword(defaultPW),
            token = randomToken();

        employeeDB.insert({
            business: ObjectId(businessID),
            fname: fname,
            lname: lname,
            email: email,
            registrationToken: token,
            password: password,
            phone: '',
            smsNotify: true,
            emailNotify: true,
            //values of role saasAdmin, busAdmin, provider, staff, visitor
            role: role
        });
        res.redirect("/registerprocess#ptab2");
    }
    /* User selecting payment plan */
    else if( callingFunc == 'updatePlan') {
        //console.log('**Updating plan');
        businessDB.findAndModify({
            query: {_id: bid},
            update: {
                $set: {
                    plan: planName
                }
            }
        });
    }
    else {

        businessDB.findAndModify({
            query: {_id: bid},
            update: {
                $set: {
                    companyName: companyName,
                    companyAddress: companyAddress,
                    phone: phone
                }
            }
        });

        //res.render('admin/registerprocess', {
        //    companyName: companyName,
        //    companyAddress: companyAddress,
        //    phone: phone
        //});
        res.redirect('/registerprocess');
    }
    //res.end(fname + companyName + email + password + username);


    function randomToken() {
        return crypto.randomBytes(24).toString('hex');
    }

};
