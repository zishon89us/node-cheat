
// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
var fs  = require('fs');
/*file have a path of file present on server*/

//------------------------------------------------------
//Configure the SDK
//Web Link=> http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html#Credentials_from_Disk
//------------------------------------------------------

AWS.config.loadFromPath('../config.json');
//------------------------------------------------------
//Uploading file from base 64 data
//------------------------------------------------------

/* :::Arguments
   base64Data, (File base 64 data)
   filename, (File name to save on bucket)
   contentType (Content type of file)
   bucket  (Bucket name on which file needs to upload)
   */
/*contentType = contentType || 'image/png';
filename = filename;

var buf = new Buffer(base64Data,'base64');//Creating a buffer for base64 data

var s3bucket = new AWS.S3({params: {Bucket: bucket}});
s3bucket.createBucket(function(){
    var imageData = {
        Key: filename,
        Body: buf,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg'
    };
    s3bucket.upload(imageData, function(err, data) {
        if (err) {
            console.log('ERROR MSG: ', err);
        } else {
            console.log('Successfully uploaded data');
        }

    });
});*/
