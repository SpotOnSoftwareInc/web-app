var auth = require('../../../lib/auth');

exports.get = function (req, res) {
    console.log('Get function dashboard');
    var database = req.db;
    var employeeDB = database.get('employees'),
        businessDB = database.get('businesses'),
        bid = req.user[0].business;
    console.log("also find business owner ID lol");

    //employeeDB.find( { business: bid , password: { $ne: '' } })
    employeeDB.find( { business: bid  })
        .on('success', function(employees) {
            console.log(req.user[0]);

            businessDB.findById(bid)
                .on('success', function(business) {

                        res.render('business/dashboard', {
                            emps: employees,
                            emailz: req.user[0].email,
                            phone: req.user[0].phone,
                            theme: business.theme,
                            logo: business.logo,
                            checkinFrame: '/' + business._id + '/checkin',

                            billingPlan: business.billingPlan,
                            message: req.flash("permission")
                        });
                    }
                )

        });
};

//exports.getLogo

exports.post = function (req, res) {
    console.log("Post Function for dashboard page ");

    var bid = req.user[0].business;
    var myFunction = req.body.callingFunc;


    if(myFunction == 'updatePlan'){
        var newPlan = req.body.newPlan;
        console.log('Updating billing plan to ' + newPlan);
        var businessDB = req.db.get('businesses');

        businessDB.findAndModify({
            query: {_id: bid},
            update: {
                $set: {
                    billingPlan: newPlan
                }
            }
        });

        res.redirect('../'+ bid +'/dashboard#Billing-Options');
    }

    else if(myFunction == 'saveForm'){
        console.log('SAVE DATA FROM FORM');
        console.log(req.body.saveData);
        res.redirect('../'+ bid +'/dashboard#Manage-Theme');
    }

    else if(myFunction == 'removeEmployee'){
        var employeeDB = req.db.get('employees');
        var eid = req.body.empID.toString();

        //Remove that employee
        console.log("REMOVING EMPLOYEE");
        employeeDB.remove({_id: eid});
        res.redirect('../'+ bid +'/dashboard');

    }
    // Re-render all the remaining emps


};
