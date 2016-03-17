/**
 * Created by sean on 2/18/2016.
 */

exports.get = function (req, res) {


    console.log('Inside register process get method');
    var businessDB = req.db.get('businesses'),
        bid = req.user[0].business;



    businessDB.findById(bid)
        .on('success', function(newBiz) {
            res.render('admin/registerprocess', {
                companyName: newBiz.companyName,
                businessdb: '/' + newBiz._id + '/dashboard',
                checkinFrame: '/' + newBiz._id + '/checkin',
                companyAddress: newBiz.companyAddress,
                phone: newBiz.phone,
                theme: newBiz.theme,
                logo: newBiz.logo

            });
        });
};

exports.post = function (req, res) {

    var companyName = req.body.companyName;
    var companyAddress = req.body.companyAddress;
    var phone = req.body.phone;

    var callingFunc = req.body.callingFunc;
    var planName = req.body.planName;

    var businessDB = req.db.get('businesses');
    var bid = req.user[0].business;

    console.log('**Inside register process post method');
    console.log(businessDB);

    /* User selecting payment plan */
    if( callingFunc == 'updatePlan') {
        console.log('**Updating plan');
        businessDB.findAndModify({
            query: {_id: bid},
            update: {
                $set: {
                    plan: planName
                }
            }
        });
    }
    else {

        businessDB.findAndModify({
            query: {_id: bid},
            update: {
                $set: {
                    companyName: companyName,
                    companyAddress: companyAddress,
                    phone: phone
                }
            }
        });

        //res.render('admin/registerprocess', {
        //    companyName: companyName,
        //    companyAddress: companyAddress,
        //    phone: phone
        //});
        res.redirect('/registerprocess');
    }
    //res.end(fname + companyName + email + password + username);

};
