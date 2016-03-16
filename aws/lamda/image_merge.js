/**
 * Created by Zeeshan on 3/7/2016.
 */


/*
* I was working on a lambda function which will be triggered via the amazon rest api.

 I have created the following

 a POST end point on REST API console
 a lambda function linked to the REST API
 Now as a first try I created the function such that it will accept the param as

 {
 "userProfileImagePath":"facebook users profile image path via GET /{user-id}/picture"
 }
 The lambda function will get the image using request module and then upload to a bucket.

 Since I was using multiple modules I have created everything locally and zipped them including the node_modules and uploaded them to lambda function console by specifying the Handler name.

 So far its good and it worked pretty well.

 Now to extend this I was trying to send 2 profile images - one is from the user - the other is one of his/her friend - Merge both the images into one and then upload the merged image to the destination file.

 I tried different approach for the merging and nothing worked. Found some solutions on here and seems like they really do not like streams

 Here is what I did so far and as I mentioned both the images are getting uploaded to a bucket however the merging seems to fail, I ran out of idea to accomplish this, would be really helpful if you can give me some directions on how to do it.

 Currently it uses async module to do individual tasks

 First upload both the images to s3 in parallel
 then download them using s3.getObject in parallel
 finally on completion of 2nd task try to merge and push back to s3
 Basically there will be a template image and over the template image multiple images will be placed (merged), here in the code below I am considering userProfileImagePath as the main template and trying to merge another image into it.

 Please let me know if there is a different way to do this.

 Here is what I did so far*/


//http://stackoverflow.com/questions/35846425/amazon-lambda-function-merge-multiple-s3-images-and-put-to-a-destination-bucket

/**
 * This is a test script which runs as a lambda function on amazon
 * The lamda function is linked with an amazon end point
 * The script will accept a image url (facebook/gravator) etc and will upload to a destination s3 bucket and returns the url
 * The param looks like
 {
     "userProfileImagePath":"https://fbcdn-profile-a.......",
     "friendProfileImagePath":"https://fbcdn-profile-a......."
 }
 */

var exec = require('child_process').exec,
    async = require('async'),
    request = require('request'),
    gm = require('gm'),
    imageMagick = gm.subClass({ imageMagick: true }),
    aws = require('aws-sdk');

exports.handler = function(req, context) {
    var errMsg = '',
        userProfileImageName = 'user_profile',
        friendProfileImageName = 'friend_profile',
        mergedImageName = 'final_image',
        destinationBucket = 'destination_bucket',
        response = {} ,
        s3 = new aws.S3();

    if (req.userProfileImagePath === '') {
        errMsg = 'Missing the userProfileImage';
    }

    if (req.friendProfileImagePath === '') {
        errMsg = 'Missing the friendProfileImagePath ';
    }

    if (errMsg === '') {
        async.auto({
                copyUserImageToS3 : function(autoCallback) {
                    console.log('MyImage :'+req.userProfileImagePath);
                    //var myImageData = {} ;
                    request({
                        url: req.userProfileImagePath,
                        encoding: null
                    }, function(err, res, body) {
                        if (err) { return autoCallback(err); }

                        s3.putObject({
                            Bucket: destinationBucket,
                            Key: userProfileImageName+'.jpg',
                            ContentType: res.headers['content-type'],
                            ContentLength: res.headers['content-length'],
                            Body: body, // buffer
                            ACL:'public-read'
                        }, autoCallback);
                    });
                },

                copyFriendImageToS3 : function(autoCallback) {
                    console.log('FriendImage :'+req.friendProfileImagePath);
                    //var friendImageData = {} ;
                    request({
                        url: req.friendProfileImagePath,
                        encoding: null
                    }, function(err, res, body) {
                        if (err) { return autoCallback(err); }

                        s3.putObject({
                            Bucket: destinationBucket,
                            Key: friendProfileImageName+'.jpg',
                            ContentType: res.headers['content-type'],
                            ContentLength: res.headers['content-length'],
                            Body: body, // buffer
                            ACL:'public-read'
                        }, autoCallback);
                    });
                },

                getUserImageFromS3 : ['copyUserImageToS3', function(autoCallback,results) {
                    s3.getObject({
                        Bucket: destinationBucket,
                        Key: userProfileImageName+'.jpg',
                    }, autoCallback);
                }],

                getFriendImageFromS3 : ['copyFriendImageToS3', function(autoCallback,results) {
                    s3.getObject({
                        Bucket: destinationBucket,
                        Key: friendProfileImageName+'.jpg',
                    }, autoCallback);
                }],

                mergeImages : ['getUserImageFromS3','getFriendImageFromS3', function(autoCallback,results) {
                    console.log('Here');
                    gm()
                        .in('-page', '+0+0')  // Custom place for each of the images
                        .in(results.getUserImageFromS3.body)
                        .in('-page', '+100+100')
                        .in(results.getFriendImageFromS3.body)
                        .minify()
                        .mosaic()
                        .toBuffer('JPG', function (err, buffer) {
                            if (err) { return autoCallback(err); }
                            s3.putObject({
                                Bucket: destinationBucket,
                                Key: mergedImageName+'.jpg',
                                ContentType:  results.getUserImageFromS3.headers['content-type'],
                                ContentLength: results.getUserImageFromS3.headers['content-length'],
                                Body: buffer, // buffer
                                ACL:'public-read'
                            }, autoCallback);
                        });
                }],
            },
            function(err, results) {
                if (err) {
                    response = {
                        "stat":"error",
                        "msg":"Error manipulating the image :: "+err
                    } ;
                    context.done(null,response);
                } else {
                    response = {
                        "stat":"ok",
                        "imageUrl":"https://s3-................../"+mergedImageName+".jpg"
                    } ;
                    context.done(null,response);
                }
            });
    } else {
        response = {
            "stat":"error",
            "msg": errMsg
        } ;
        context.done(null,response);
    }
};