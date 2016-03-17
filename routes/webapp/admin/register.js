
exports.get = function (req, res) {
    console.log('Get function REGISTER');

    //var companyName = req.session.companyName;
    //var name = req.session.name;
    ////var nameArr = name.split(' ');
    //var fname = nameArr[0];
    //console.log(fname);
    //var lname = nameArr[1];
    //console.log(lname);
    //var email = req.session.email;

	if (!req.session.companyName) {
        console.log('Get function company name not found');
        res.render('admin/register');
    } else {
        console.log('Get function company found');
        res.render('admin/register', {
            title: 'Express',
            companyName: req.session.companyName
        });
    }
};
