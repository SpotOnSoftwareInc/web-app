/**
 * Created by kurtalang on 3/16/16.
 */
var cfg = {};

cfg.accountSid = 'AC4248ece54272fb35902a39b40874640f';
cfg.authToken = 'cd1fee451a0e00fdb14437517ee53225';
cfg.sendingNumber = '+17692084954';

var requiredConfig = [cfg.accountSid, cfg.authToken, cfg.sendingNumber];
var isConfigured = requiredConfig.every(function(configValue) {
    return configValue || false;
});

if (!isConfigured) {
    var errorMessage =
        'TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_NUMBER must be set.';

    throw new Error(errorMessage);
}

// Export configuration object
module.exports = cfg;
