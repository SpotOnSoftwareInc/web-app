/**
 * Created by sean on 3/7/2016.
 */
exports.get = function(req,res) {
    console.log('Get function getemployees');
    var database = req.db;
    var bid = req.user[0].business;
    var businesses = db.get('businesses');
    var employeeDB = database.get('employees');

    employeeDB.find({business: bid})
        .forEach(function (oneEmployee) {
            console.log("user: " + oneEmployee.fname);
        });
};

    //var employee;
    //var notemployee;
    //var businessID = req.user[0].business;

    //async.parallel({
    //        employee: function(cb){
    //            employeeDB.find({registrationToken: {$exists: false}, business: ObjectId(businessID)},function (err,results){
    //
    //                if (err) { return next(err);  }
    //                if(!results) { return next(new Error('Error finding employee'));}
    //
    //                employeee = results;
    //                console.log(employeee);
    //                cb();
    //
    //            });
    //        },
    //        nonemployee: function(cb){
    //            employeeDB.find({registrationToken: {$exists: true}, business: ObjectId(businessID)}, function (err,results){



    //                if (err) { return next(err); }
    //                if(!results) { return next(new Error('Error finding employee'));}
    //
    //                notemployee = results;
    //                cb();
    //            });
    //        }
    //    },
    //
    //    function(err,results){
    //
    //        if(err){
    //            throw err;
    //        }
    //        res.render('business/dashboard',
    //            {
    //                title: 'Express',
    //                notsigned: notemployee,
    //                signed: employeee
    //            }
    //
    //
    //        )}
    //)};


//console.log('Get function accountsettings');
////var eid = req.user[0]._id;
//var db = req.db;
//var employees = db.get('employees');
//
//var fname;
//var lname;
//var phone;
//var sms;
//var email;
//
////calls find method to find  the correct employee to pull results
//employees.find({business: businessID}, function (err, result) {
//    //var emp = result[0];
//    v//ar phone = emp.phone;
//    //phone = phone.replace('1', '');
//    //phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
//    res.render('business/dashboard', {
//        title: 'Express',
//        fname: emp.fname,
//        lname: emp.lname,
//        password: emp.password,
//        phone: phone,
//        email: emp.email,
//        smsNotify: emp.smsNotify,
//        emailNotify: emp.emailNotify,
//        message: req.flash("permission")
//    });
//});
