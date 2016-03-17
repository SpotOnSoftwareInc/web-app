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
                            logo: '../' + business.logo,
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
    var db = req.db;
    var businesses = db.get('businesses');
    var myFunction = req.body.callingFunc;


    if(myFunction == 'updateForm'){
        console.log('SAVE DATA FROM FORM');
        console.log(req.body.saveData);

        var form1 = {hidden: true, label: '', password: false};
        var form2 = {hidden: true, label: '', password: false};
        var form3 = {hidden: true, label: '', password: false};
        var form4 = {hidden: true, label: '', password: false};

        form1.hidden = req.body.form1Hidden ? false : true;
        form2.hidden = req.body.form2Hidden ? false : true;
        form3.hidden = req.body.form3Hidden ? false : true;
        form4.hidden = req.body.form4Hidden ? false : true;

        form1.label = req.body.form1Label;
        form2.label = req.body.form2Label;
        form3.label = req.body.form3Label;
        form4.label = req.body.form4Label;

        form1.password = req.body.form1Password ? true : false;
        form2.password = req.body.form2Password ? true : false;
        form3.password = req.body.form3Password ? true : false;
        form4.password = req.body.form4Password ? true : false;

        console.log(form1);
        console.log(form2);
        console.log(form3);
        console.log(form4);

        businesses.findById(bid, function (err, result) {
            if (err) {
                return next(err);
            }
            businesses.update({_id:bid}, {
                //writes in database
                $set :{
                    form1: form1,
                    form2: form2,
                    form3: form3,
                    form4: form4
                }
            });
        });
    }

    if(myFunction == 'removeEmployee'){
        var employeeDB = req.db.get('employees');
        var eid = req.body.empID.toString();

        //Remove that employee
        console.log("REMOVING EMPLOYEE");
        employeeDB.remove({_id: eid});
        res.redirect('../'+ bid +'/dashboard');

    }
    // Re-render all the remaining emps


};
