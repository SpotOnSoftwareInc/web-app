/**
 * Created by orion on 3/13/2016.
 */
exports.post = function (req, res) {

    var emailSetting = req.body.emailCheckbox;
    var businessDB = req.db.get('businesses');
    var bid = req.user[0].business;

    console.log('MAJOR FUCKING KEYS !!!!! Inside register process post method4');
    console.log("notifications for " + emailNotif + " email??");
    //console.log(businessDB);

    businessDB.findAndModify({
        query: {_id: bid},
        update: {
            $set: {
                emailNotify: emailNotif
            }
        }});

    //res.render('admin/registerprocess', {
    //    companyName: companyName,
    //    companyAddress: companyAddress,
    //    phone: phone
    //});
    res.redirect('/registerprocess');

    //res.end(fname + companyName + email + password + username);

};
