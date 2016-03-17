/**
 * Created by kurtalang on 3/15/16.
 */
exports.get = function(req, res) {
    console.log('Get function done');

    var bid = req.user[0].business;
    var db = req.db;
    var businesses = db.get('businesses');
    businesses.findById(bid, function (err, result) {
        if (err) {
            return next(err);
        }
        var dbBusiness = result;

        if(!dbBusiness.theme){
            // default theme (BG)
            dbBusiness.theme = '/images/landing/pika.jpg';
        }

        res.render('business/done', {
            theme: dbBusiness.theme
        });

    })};

