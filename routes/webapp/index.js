var express = require('express');
var router = express.Router();

//Define the controllers for saas admin (Peter) process
var landing = require('./business/landing');
var register = require('./business/register');
var registerprocess = require('./business/registerprocess');
var login = require('./business/login');

//Define the controllers for business owner (Person purchasing the product) process
var accountsettings = require('./business/accountsettings');
var addemployees = require('./business/addemployees');
//var analytics = require('./business/analytics');
//var billing = require('./business/billing');
var businesssetting = require('./business/businesssetting');
//var checkindesign = require('./business/checkindesign');
//var customizeform = require('./business/customizeform');

//var sidepanel = require('./business/sidepanel');

//Define the controllers for provider (Doctors or person to see visitor) process
//var visitorassigned = require('./provider/visitorassigned');

//Define the controllers for staff (receptionist person to assist visitors)process
//var visitor = require('./staff/visitor');

//Define the controllers for visitor (person checkin in) process
var checkin = require('./visitor/checkin');


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


module.exports = function (passport) {



    //Setup the routes for saas admin (Peter)
    //General routes applicable to all will be placed here
    //Order reflects the order in which user will see each page
    //Authentication routes located here as well
    router.get('/', landing.get);
    router.post('/', landing.post);

    router.get('/register', register.get);
    router.post('/register',passport.authenticate('local-signup',{
        session: false,
        successRedirect : '/registerprocess', // redirect to the secure register process section
        failureRedirect : '/register' // redirect back to the register page if there is an error
    }));

    router.get('/registerprocess', registerprocess.get);
    router.post('/registerprocess', registerprocess.post);

    router.get('/login', login.get);
    router.post('/login', passport.authenticate('local-login'),
        //Direct type of user to correct page upon signup
        function(req, res) {
            if (req.user.role === 'busAdmin') {
                console.log("Loggin in as Business Admin");
                res.redirect('/registerprocess');
            }
            else if (req.user.role === 'saasAdmin') {
                console.log("Loggin in as SAAS Admin");
                res.redirect('/registerprocess');
            }
            else if (req.user.role === 'provider') {
                console.log("Loggin in as Provider");
                res.redirect('/registerprocess');
            }
            else if (req.user.role === 'staff') {
                console.log("Loggin in as staff");
                res.redirect('/registerprocess');
            }
            else if (req.user.role === 'visitor') {
                console.log("Loggin in as visitor");
                res.redirect('/registerprocess');
            }
            else {
                res.redirect('/register');
                req.flash("Invalid", "Invalid email and/or password");
            }

        });

    //Setup the routes for business owner (Person purchasing the product)
    router.get('/accountSettings', isLoggedInBusAdmin, accountsettings.get);
    router.post('/accountSettings', isLoggedInBusAdmin, accountsettings.post);

    router.get('/businesssetting', isLoggedInBusAdmin, businesssetting.get);
    router.post('/businesssetting', isLoggedInBusAdmin,businesssetting.post);

    router.get('/addemployees',isLoggedInBusAdmin, addemployees.get);
    //router.post('/addemployees',isLoggedInBusAdmin, addeployees.post);

    //router.get('/customizetheme', isLoggedInBusAdmin, customizetheme.get);

    //Setup the routes for provider

    //setup the routes for staff

    //setup the routes for visitor
    router.get('/:id/checkin', isLoggedInBusAdmin, checkin.get);


    //GOLD TEAMS ORIGINAL ROUTES
    //router.get('/theming', isLoggedInBusAdmin, theming.get);

    //router.get('/formbuilder',isLoggedInBusAdmin, formbuilder.get);

    //router.get('/uploadlogo', isLoggedInBusAdmin, uploadLogo.get);
    //router.post('/uploadlogo', isLoggedInBusAdmin, uploadLogo.post);

    //router.get('/dashboard', isLoggedInBusAdmin, dashboard.get);

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
        if (req.isAuthenticated() && ((req.user[0].role === 'provider') || (req.user[0].role === 'saasAdmin'))){
            return next();
        }
        // if they aren't redirect them to the home page
        res.redirect('back');
        req.flash("permission", "You do not have permission to access that page");
}
function isLoggedInStaff(req, res, next) {
        //if user (Staff) is authenticated in the session, carry on
        if (req.isAuthenticated() && ((req.user[0].role === 'staff') || (req.user[0].role === 'saasAdmin'))){
            return next();
        }
        // if they aren't redirect them to the home page
        res.redirect('back');
        req.flash("permission", "You do not have permission to access that page");
}
function isLoggedInVisitor(req, res, next) {
        //if user (Visitor) is authenticated in the session, carry on
        if (req.isAuthenticated() && ((req.user[0].role === 'visitor') || (req.user[0].role === 'saasAdmin'))){
            return next();
        }
        // if they aren't redirect them to the home page
        res.redirect('back');
        req.flash("permission", "You do not have permission to access that page");
}
        return router;
};