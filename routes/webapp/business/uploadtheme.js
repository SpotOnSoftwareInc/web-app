/**
 * Created by sean on 3/12/2016.
 */
var fs = require('fs');
var auth = require('../../../lib/auth');

exports.post = function(req, res, next){

    var db = req.db;
    var businesses = db.get('businesses');
    var businessID = req.user[0].business;
    if(req.files.userTheme){

        businesses.updateById(businessID, {
                $set: {
                    theme: '../images/uploads/' + req.files.userTheme.name
                }
            },{
                upsert: true
            }, function (err){
                if (err) {
                    return next(err);
                }
                res.redirect('/registerprocess#ptab3');
            }

        );
    }
    else{

        businesses.findById(businessID,
            function (err, results){
                if(err){
                    return next(err);
                }

                if(results.logo){
                    res.redirect('/registerprocess#ptab3');

                }
                else{
                    res.redirect('/registerprocess#ptab3');
                }
            }
        );
    }

};
