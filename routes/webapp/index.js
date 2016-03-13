var express = require('express');
var router = express.Router();

//Define the controllers for saas admin (Peter) process
var landing = require('./admin/landing');
var register = require('./admin/register');
var registerprocess = require('./admin/registerprocess');
var login = require('./admin/login');
var analytics = require('./admin/analytics');

//Define the controllers for business owner (Person purchasing the product) process
var accountsettings = require('./business/accountsettings');
var addemployees = require('./business/addemployees');
var getemployees = require('./business/getemployees');
var addoneemployee = require('./business/addoneemployee');
var formbuilder = require('./business/formbuilder');
var dashboard = require('./business/dashboard');
var businesssetting = require('./business/businesssetting');
var uploadLogo = require('./business/uploadlogo');
//var checkindesign = require('./business/checkindesign');
//var customizeform = require('./business/customizeform');
//var analytics = require('./business/analytics');
//var billing = require('./business/billing');
var admin = require('./admin/admin');
var forgotpassword = require('./business/forgotpassword');
var checkin = require('./business/checkin');


//Define the controllers for provider (Doctors or person to see visitor) process
//var visitorassigned = require('./provider/visitorassigned');
var visitorassigned = require('./provider/visitorassigned');

//Define the controllers for staff (receptionist person to assist visitors)process
var visitor = require('./staff/visitor');

//Define the controllers for visitor (person checkin in) process





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
    router.post('/:id/admin', isLoggedInSaaSAdmin, admin.post);

    //Setup the routes for business owner (Person purchasing the product)
    //router.get('/uploadlogo', uploadLogo.get);
    router.post('/uploadlogo', uploadLogo.post);

    router.get('/:id/dashboard', updateBusiness, isLoggedInBusAdmin, dashboard.get);
    router.post('/:id/dashboard', updateBusiness, isLoggedInBusAdmin, dashboard.post);

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

    router.get('/forgotpassword', forgotpassword.get);

    //router.get('/customizetheme', isLoggedInBusAdmin, customizetheme.get);

    //Setup the routes for provider
    router.get('/:id/visitorassigned', updateBusiness, isLoggedInProvider, visitorassigned.get);

    //setup the routes for staff
    router.get('/:id/visitor', updateBusiness, isLoggedInStaff, visitor.get);
    router.post('/:id/visitor', updateBusiness, isLoggedInStaff, visitor.post);

    //setup the routes for visitor
    router.get('/:id/checkin', isLoggedInVisitor, checkin.get);

    router.post('/:id/checkin', isLoggedInVisitor, checkin.post);

    router.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

// route middleware to make sure a user is authorized to view the page
// User will be denied access if session is not correct
function isLoggedInSaaSAdmin(req, res, next) {
        //if user(saas admin) is authenticated in the session, carry on
        if (req.isAuthenticated() && (req.user[0].role === 'saasAdmin') || req.user[0].role === 'busAdmin'){
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

