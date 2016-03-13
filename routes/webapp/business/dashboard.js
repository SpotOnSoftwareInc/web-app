var auth = require('../../../lib/auth');

exports.get = function (req, res) {
    console.log('Get function getemployees');
    var database = req.db;
    var employeeDB = database.get('employees');
    var bid = req.user[0].business;
    console.log(bid);
    employeeDB.find( { business: bid })
        .on('success', function(employees) {

            res.render('business/dashboard', {
                emps: employees,
                message: req.flash("permission")
            });

        });
};

//exports.getLogo

exports.post = function (req, res) {
    console.log("Post Function for dashboard page to delete employees ");
    //Removing an employeee
    console.log(req.body);
    var eid = req.body.empID.toString();
    var employees = req.body.emps;
    var employeeDB = req.db.get('employees');
    var bid = req.user[0].business;

    //Remove that employee
    employeeDB.remove({_id: eid});

    // Re-render all the remaining emps
    employeeDB.find( { business: bid })
        .on('success', function(employees) {

            res.render('business/dashboard', {
                emps: employees,
                message: req.flash("permission")
            });

        });

};
