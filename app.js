var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var multer = require('multer');
var passport = require('passport');
var async = require('async');
var favicon = require('serve-favicon');
//var cloudinary = require('cloudinary').v2;
var app = express();

global.__base = __dirname + '/';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

//Database
var development = 'localhost:27017/robobetty';
var monk = require('monk');
var mongoURI = process.env.MONGOLAB_URI || development;
console.log('I AM HERE');
console.log('Connecting to DB: ' + mongoURI);
var db = monk(mongoURI);

//var cloudinaryURI = process.env.CLOUDINARY_URL;
//cloudinary.config(cloudinaryURI);
//cloudinary.config({
//    cloud_name: 'ha9cind6w',
//    api_key: '491512592115195',
//    api_secret: 'U2kBkejmgyq8dEYQ8W72e9enMXA'
//});

//login config
var businesses = db.get('businesses');
var employee = db.get('employees');

//passport functions to Serialize and Deserialize users
passport.serializeUser(function (user, done) {
    done(null, user._id);
});

// used to deserialize the user
passport.deserializeUser(function (id, done) {

    employee.find({_id: id}, function (err, user) {
        if (err) {
            done(err);
        }

        if (user) {
            done(null, user);
        }
    });
});

require('./config/passport')(passport); // pass passport for configuration

var webappRoutes = require('./routes/webapp')(passport);

// needed for passport and express
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'static')));  GOLDTEAM



//app.use(cloudinary({
//    cloud_name: 'ha9cind6w',
//    api_key: '491512592115195',
//    api_secret: 'U2kBkejmgyq8dEYQ8W72e9enMXA'
//}));

//Not sure what this does but I believe it allows you to upload images
app.use(multer({
    dest: __dirname + '/public/images/uploads/',
    onFileUploadStart: function (file) {
        console.log(file.mimetype);
        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
            return false;
        } else {
            console.log(file.fieldname + ' is starting ...');
        }
    },
    onFileUploadData: function (file, data) {
        console.log(data.length + ' of ' + file.fieldname + ' arrived');
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path);
    }
}));

//so... when only using router, for some reason deserialize wont work
//but when using both or just app.use(session), the route works
//note to j  //GOLDTEAM

// required for passport
app.use(session({
    secret: '1234567890QWERTY',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//Access control required for routes and passport
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'fonts.googleapis.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Origin, X-Requested-With, Accept');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-withCredentials', true);
    next();
});

// Make our db accessible to our router
app.use(function (req, res, next) {
    req.db = db;
    //req.cloud = cloudinary;
    req.passport = passport;
    req.app = app;
    next();
});

// Set Webapp Routes
//app.use('/office', require('./routes/webapp/checkin'));  //GOLDTEAM
app.use('/', webappRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.render('errors/404', {
        message: err.message,
        error: err
    });
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === development) {
    app.use(function (err, req, res) {
        console.error(err);
        console.error(err.stack);
        res.status(err.status || 500);
        res.render('errors/404', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500);
    res.render('errors/404', {
        message: err.message,
        error: {}
    });
});

exports = module.exports = app;

//GOLD TEAM ROUTES FOR MOBILE IOS AND ANDROID
// Load Routes for Mobile
//var mobileAuth = require('./routes/api/auth');
//var mobileForm = require('./routes/api/form');
//var mobileAppointment = require('./routes/api/appointment');
//var mobileToken = require('./routes/api/mobiletoken');
//var business = require('./routes/api/business');

//GOLD TEAM CREATED MOBILE APPS FOR IOS AND ANDROID
// Set Mobile Routes
//app.use('/', mobileAuth);
//app.use('/api/m/form', mobileForm);
//app.use('/api/m/appointment', mobileAppointment);
//app.use('/api/m/mobiletoken', mobileToken);
//app.use('/api/m/business', business);
//app.use('/api/m/example', require('./routes/api/example'));
//app.use('/api', require('./routes/webapi'));
