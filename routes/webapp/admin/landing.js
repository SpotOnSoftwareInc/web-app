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

    var companyName = req.body.companyName,
        name = req.body.name,
        nameArr = name.split(' '),
        fname = nameArr[0],
        lname = nameArr[1],
        email = req.body.email;
    console.log('value of lname = ' + lname);

    if (companyName === '' || fname === '' || lname === undefined || email === '') {

        //req.flash('errorMessage', 'No errors, you\'re doing fine');
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
