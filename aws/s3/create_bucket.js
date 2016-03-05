/**
 * Created by Zeeshan on 3/4/2016.
 */

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

//------------------------------------------------------
//Configure the SDK (Only hard code when in testing phase)
//Web Link=> http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html#Hard-Coding_Credentials
//------------------------------------------------------

/*
 var AWS_ACCESS_KEY = "xxxAJ76xxxxxxxxx";//process.env.AWS_ACCESS_KEY;
 var AWS_SECRET_KEY = "xxxxxxZrkJbTxxxxxxxxxxxxxxxxxxxxxx";//process.env.AWS_SECRET_KEY;
 AWS.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
 */

//------------------------------------------------------
//Configure the SDK
//Web Link=> http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html#Credentials_from_Disk
//------------------------------------------------------

AWS.config.loadFromPath('../config.json');

// Set your region for future requests.
//AWS.config.region = 'us-west-2';

//------------------------------------------------------
//Create a bucket
//Web Link=> http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#createBucket-property
//------------------------------------------------------
/*

 var s3bucket = new AWS.S3({params: {Bucket: 'random_bucket_name'}});
 s3bucket.createBucket(function (e, d) {
 if (!e) {
 var params = {Key: 'this_is_key', Body: 'This is data.'};
 s3bucket.upload(params, function (err, data) {
 if (err) {
 console.log("Error uploading data: ", err);
 } else {
 console.log("Successfully uploaded.");
 }
 });
 } else {
 console.log('Error Creating Bucket: ' + e);
 }
 });
 */

//------------------------------------------------------
//Delete bucket Note: All objects in bucket should be DELETED before bucket is deleted
//http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteBucket-property
//------------------------------------------------------
/*
 var s3 = new AWS.S3();
 var params = {
 Bucket: 'random_bucket_name'  //required
 };
 s3.deleteBucket(params, function(err, data) {
 if (err) console.log(err, err.stack); // an error occurred
 else     console.log(data);           // successful response
 });*/

//------------------------------------------------------
//Delete bucket Note: All objects in bucket should be DELETED before bucket is deleted
//http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteBucket-property
//------------------------------------------------------
/*
 var s3 = new AWS.S3();
 var params = {
 Bucket: 'random_bucket_name', *//* required *//*
 Key: 'this_is_key' *//* required *//*
 };
 s3.deleteObject(params, function(err, data) {
 if (err) console.log(err, err.stack); // an error occurred
 else     console.log(data);           // successful response
 });*/


//------------------------------------------------------
//list all buckets
//http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listBuckets-property
//------------------------------------------------------
/*
 var s3 = new AWS.S3();
 s3.listBuckets(function (err, data) {
 if (err) {
 console.log("Error:", err);
 }
 else {
 for (var index in data.Buckets) {
 var bucket = data.Buckets[index];
 console.log("Bucket: ", bucket.Name, ' : ', bucket.CreationDate);
 }
 }
 });*/
