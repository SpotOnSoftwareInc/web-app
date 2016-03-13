exports.get = function (req, res, next) {
    console.log('Get function LANDING');

	req.session.save(function (err) {

            if (err) {

                return next(err);
            }
        });

    res.render('admin/landing', {title: 'Landing Page'});
};

exports.post = function (req, res, next) {
    console.log('POST function LANDING');
    //var database =  req.db;
    //var businessDB = database.get('businesses');
    var companyName = req.body.companyName;
    var name = req.body.name;
    //var nameArr = name.split(' ');
    //var fname = nameArr[0];
    //var lname = nameArr[1];
    var email = req.body.email;

    if (companyName === '' || name === '' || email === '') {

        res.redirect('/');
    } else {



        req.session.save(function (err) {

            if (err) {

                return next(err);
            }

            res.redirect('/register');
        });
    }
};
