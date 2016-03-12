var fs = require('fs');
var auth = require('../../../lib/auth');

exports.get = function(req, res, next){
    console.log('Get function uploadlogo');
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
console.log('error is in here');
    if(req.files.userLogo){

        businesses.findById(businessID,
            function (err, results){

                if(err){
                    return next(err);
                }

                fs.unlink('public/'+results.logo);
            }
        );
        console.log(req.files.userLogo.name);

        businesses.updateById(businessID, {
                $set: {
                    logo: '/images/uploads/' + req.files.userLogo.name
                }
            },{
                upsert: true
            }, function (err){
                if (err) {
                    console.log('ERROR IN UPLOAD LOGO');
                    return next(err);
                }


                res.render('admin/registerprocess',{
                    success:'Succesfully uploaded file: '+req.files.userLogo.originalname,
                    logo:'/images/uploads/'+req.files.userLogo.name
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
                    console.log('ERROR IN ELSE OF UPLOAD LOGO');

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
