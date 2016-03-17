// config/passport.js

//monk and db are neeeded because pass.deserialize doesnt pass a req parameter,
//so in order to find the correct id in mongo, we need to make a connection to database and findbyid

var LocalStrategy = require('passport-local').Strategy;
var auth = require('../lib/auth');
var ObjectId = require('mongodb').ObjectID;
var async = require('async');
var bcrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');
var smtpTransport = require("nodemailer-smtp-transport");
var crypto = require('crypto');
//need this since we are passing in a passport dependency in app.js line 58
module.exports = function (passport) {


// =========================================================================
// LOCAL SIGNUP ============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'


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
                companyName: companyName,
                companyAddress: '',
                phone: '',
                fname: fname,
                //username: username,
                lname: lname,
                logo: '',
                theme: '',
                billingPlan: '',
                walkins: false,
                form1: form1,
                form2: form2,
                form3: form3,
                form4: form4 // where a form looks like: {hidden:bool,label:'labelName',password:bool}
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
            // Send a reset password link to the user

            // Generate unique token
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                return sendWelcomeMail(req,token,user,done);
            });
        });
    };

    var sendWelcomeMail = function(req,token,user,done){
        // Login to our email
        var transport = nodemailer.createTransport(smtpTransport({
            service:'gmail',
            auth : {
                user : "ireceptionistcorp@gmail.com",
                pass : "sossossos"
            }
        }));

        // Customize the message and message properties
        var mailOptions = {
            to: req.body.email,
            from: 'iReceptionistCorp@gmail.com',
            subject: 'Welcome to iReceptionist',
            text: 'You are receiving this because this email is now registered for our service.\n\n' +
            'Please click on the following link, or paste this into your browser to create your own password:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email.\n'
        };

        // Send the user an email
        transport.sendMail(mailOptions, function(err) {
            req.flash('info', 'An e-mail has been sent to ' + req.body.email + ' with further instructions.');
            done(err, 'done');
        });
        return done(null, user);
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

    //CALL THIS FUNCTION AT THE END OF REGISTER PROCESS
    // TODO: Handle incorrect password gracefully

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) { // callback with email and password from our form
            console.log('LOCAL-LOGIN');

            //auth.validateLogin(req.db, email, password, function(user){
            //    if(!user) {
            //        console.log("user null in validate login");
            //        return done(null, false, password);
            //    }
            //    else {
            //        console.log("LOCAL-LOGIN SUCCESS");
            //        return done(null,user);
            //    }
            //} );
            var employees = req.db.get('employees');
            employees.findOne({email: email},
                function (err,employee){
                    console.log("Im here");
                    if(err){
                        console.error('validateLogin DB Error: ' + err);
                    } else if(!employee){
                        // error
                        console.log("User does not exist");
                    } else if(bcrypt.compareSync(password, employee.password)){
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
