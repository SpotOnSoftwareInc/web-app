exports.post = function (req, res) {
    var aptDB = req.db.get('appointment');
    var name = req.body.visitorName;

    console.log(req);
    aptDB.remove({_id: name});

    res.redirect('../' + req.user[0].business + '/visitor');
};
