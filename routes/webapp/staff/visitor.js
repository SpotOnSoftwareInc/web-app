/**
 * Created by sean on 2/26/2016.
 */


/**
 * Takes a req and res parameters and is inputted into function to get employee, notemployee, and business data.
 *
 * @param req and res The two parameters passed in to get the apprporiate employee,
 * @returns The appropriate data about the employee
 */
//exports.get = function(req, res) {
//    console.log('Get function');
//    res.render('staff/visitor',{
//    });
//};
var async = require('async');
var twilioClient = require('../business/twilio-client');

exports.get = function (req, res) {
    console.log('Get function VisitorQueue');
    var database = req.db;
    var apptDB = database.get('appointment');
    var employeeDB = database.get('employees');
    var bid = req.user[0].business.toString();
    var bid4emp = req.user[0].business;

    apptDB.find( { business: bid }, {state: 'waiting'} )
        .on('success', function(appointments) {

            var i;
            for(i = 0; i < appointments.length; i++) {

                if (appointments[i].checkinTime == 0) {
                    appointments[i].checkinTime = 'Not Checked in';
                }
            }

            employeeDB.find( { business: bid4emp, role: 'provider' })
                .on('success', function(providers) {

                    for(i = 0; i < appointments.length; i++) {
                        appointments[i].providers = providers;

                    }

                    res.render('staff/visitor', {
                        appts: appointments,
                        providers: providers,
                        providerlist: providers,
                        message: req.flash("Fetched all appointments")
                    });
                })
        })
    };



exports.post = function (req, res) {
    console.log("post function for visitor appointment");
    //on appointment made, text & email confirmation to visitor

    var appointmentDB = req.db.get('appointment');

    var bid = req.user[0].business.toString();
    var apptTime = req.body.apptTime;
    var provider = req.body.provider;
    var name = req.body.name;
    var bizInfo = '';
    var callingFunc = req.body.callingFunc;
    var vid = req.body.name;
    console.log(callingFunc);

    if (callingFunc == 'insert') {
        console.log("INSERTING APPOINTMENT");
        var messageBody = 'Hi ' + name +', your appointment at ' + apptTime + ' with ' + provider + ' has been made!';

        twilioClient.sendSmsToPhoneNumber('+19089073401', messageBody);

        appointmentDB.insert({
            checkinTime: 0,
            provider: provider,
            apptTime: apptTime,
            visitor: name,
            businessInfo: bizInfo,
            business: bid,
            providers: [],
            state: 'Appointment Made'
        });

    }

    if (callingFunc == 'changeProv'){
        console.log("in change prov");

    }
    if (callingFunc == 'sendToProvider'){
        console.log("MODIFY STATUS WAITING TO CHECKED IN");

        var appointmentDB = req.db.get('appointment');
        var bid = req.user[0].business.toString();
        var vid = req.body.vid;
        var name = req.body.name;


        appointmentDB.findAndModify({
                query : {_id: vid },
                update: {
                    $set: {
                        state: 'Checked in'
                    }
                }
        },
        function(err,doc){
            //console.log("doc commign");
            //console.log(doc);
        });
    }

    res.redirect('../'+ bid +'/visitor');

};
