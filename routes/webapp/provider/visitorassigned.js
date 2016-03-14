/**
 * Created by sean on 2/26/2016.
 */
exports.get = function (req, res) {
    console.log('Getting provider queue');
    var database = req.db;
    var apptDB = database.get('appointment');

    var bid = req.user[0].business;
    var fullName = req.user[0].fname + " " + req.user[0].lname;

    console.log("Provider: " + fullName);
    console.log("Business: " + bid);

    //apptDB.find( { business: bid }, { provider: fullName }, {state: 'Waiting'} )
    apptDB.find( { $and: [ { business: bid }, { provider: fullName }, {state: 'Waiting'} ] } )
        .on('success', function(appointments) {

            res.render('provider/visitorassigned', {
                appts: appointments,
                message: req.flash("Fetched all appointments")
            });

        })
};
