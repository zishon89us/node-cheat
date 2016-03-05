/**
 * Created by Zeeshan on 3/4/2016.
 */

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

//Load the S3 information from the environment variables.
var AWS_ACCESS_KEY = "xxxAJ76xxxxxxxxx";//process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = "xxxxxxZrkJbTxxxxxxxxxxxxxxxxxxxxxx";//process.env.AWS_SECRET_KEY;

AWS.config.update({accessKeyId: AWS_ACCESS_KEY , secretAccessKey: AWS_SECRET_KEY });

// Set your region for future requests.
//AWS.config.region = 'us-west-2';

// Create a bucket using bound parameters and put something in it.
var s3bucket = new AWS.S3({params: {Bucket: 'random_bucket_name'}});
s3bucket.createBucket(function(e,d) {
 if(!e){
  var params = {Key: 'this_is_key', Body: 'This is data.'};
  s3bucket.upload(params, function(err, data) {
   if (err) {
    console.log("Error uploading data: ", err);
   } else {
    console.log("Successfully uploaded.");
   }
  });
 }else{
  console.log('Error Creating Bucket: ' + e);
 }

});
//------------------------------------------------------
//list all buckets
//------------------------------------------------------
var s3 = new AWS.S3();
s3.listBuckets(function(err, data) {
 if (err) { console.log("Error:", err); }
 else {
  for (var index in data.Buckets) {
   var bucket = data.Buckets[index];
   console.log("Bucket: ", bucket.Name, ' : ', bucket.CreationDate);
  }
 }
});