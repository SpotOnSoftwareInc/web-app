//var style = require('./../../../lib/style.js');
//
//exports.get = function (req, res, next) {
//    //var business = req.session.business;
//    res.render('business/checkin', {
//        //companyName: business.companyName,
//        //bg: business.style.bg,
//        //logo: business.logo,
//        //buttonBg: style.rgbObjectToCSS(business.style.buttonBg),
//        //buttonText: style.rgbObjectToCSS(business.style.buttonText),
//        //containerText: style.rgbObjectToCSS(business.style.containerText),
//        //containerBg: style.rgbObjectToCSS(business.style.containerBg)
//    });
//};

exports.post = function (req,res) {
    console.log("Someone checking in");

    var appointmentDB = req.db.get('appointment');
    var bid = req.user[0].business.toString();
    var name = req.body.name;
    var curtime = new Date();

    appointmentDB.findAndModify({name: name}, { $set: {
        checkinTime: curtime,
        state: 'waiting'

    } });

    res.redirect('../' + bid + 'checkin');
};
