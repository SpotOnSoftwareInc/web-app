/**
 * Created by sean on 2/18/2016.
 */

exports.get = function (req, res) {


    console.log('Inside register process get method');
    var businessDB = req.db.get('businesses');
    var bid = req.user[0].business;

    businessDB.findById(bid)
        .on('success', function(newBiz) {
            res.render('admin/registerprocess', {
                companyName: newBiz.companyName
            });
        });
};

exports.post = function (req, res) {

    var companyName = req.body.companyName;
    var companyAddress = req.body.companyAddress;
    var phone = req.body.phone;

    var businessDB = req.db.get('businesses');
    var bid = req.user[0].business;

    console.log('Inside register process post method');
    console.log(businessDB);

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

    res.render('admin/registerprocess', {
        companyName: companyName,
        companyAddress: companyAddress,
        phone: phone
    });

    //res.end(fname + companyName + email + password + username);

};
