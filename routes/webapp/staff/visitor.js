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

    var bid = req.user[0].business.toString();

    apptDB.find( { business: bid }, {status: 'waiting'} )
        .on('success', function(appointments) {

            res.render('staff/visitor', {
                appts: appointments,
                message: req.flash("Fetched all appointments")
            });

        })
    };



exports.post = function (req, res) {

    var appointmentDB = req.db.get('appointment');
    var bid = req.user[0].business.toString();

    var time = req.body.time;
    var provider = req.body.provider;
    var name = req.body.name;

    appointmentDB.insert({
        privider: provider,
        time: time,
        visitor: name,
        business: bid,
        state: 'waiting'
    });

    appointmentDB.find( { business: bid }, {state: 'waiting'} )
        .on('success', function(appointments) {

            res.render('staff/visitor', {
                appts: appointments,

                message: req.flash("Fetched all appointments")
            });

        })

};
