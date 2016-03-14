/**
 * Created by sean on 3/13/2016.
 */
var crypto = require('crypto');
var baby = require('babyparse');
var async = require('async');
var sendgrid  = require('sendgrid')('robobetty', 'NoKcE0FGE4bd');
var ObjectId = require('mongodb').ObjectID;

exports.post = function(req,res){
    console.log('INSIDE ADDAPPOINTMENTS');
    var parsed = baby.parse(req.body.csvEmployees),
        rows = parsed.data,
        database =  req.db,
        appointmentDB = database.get('appointment'),
        businessID = req.user[0].business.toString();

    for(var i = 0; i < rows.length; i++){
        var data = rows[i][0],
            nameArr = data.split(' '),
            fname = nameArr[0],
            lname = nameArr[1],
            name = fname + ' ' + lname,
            appointmentTime = nameArr[2],
            provider = nameArr[3];
        console.log('ADD EACH IN  ADDAPPOINTMENTS');
        console.log(appointmentTime);
        appointmentDB.insert({
            checkinTime: 0,
            provider: provider,
            apptTime: appointmentTime,
            visitor: name,
            businessInfo: '',
            business: businessID,
            state: 'Appointment Made'
        });
    }

    res.redirect('../' + req.user[0].business + '/visitor');
};
