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
                console.log(appointments[i].checkinTime);
                if (appointments[i].checkinTime == 0) {
                    appointments[i].checkinTime = 'Not Checked in';
                }
            }

            employeeDB.find( { business: bid4emp }, {role: 'provider'})
                .on('success', function(providers) {

                    res.render('staff/visitor', {
                        appts: appointments,
                        providers :providers,
                        message: req.flash("Fetched all appointments")
                    });
                })
        })
    };



exports.post = function (req, res) {
    console.log("making appointment");

    var appointmentDB = req.db.get('appointment');
    var bid = req.user[0].business.toString();

    var apptTime = req.body.apptTime;
    var provider = req.body.provider;
    console.log(provider);
    var name = req.body.name;

    appointmentDB.insert({
        checkinTime: 0,
        provider: provider,
        apptTime: apptTime,
        visitor: name,
        business: bid,
        state: 'Appointment Made'
    });

    res.redirect('../'+ bid +'/visitor');

};
