exports.get = function (req, res) {
    console.log('Get function in admin to get businesses');
    var database = req.db;
    var businessDB = database.get('businesses');
    var bid = req.user[0].business;

    businessDB.find()
        .on('success', function(businesses) {

            console.log(businesses);

            res.render('admin/admin', {
                bizz: businesses,
                message: req.flash("permission")
            });

        });
};


exports.post = function (req, res) {
    console.log("Post Function for admin page to delete functions ");
    //Removing a user
    console.log(req.body);
    var bid = req.body.bizId.toString();
    var businesses = req.body.bizzes;

    var database = req.db;
    var businessDB = database.get('businesses');

    businessDB.remove({_id: bid});

    businessDB.find()
        .on('success', function(businesses) {

            console.log(businesses);

            res.render('admin/admin', {
                bizz: businesses,
                message: req.flash("permission")
            });

        });

};

