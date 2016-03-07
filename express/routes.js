/**
 * Created by Zeeshan on 3/7/2016.
 */

var api = {}; // so that if apis grow just add like, api.inbox, api.share ..
api.comment = require('./api/comment');

exports.likeComment = function (req, res) {
    console.log('Step 2 @ routes.js');
    api.comment.likeComment(req, res);
}

exports.unlikeComment = function (req, res) {
    api.comment.unlikeComment(req, res);
}
//api object itself can be exported, its upto you what to choose