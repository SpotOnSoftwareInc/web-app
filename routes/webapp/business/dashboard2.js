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

    var uid = req.user[0]._id;
    if((req.body.newEmail != "") && (req.body.newPhone != ""))
    {
        console.log("!!!!!new email and phone!!!!!!");
        employeeDB.findAndModify({
            query: {_id: uid},
            update: {
                $set: {
                    email: newEmail,
                    phone: newPhone
                }
            }
        });
    }
    else if((req.body.newEmail != "") && (req.body.newPhone == ""))
    {
        console.log("only a new email");
        employeeDB.findAndModify({
            query: {_id: uid},
            update: {
                $set: {
                    email: newEmail
                }
            }
        })
    }
    else if((req.body.newEmail == "") && (req.body.newPhone != ""))
    {
        console.log("only a new phone");
        employeeDB.findAndModify({
            query: {_id: uid},
            update: {
                $set: {
                    phone: newPhone
                }
            }
        })
    }
    else if((req.body.newEmail == "") && (req.body.newPhone == ""))
    {
        console.log("no new email no new phone");
        res.redirect('../' + req.user[0].business + '/dashboard');
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
