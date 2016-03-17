var crypto = require('crypto');
var baby = require('babyparse');
var async = require('async');
var ObjectId = require('mongodb').ObjectID;
var auth = require('../../../lib/auth');
var bcrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');
var smtpTransport = require("nodemailer-smtp-transport");

/**
 * Takes a req and res parameters and is inputted into function to get employee, notemployee, and business data.
 *
 * @param req and res The two parameters passed in to get the apprporiate employee,
 * @returns The appropriate data about the employee
 */
exports.get = function(req,res){
    console.log('Get function addoneemployees');
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

    //console.log(res);
    console.log('breaks here add one employee');
    //var parsed = baby.parse(req.body.csvEmployees);
    //var rows = parsed.data;
    var database =  req.db,
        employeeDB = database.get('employees'),
        businessID = req.user[0].business.toString(),
        fname = req.body.fname,
        lname = req.body.lname,
        email = req.body.email,
        role = req.body.role,
        defaultPW = 'canthackus',
        password = auth.hashPassword(defaultPW),
        token = randomToken();

    employeeDB.insert({
        business: ObjectId(businessID),
        fname: fname,
        lname: lname,
        email: email,
        registrationToken : token,
        password: password,
        phone: '',
        smsNotify: true,
        emailNotify: true,
        //values of role saasAdmin, busAdmin, provider, staff, visitor
        role: role
    });

    var transport = nodemailer.createTransport(smtpTransport({
        service:'gmail',
        auth : {
            user : "ireceptionistcorp@gmail.com",
            pass : "sossossos"
        }
    }));
    console.log('BREAKING HERE');
    var mailOptions = {
        to: email,
        from: 'iReceptionistCorp@gmail.com',
        subject: 'Welcome to iReceptionist',
        text: 'Hello,\n\n' +
        'A business admin from ' + businessID + ' has added you as an employee for iReceptionist service\n\n' +
        'Click the following link to complete setting up your account:\n' +
        'http://' + req.headers.host + '/reset/' + token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    };
    console.log('BREAKING HERE 2');
    transport.sendMail(mailOptions, function(err) {
        //req.flash('info', 'An e-mail has been sent to ' + email + ' with further instructions.');
        console.log(err);
        //done(err, 'done');
    });

    res.redirect('../' + req.user[0].business + '/dashboard');
    //res.redirect('/');
};


function randomToken() {
    return crypto.randomBytes(24).toString('hex');
}
