var style = require('./../../../lib/style.js');
var crypto = require('crypto');
var baby = require('babyparse');
var async = require('async');
var sendgrid  = require('sendgrid')('robobetty', 'NoKcE0FGE4bd');
var twilioClient = require('../business/twilio-client');
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

        /*
         * When getting data for checkin.hjs, need to get the form objects to display fields.
         * A form object looks like:
         *      {
         *          hidden: boolean,
         *          label: 'string',
         *          password: boolean
         *      }
         *   where hidden determines if the input should be flagged hidden or text (might need to change this to
         *      string with values "hidden" or "text" for HTML to not be dumb
         */
        dbBusiness.form1 = result.form1;
        dbBusiness.form2 = result.form2;
        dbBusiness.form3 = result.form3;
        dbBusiness.form4 = result.form4;

        if(!dbBusiness.theme) {
            // default theme (BG)
            dbBusiness.theme = '/images/landing/pika.jpg';
        }

        res.render('business/checkin', {
            theme: dbBusiness.theme,
            form1: result.form1,
            form2: result.form2,
            form3: result.form3,
            form4: result.form4
        });
    });
};

exports.post = function(req,res, next) {
    console.log("add visitor to db");

    var appointmentDB = req.db.get('appointment');
    var bid = req.user[0].business.toString();
    var dataFromForm1 = req.body.form1;
    var dataFromForm2 = req.body.form2;
    var dataFromForm3 = req.body.form3;
    var dataFromForm4 = req.body.form4;
    console.log(dataFromForm1);
    console.log(dataFromForm2);
    console.log(dataFromForm3);
    console.log(dataFromForm);
    var curtime = getTime();

    /*
     * dataFromForm1-4 should be the strings/data provided as inputs to the different form fields in business
     */
    appointmentDB.findAndModify({
        query : {business: bid, visitor: form1 },
        update: {
            $set: {
                form1: form1,
                form2: form2,
                form3: form3,
                form4: form4,
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
            res.redirect('../' + bid + '/done');
        }
    });

    //res.redirect('../' + bid + '/done');

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
