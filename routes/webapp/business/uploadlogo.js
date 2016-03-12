var fs = require('fs');
var auth = require('../../../lib/auth');

exports.get = function(req, res, next){
    var db = req.db;
    var businesses = db.get('businesses');
    var businessID = req.user[0].business;

    businesses.findById(businessID,
        function (err, results){
            if(err){
                return next(err);
            }

            if(results.logo){

                res.render('admin/registerprocess',
                    {title:'Upload Logo',logo: results.logo});
            }
            else{
                res.render('admin/registerprocess',
                    {title:'Upload Logo'});
            }
        }
    );

};

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


                res.render('admin/registerprocess',{
                    success:'Succesfully uploaded file: '+req.files.userLogo.originalname,
                    logo:'../images/uploads/'+req.files.userLogo.name
                });

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
                    res.render('admin/registerprocess',{
                        title:'Upload Logo',
                        logo:results.logo,
                        error:'Please select a valid image(png,jpg) file to upload.'
                    });
                }
                else{
                    res.render('admin/registerprocess',{
                        title:'Upload Logo',
                        error:'Please select a valid image(png,jpg) file to upload.'
                    });
                }
            }
        );
    }

};
