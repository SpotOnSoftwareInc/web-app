var crypto = require('crypto');
var baby = require('babyparse');
var async = require('async');
var sendgrid  = require('sendgrid')('robobetty', 'NoKcE0FGE4bd');
var ObjectId = require('mongodb').ObjectID;

 /**
 * Takes a req and res parameters and is inputted into function to get employee, notemployee, and business data.
 *
 * @param req and res The two parameters passed in to get the apprporiate employee,
 * @returns The appropriate data about the employee
 */
exports.get = function(req,res){
    console.log('Get function addemployees');
	    var database =  req.db;
        var employeeDB = database.get('employees');
        var employee;
        var notemployee;
        var businessID = req.user[0].business.toString();

        async.parallel({
            employee: function(cb){
                employeeDB.find({registrationToken: {$exists: false}, business: ObjectId(businessID)},function (err,results){

                    if (err) { return next(err);  }
                    if(!results) { return next(new Error('Error finding employee'));}

                        employeee = results;
                        console.log(employeee);
                       cb();

                });
            },
            nonemployee: function(cb){
                employeeDB.find({registrationToken: {$exists: true}, business: ObjectId(businessID)}, function (err,results){


                    if (err) { return next(err); }
                    if(!results) { return next(new Error('Error finding employee'));}

                         notemployee = results;
                         cb();
                });
            }
        },

        function(err,results){

            if(err){
                throw err;
            }
            res.render('business/dashboard',
                {
                    title: 'Express',
                    notsigned: notemployee,
                    signed: employeee
                }


        )}
    )};

/**
 * Takes a req and res parameters and is inputted into function to get employee, notemployee, and business data.
 *  Allows the User to input specified data and make changes
 * @param req and res The two parameters passed in to get the apprporiate employee,
 * @returns The appropriate data about the employee
 */
exports.post = function(req,res){
       var parsed = baby.parse(req.body.csvEmployees);
       var rows = parsed.data;
       var database =  req.db;
       var employeeDB = database.get('employees');
       var businessID = req.user[0].business;

        for(var i = 0; i < rows.length; i++){
            var username = rows[i][0];
            console.log(rows[i][0]);
            //console.log(rows[i][1]);
            //var email = rows[i][1];
            var nameArr = username.split(' ');
			var fname = nameArr[0];
            console.log(fname);
			var lname = nameArr[1];
            console.log(lname);
            var email = nameArr[2];
            console.log(email);
            var token = randomToken();
            employeeDB.insert({
                business: ObjectId(businessID),
                fname: fname,
                lname: lname,
                email: email,
                registrationToken : token,
                password: '',
                phone: '',
                smsNotify: true,
                emailNotify: true,
                //values of role saasAdmin, busAdmin, provider, staff, visitor
                role: 'provider'
            });


              //sendgrid.send({
                //to: email,
                //from: 'test@localhost',
                //subject: 'Employee Signup',
                //text: 'Hello ' + username + ',\n\n' + 'Please click on the following link, or paste this into your browser to complete sign-up the process: \n\n' +
                //'http://robobetty-dev.herokuapp.com/employeeregister?token=' + token
            //},
            //function(err){
            //    if (err) {
            //        return next(err);
            //    }
            //  });
        }
        //res.redirect('../' + req.user[0].business + '/dashboard');
        res.redirect('/');
}


 function randomToken() {
        return crypto.randomBytes(24).toString('hex');
    }
