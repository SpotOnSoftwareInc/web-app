/**
 * Created by orion on 3/12/2016.
 */
exports.post = function (req, res) {
    console.log("SWAG");
    //Removing an employeee
    console.log(req.body);
    //var eid = req.body.empID.toString();

    var newEmail = req.body.newEmail;
    var newPhone = req.body.newPhone;
    //console.log(req.body.newEmail);
    var employeeDB = req.db.get('employees');

    var bid = req.user[0].business;
    if((req.body.newEmail != "") && (req.body.newPhone != ""))
    {
        console.log("!!!!!new email and phone!!!!!!");
        employeeDB.findAndModify({
            query: {fname: req.user[0].fname,
                _id: bid},
            update: {email: newEmail,
                phone: newPhone}
        });
    }


    //Remove that employee
    //employeeDB.remove({_id: eid});

    // Re-render all the remaining emps
    //employeeDB.find( { business: bid })
    //    .on('success', function(employees) {
    //
    //        res.render('business/dashboard', {
    //            emps: employees,
    //            message: req.flash("permission")
    //        });
    //
    //    });
    //
    res.redirect('../' + req.user[0].business + '/dashboard');

};
