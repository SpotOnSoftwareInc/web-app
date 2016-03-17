/**
 * Created by kurtalang on 3/16/16.
 */
var settings = require('./twilio-settings');
var client = require('twilio')(settings.accountSid, settings.authToken);

module.exports.sendSmsToPhoneNumber = function(to, message) {
    client.messages.create({
        body: message,
        to: to,
        from: settings.sendingNumber
//  mediaUrl: imageUrl
    }, function(err, data) {
        if (err) {
            console.error('Could not notify administrator');
            console.error(err);
        } else {
            console.log('Administrator notified');
        }
    });
};
