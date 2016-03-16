var auth = require('../../../lib/auth');

exports.get = function (req, res) {
    console.log('Get function dashboard');
    var database = req.db;
    var employeeDB = database.get('employees');
    var bid = req.user[0].business;
    console.log("also find business owner ID lol");
    //employeeDB.find( { business: bid , password: { $ne: '' } })
    employeeDB.find( { business: bid  })
        .on('success', function(employees) {
            console.log(req.user[0]);
            res.render('business/dashboard', {
                emps: employees,
                emailz: req.user[0].email,
                phone: req.user[0].phone,
                message: req.flash("permission")
            });

        });
};

//exports.getLogo

exports.post = function (req, res) {
    console.log("Post Function for dashboard page ");

    var bid = req.user[0].business;
    console.log(req.body);
    var myFunction = req.body.callingFunc;


    if(myFunction == 'saveForm'){
        console.log('SAVE DATA FROM FORM');
        console.log(req.body.saveData);
    }

    if(myFunction == 'removeEmployee'){
        var employeeDB = req.db.get('employees');
        var eid = req.body.empID.toString();

        //Remove that employee
        console.log("REMOVING EMPLOYEE");
        employeeDB.remove({_id: eid});

    }
    // Re-render all the remaining emps
    res.redirect('../'+ bid +'/dashboard');

};
