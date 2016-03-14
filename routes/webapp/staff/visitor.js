/**
 * Created by sean on 2/26/2016.
 */
/**
 * Takes a req and res parameters and is inputted into function to get employee, notemployee, and business data.
 *
 * @param req and res The two parameters passed in to get the apprporiate employee,
 * @returns The appropriate data about the employee
 */
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

    var appointmentDB = req.db.get('appointment'),
        bid = req.user[0].business,
        arrivalTime = '',
        appointmentTime = req.body.time,
        provider = req.body.provider,
        name = req.body.name,
        bizInfo = '';

    appointmentDB.insert({
        provider: provider,
        appointmentTime: appointmentTime,
        arrivalTime: arrivalTime,
        visitor: name,
        businessInfo: bizInfo,
        business: bid,
        state: 'Appointment Made'
    });

    res.redirect('../'+ bid +'/visitor');

};
