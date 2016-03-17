/**
 * Created by sean on 3/7/2016.
 */
exports.get = function (req, res) {
    console.log('Get function forgotpassword');
    res.render('business/forgotpassword', {title: 'Express'});
};

