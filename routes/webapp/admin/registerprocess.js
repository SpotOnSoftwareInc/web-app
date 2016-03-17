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

;
};

exports.post = function (req, res) {

    var companyName = req.body.companyName;
    var companyAddress = req.body.companyAddress;
    var phone = req.body.phone;

    var callingFunc = req.body.callingFunc;
    var planName = req.body.planName;

    var businessDB = req.db.get('businesses');
    var bid = req.user[0].business;


    if (callingFunc == 'Insert') {
        console.log("HI");
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
    else if (callingFunc == 'updatePlan') {
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

//    var keenClient = new Keen({
//        projectId: "56d8ada66f31a21ff3cdf3fe", // String (required always)
//        writeKey: "3fbb21b09ead3c8385954e5f55014437e0ec8e7f1d63a39fe2ea98f8f857b68fc48d364d51e466e0700ad5b4bde78d173bc9780d8ab04a9400f2b7a7d63803911525ea41af7e835de8b9771a8d9c92efda4f36d52073c32736d6e43fa7b094fb", // String (required for sending)
//        readKey: "98ce462342fedd3711bdf057a830e24e76bf6b5251cefc7b015bccfb21e674fd7487ee2883a49acd70cf4691bfa1c66adc3e0fd886459645233f0aa10ce59317ae9104b16443383728475d96863438074baac8dafa53aef7b39887c6d4805e47"      // String (required for querying)
//    })
//
//    var startDateObject = new Date();
//    var startTime = startDateObject.getTime();
//
//        var endDateObject = new Date();
//        var endTime = endDateObject.getTime();
//        var timeSpent =  endTime - startTime;
//
//        var timeSpentOnPage = {
//            timeSpent: timeSpent,
//            user: {
//                id: "39",
//                name: "Ellie Day"
//            },
//            page_title: "Home"
//        }
//// This sends the above data to Keen and records it as an event.
//        keenClient.addEvent("time_spent", timeSpentOnPage);
//
//
//    }

//// This builds a query that when executed will get the average time spent in the last hour from the "time_spent" collection.
//    var metric = new Keen.Query("time_spent", {
//        analysisType: "average",
//        targetProperty: "timeSpent",
//        timeframe: "this_1_hours"
//    });
//// This executes the query and charts a simple metric using Keen's charting library.
//    keenClient.draw(metric, document.getElementById("time-spent-chart"), {
//        chartType: "metric",
//        label: "Average Time Spent"
//    });
//
//
//};
