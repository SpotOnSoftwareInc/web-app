var fs = require('fs');
var auth = require('../../../lib/auth');

exports.post = function(req, res, next){

    var db = req.db;
    var businesses = db.get('businesses');
    var businessID = req.user[0].business;
    if(req.files.userLogo){

        businesses.updateById(businessID, {
                $set: {
                    logo: '../images/uploads/' + req.files.userLogo.name
                }
            },{
                upsert: true
            }, function (err){
                if (err) {
                    return next(err);
                }
                res.redirect('/registerprocess');
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
                    res.redirect('/registerprocess');

                }
                else{
                    res.redirect('/registerprocess');
                }
            }
        );
    }

};
