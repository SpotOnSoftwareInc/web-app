/**
 * Created by sean on 3/11/2016.
 */

exports.post= function (req, res) {

    console.log('BREAKING IN HERE');
    var image = req.body.uploadimg;
    var imgtitle = req.body.title;
    var businessDB = req.db.get('businesses');
    var bid = req.user[0].business;
    var cloudinary = req.cloud;

    cloudinary.uploader.upload(image, function (result) {
        console.log('mehhhhhh');
        console.log(result)
    });

    res.render('admin/registerprocess', {
        title: 'Uploaded'
    });

};
