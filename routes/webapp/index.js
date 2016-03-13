var express = require('express');
var router = express.Router();

//Define the controllers for saas admin (Peter) process
var landing = require('./admin/landing');
var register = require('./admin/register');
var registerprocess = require('./admin/registerprocess');
var login = require('./admin/login');
var reset = require('./admin/reset');
var analytics = require('./admin/analytics');
//Define the controllers for business owner (Person purchasing the product) process
var accountsettings = require('./business/accountsettings');
var addemployees = require('./business/addemployees');
var getemployees = require('./business/getemployees');
var addoneemployee = require('./business/addoneemployee');
var formbuilder = require('./business/formbuilder');
var dashboard = require('./business/dashboard');
var businesssetting = require('./business/businesssetting');
var nodemailer = require('nodemailer');
var smtpTransport = require("nodemailer-smtp-transport");
var async = require('async');
var crypto = require('crypto');
var auth = require('../../lib/auth.js');
//var checkindesign = require('./business/checkindesign');
//var customizeform = require('./business/customizeform');
//var analytics = require('./business/analytics');
//var billing = require('./business/billing');
var admin = require('./admin/admin');
var forgotpassword = require('./business/forgotpassword');

//Define the controllers for provider (Doctors or person to see visitor) process
//var visitorassigned = require('./provider/visitorassigned');
var visitorassigned = require('./provider/visitorassigned');

//Define the controllers for staff (receptionist person to assist visitors)process
var visitor = require('./staff/visitor');

//Define the controllers for visitor (person checkin in) process
var checkin = require('./visitor/checkin');





