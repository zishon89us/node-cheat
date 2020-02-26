const Post = require('../../models/post');

exports.getPosts = (req, res, next) => {
    res.send("This will load all posts; continue with your logic!");
};

exports.getSinglePost = (req, res, next) => {
    const {id} = req.params;
    res.send(`This will load single post with slug : ${id}`);
};
