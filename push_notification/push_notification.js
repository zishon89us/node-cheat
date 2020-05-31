/*
 * Created by Muhammad AbdulMoiz on 3/18/2016.
 */
var gcm = require('node-gcm');
var apn = require('apn');
var options = {
    key: "PATH_TO_KEY_FOR_APN",
    passphrase: "APN_PASSPHRASE",
    cert : "CERTIFICATE_FOR_APN"
};
// How to get GCM KEY ? Follow instructions on link: https://pushalert.co/blog/how-to-get-gcm-api-key-project-number/
var sender = new gcm.Sender("GCM_API_KEY");
var apnConnection = new apn.Connection(options);
var PushNotification = function(){};
/*
* SEND will send push notifications to both android and ios
*
* */
PushNotification.prototype.send = function send(androidTokens/*list of android devices tokens*/,
                                                iosTokens /*list of android devices tokens*/,
                                                title, msg, type) {
    if(androidTokens.length){
        /*ANDROID PUSH NOTIFICATION FUNCTIONALITY*/
        var message = new gcm.Message({
            notification: {
                title: title,
                icon: "LAUNCHER_ICON",
                body: msg,
                sound : true,
                type : type,
                payload : {
                    type : 'PAYLOAD_FOR_NOTIFICATION'
                }
            }
        });
        sender.send(message, { registrationTokens: androidTokens }, function (err, response) {
            if(err) {
                console.log('*************ERROR**************')
                console.error(err)
                console.log('*************ERROR**************')
            }
            else 	{
                console.log('*************RESPONSE**************')
                console.error(response);
                console.log('*************RESPONSE**************')
            };
        });
    };
    if(iosTokens.length){
        var notification = new apn.Notification();
        //IN IOS TITLE IS DEFAULT APPNAME
        notification.alert = msg;
        notification.payload = {"description" : msg, "type": type};
        notification.badge = 1;
        notification.sound = "dong.aiff";
        apnConnection.pushNotification(notification, iosTokens);
    }

};



module.exports = {
    pushService : new PushNotification()
};
