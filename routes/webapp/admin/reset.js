
exports.get = function(req, res) {
    console.log('Get function login');
    //req.logout();
    res.render('admin/reset',{
        //message: req.flash("login")
    });
};


