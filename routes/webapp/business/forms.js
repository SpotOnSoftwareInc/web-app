var async = require('async');

/**
 * Schema for form looks like
 *      {
 *          hidden: boolean,
 *          label: 'name of label',
 *          password: boolean,
 *      }
 */

var auth = require ('../../../lib/auth');
exports.get = function (req,res) {
    console.log('Get function Forms');
    var bid = req.user[0].business;
    var db = req.db;
    var businesses = db.get('businesses');
    businesses.findById(bid, function (err, result) {
        if (err) {
            return next(err);
        }
        res.render('business/checkin', {
            form1: result.form1,
            form2: result.form2,
            form3: result.form3,
            form4: result.form4
        });
    });
};


exports.post = function (req, res) {
    var db = req.db;
    var businesses = db.get('businesses');
    var bid = req.user[0].business;

    var form1 = req.body.form1;
    var form2 = req.body.form2;
    var form3 = req.body.form3;
    var form4 = req.body.form4;

    businesses.findById(bid, function (err, result) {
        if (err) {
            return next(err);
        }
        businesses.update({_id:bid}, {
            //writes in database
            $set :{
                form1: form1,
                form2: form2,
                form3: form3,
                form4: form4
            }
        });
    });
};
