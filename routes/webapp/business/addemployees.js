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

        var employeeDB = req.db.get('employees'),
            employee,
            notemployee,
            businessID = req.user[0].business.toString();

        async.parallel({
            employee: function(cb){
                employeeDB.find({registrationToken: {$exists: false}, business: ObjectId(businessID)},function (err,results){

                    if (err) { return next(err);  }
                    if(!results) { return next(new Error('Error finding employee'));}

                        employeee = results;
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
        var parsed = baby.parse(req.body.csvEmployees),
            rows = parsed.data,
            database =  req.db,
            employeeDB = database.get('employees'),
            businessID = req.user[0].business.toString();

        for(var i = 0; i < rows.length; i++){
            var username = rows[i][0],
                nameArr = username.split(' '),
			    fname = nameArr[0],
			    lname = nameArr[1],
                email = nameArr[2],
                role = nameArr[3],
                token = randomToken();

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
                role: role
            });
        }
        res.redirect('../' + req.user[0].business + '/dashboard');
};


function randomToken() {
    return crypto.randomBytes(24).toString('hex');
}