module.exports = function (passport) {

    /**
     *  Setup the routes for saas admin (Peter)
     *  General routes applicable to all will be placed here
     *  Order reflects the order in which user will see each page
     *  Authentication routes located here as well
     */

    router.get('/', landing.get);
    router.post('/', landing.post);

    router.get('/register', register.get);
    router.post('/register',passport.authenticate('local-signup'),
        //session: false,
        //successRedirect : '/registerprocess', // redirect to the secure register process section
        //failureRedirect : '/register' // redirect back to the register page if there is an error
    passport.authenticate('local-login'),
        function(req, res) {
            if(req.user.role === 'busAdmin') {
                //console.log(user);
                console.log("Loggin in as Business Admin");
                res.redirect('/registerprocess');
            }
            else {
                console.log("Loggin in as SAAS Admin");
                res.redirect('/admin');
            }
        });



    router.get('/registerprocess', registerprocess.get);
    router.post('/registerprocess', registerprocess.post);

    router.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    router.post('/forgotpw', function(req, res, next){
        async.waterfall([
            function(done) {
                // Generate a unique token
                crypto.randomBytes(20, function (err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },function(token, done) {
                var db = req.db;
                var employees = db.get('employees');

                // Find user in db and set token and expire time of token
                employees.findAndModify(
                    {email: req.body.email},
                    {
                        $set: {
                            resetPasswordToken: token,
                            resetPasswordExpires: Date.now() + 3600000
                        }
                    },
                    { new: true },
                    function(err, doc){
                        if(err || !doc){
                            res.redirect('/register');
                        } else {
                            done(null, token);
                        }
                    }
                );
            },function(token, done) {
                // Send a reset password link to the user

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
                    subject: 'Password Reset',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };

                // Send the user an email
                transport.sendMail(mailOptions, function(err) {
                    req.flash('info', 'An e-mail has been sent to ' + req.body.email + ' with further instructions.');
                    done(err, 'done');
                });
            }
        ],function(err) {
            if (err) return next(err);
            res.redirect('/register');
        });
    });

    router.post('/reset/:token', function(req, res) {
        async.waterfall([
            function(done) {
                var db = req.db;
                var employees = db.get('employees');
                // TODO: Need logic to make sure password and confirm password are the same before moving on

                var pass = auth.hashPassword(req.body.password);

                // Update users password with the new password and invalidate the token and expire time
                employees.update(
                    {resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } },
                    {
                        $set: {
                            password: pass,
                            resetPasswordToken: undefined,
                            resetPasswordExpires: undefined
                        }
                    },
                    function(err, doc){
                        if(err || ! doc){
                           // Error: user does not exist
                        }
                        // Password reset successfully
                        res.redirect('/register');
                    }
                );
            }
        ], function(err) {
            res.redirect('/');
        });
    });


    router.get('/login', login.get);
    router.post('/login', passport.authenticate('local-login'),
        //Direct type of user to correct page upon signup
        function(req, res) {
            if (req.user.role === 'busAdmin') {
                console.log("Loggin in as Business Admin");
                res.redirect('/' + req.user._id + '/dashboard');
            }
            else if (req.user.role === 'saasAdmin') {
                console.log("Loggin in as SAAS Admin");
                res.redirect('/' + req.user._id+ '/admin');
            }
            else if (req.user.role === 'provider') {
                console.log("Loggin in as Provider");
                res.redirect('/' + req.user._id + '/visitorassigned');
            }
            else if (req.user.role === 'staff') {
                console.log("Loggin in as staff");
                res.redirect('/' + req.user._id + '/visitor');
            }
            else if (req.user.role === 'visitor') {
                console.log("Loggin in as visitor");
                res.redirect('/' + req.user._id + '/checkin');
            }
            else {
                res.redirect('/register');
                req.flash("Invalid", "Invalid email and/or password");
            }

        });

    router.get('/:id/admin', isLoggedInSaaSAdmin, admin.get);

    //Setup the routes for business owner (Person purchasing the product)
    router.get('/:id/dashboard', updateBusiness, isLoggedInBusAdmin, dashboard.get);

    router.get('/:id/accountSettings', updateBusiness, isLoggedInBusAdmin, accountsettings.get);
    router.post('/:id/accountSettings', isLoggedInBusAdmin, accountsettings.post);

    router.get('/:id/businesssetting', updateBusiness, isLoggedInBusAdmin, businesssetting.get);
    router.post('/:id/businesssetting', isLoggedInBusAdmin,businesssetting.post);

    router.get('/:id/addemployees',isLoggedInBusAdmin, addemployees.get);
    router.post('/:id/addemployees', isLoggedInBusAdmin, addemployees.post);

    router.get('/:id/addoneemployee',isLoggedInBusAdmin, addoneemployee.get);
    router.post('/:id/addoneemployee', isLoggedInBusAdmin, addoneemployee.post);

    router.get('/:id/formbuilder', updateBusiness, isLoggedInBusAdmin, formbuilder.get);

    router.get('/:id/getemployees', isLoggedInBusAdmin, getemployees.get);

    router.get('/reset/:token', reset.get);


    //router.get('/customizetheme', isLoggedInBusAdmin, customizetheme.get);

    //Setup the routes for provider
    router.get('/:id/visitorassigned', updateBusiness, isLoggedInProvider, visitorassigned.get);

    //setup the routes for staff
    router.get('/:id/visitor', updateBusiness, isLoggedInStaff, visitor.get);

    //setup the routes for visitor
    router.get('/:id/checkin', isLoggedInVisitor, checkin.get);

    router.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

// route middleware to make sure a user is authorized to view the page
// User will be denied access if session is not correct
function isLoggedInSaaSAdmin(req, res, next) {
        //if user(saas admin) is authenticated in the session, carry on
        if (req.isAuthenticated() && (req.user[0].role === 'saasAdmin')){
            return next();
        }
        // if they aren't redirect them to the home page
        res.redirect('back');
        req.flash("permission", "You do not have permission to access that page");
    }
function isLoggedInBusAdmin(req, res, next) {
        //if user (business admin) is authenticated in the session, carry on
        if (req.isAuthenticated() && ((req.user[0].role === 'busAdmin') || (req.user[0].role === 'saasAdmin'))){
            return next();
        }
        // if they aren't redirect them to the home page
        res.redirect('back');
        req.flash("permission", "You do not have permission to access that page");
}

function isLoggedInProvider(req, res, next) {
        //if user (Provider) is authenticated in the session, carry on
        if (req.isAuthenticated() && ((req.user[0].role === 'provider') || (req.user[0].role === 'busAdmin') || (req.user[0].role === 'saasAdmin'))){
            return next();
        }
        // if they aren't redirect them to the home page
        res.redirect('back');
        req.flash("permission", "You do not have permission to access that page");
}
function isLoggedInStaff(req, res, next) {
        //if user (Staff) is authenticated in the session, carry on
        if (req.isAuthenticated() && ((req.user[0].role === 'staff') || (req.user[0].role === 'busAdmin') || (req.user[0].role === 'saasAdmin'))){
            return next();
        }
        // if they aren't redirect them to the home page
        res.redirect('back');
        req.flash("permission", "You do not have permission to access that page");
}
function isLoggedInVisitor(req, res, next) {
        //if user (Visitor) is authenticated in the session, carry on
        if (req.isAuthenticated() && ((req.user[0].role === 'visitor') || (req.user[0].role === 'busAdmin') || (req.user[0].role === 'saasAdmin'))){
            return next();
        }
        // if they aren't redirect them to the home page
        res.redirect('back');
        req.flash("permission", "You do not have permission to access that page");
}
        return router;
};
function updateBusiness(req, res, next) {
    //Simple case: first time on the page
    if (!req.session.business) {
        req.db.get('businesses').findById(req.params.id, function (err, business) {
            if (err) {
                return next(err);
            }
            req.session.business = business;
            req.session.save(function (err) {
                if (err) {
                    return next(err);
                }
                next();
            });
        });
    } else if (req.session.business._id !== req.params.id) {
        //This means the business was switched which could be part of a security attack
        //Destroy the session and then get the new business to be safe
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            }
            req.db.get('businesses').findById(req.params.id, function (err, business) {
                if (err) {
                    return next(err);
                }
                req.session.business = business;
                req.session.save(function (err) {
                    if (err) {
                        return next(err);
                    }
                    next();
                });
            });
        });
    } else { //Everything looks good, do nothing
        next();
    }
}


