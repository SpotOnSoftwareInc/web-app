// config/passport.js

//monk and db are neeeded because pass.deserialize doesnt pass a req parameter,
//so in order to find the correct id in mongo, we need to make a connection to database and findbyid

var LocalStrategy = require('passport-local').Strategy;
var auth = require('../lib/auth');
var ObjectId = require('mongodb').ObjectID;
var async = require('async');
var bcrypt = require('bcrypt-nodejs');
//need this since we are passing in a passport dependency in app.js line 58
module.exports = function (passport) {


// =========================================================================
// LOCAL SIGNUP ============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'

    // Adding a business
    passport.use('local-signup', new LocalStrategy({

            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) {
            password = auth.hashPassword(password);
            var business = {
                email: email,
                password: password,
                companyName: req.body.companyName,
                phone: '',
                fname: req.body.fname,
                lname: req.body.lname,
                logo: '',
                walkins: false
            };
            if (business.fname === ''       ||
                business.companyName === '' ||
                business.email === ''       ||
                business.password === ''    ||
                business.lname === '') {
                req.flash('Missing Parameters', 'Please fill in all fields');
                return;
            }
            var db = req.db;
            var businesses = db.get('businesses');
            businesses.findOne({'email': email}, function (err, found) {
                // if there are any errors, return the error

                if (err) {
                    console.log('error in call');
                    return done(err);
                }

                // check to see if theres already a user with that email
                if (found) {
                    console.log('user exists');
                    console.log(found);
                    return done(null, false);
                } else {
                    console.log('business added ' + business);
                    addBusiness(req, business, done);
                }
            })
        }
    ));

    // Adding employees
    passport.use('local-employee-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, email, password, done) {
        password = auth.hashPassword(password);
        var employee = {
            business: ObjectId(req.business.id),
            password: password,
            fname: req.fname,
            lname: req.lname,
            email: email,
            smsNotify: true,
            emailNotify: true,
            role: 'busAdmin',
            resetPasswordToken: undefined,
            resetPasswordExpires: undefined
        };
        console.log("Adding Employee: ");
        console.log(employee);
        addEmployee(req,employee, done);
    }));

    var addEmployee = function(req, employee, done){
        var db = req.db;
        var employees = db.get('employees');
        if (employee.fname === ''       ||
            employee.business === ''    ||
            employee.role === ''        ||
            employee.email === ''       ||
            employee.password === ''    ||
            employee.lname === ''){
            req.flash('Missing Parameters', 'Please fill in all fields');
            return;
        }
        employees.insert(employee,function(err, user){
            if (err) {
                throw err;
            }
            return done(null, user);
        });
    };

    var addBusiness = function(req, business, done){
        var db = req.db;
        var businesses = db.get('businesses');
        // First check to see if there is a buisness that exists with

        var password = auth.hashPassword(business.password);

        // save the user
        businesses.insert(business, function (err, result) {

            if (err) {
                throw err;
            }
            console.log('business is definitely inserted');
            var businessID = result._id.toString();
            var admin = {
                business: ObjectId(businessID),
                password: result.password,
                phone: result.phone,
                fname: result.fname,
                lname: result.lname,
                email: result.email,
                smsNotify: true,
                emailNotify: true,
                role: 'busAdmin'
            };
            addEmployee(req,admin,done);
        });
    };

    // Modifying employees
    passport.use('local-signup-employee',new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
        function (req,email,password,done) {
            var db =req.db;
            var employee = db.get('employees');

            password = auth.hashPassword(password);

            employee.findAndModify({
             query: {registrationToken: req.params.token},
             update: { $unset: {registrationToken: 1},
                $set: {password: password} },
             new: true},
                function (err,user){
                if (err) {
                     throw err; }
                return done(null,user);

                 }
            );
        }
    ));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) { // callback with email and password from our form
            //console.log('LOCAL-LOGIN');
            var employees = req.db.get('employees');
            employees.findOne({email: email},
                function (err,employee){
                    console.log("Im here");
                    if(err){
                        console.error('validateLogin DB Error: ' + err);
                    } else if(!employee){
                        // error
                    }
                    if(bcrypt.compareSync(password, employee.password)){
                        console.log("Success");
                        return done(null, employee);
                    } else {
                        console.log("Failure");
                        return done(null, employee);
                    }
                }
            );

        }
    ));

};