//GOLD TEAM ROUTING SAVE FOR TESTING
//var theming = require('./theming');
//var formbuilder = require('./formbuilder');
//var accountSettings = require('./accountsettings');
//var uploadLogo = require('./uploadlogo');
//var dashboard = require('./dashboard');
//var registerDevice = require('./registerdevice');
//var addEmployees = require('./addemployees');
//var employeeRegister = require('./employeeregister');
//var viewForm = require('./viewform');
//var customizeTheme = require('./customize_theme');
//var manageForms = require('./manage_forms');
//var businesssetting = require('./businesssetting');
//var setdisclosure = require('./setdisclosure');
//var checkin = require('./checkin');





//GOLD TEAMS ORIGINAL ROUTES
//router.get('/theming', isLoggedInBusAdmin, theming.get);

//router.get('/formbuilder',isLoggedInBusAdmin, formbuilder.get);

//router.get('/uploadlogo', isLoggedInBusAdmin, uploadLogo.get);
//router.post('/uploadlogo', isLoggedInBusAdmin, uploadLogo.post);



//router.get('/registerdevice', isLoggedInBusAdmin, registerDevice.get);

//router.get('/manageforms', isLoggedInBusAdmin, manageForms.get);

//router.get('/employeeregister', employeeRegister.get);
//router.post('/employeeregister', passport.authenticate('local-signup-employee',{
//    //session: false,
//    successRedirect : '/dashboard', // redirect to the secure profile section
//    failureRedirect : '/register' // redirect back to the signup page if there is an error
//}));

//router.get('/viewform/:id', viewForm.get);

//router.get('/setdisclosure', isLoggedInBusAdmin, setdisclosure.get);
//router.post('/setdisclosure', isLoggedInBusAdmin, setdisclosure.post);

//GOLDTEAM GENERIC CHECK IF LOGGED IN AND AUTHORIZED
//function isLoggedIn(req,res,next){
//        if(req.isAuthenticated()){
//            return next();
//        }
//
//        res.redirect('/');
//}

