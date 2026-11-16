import * as comment from './api/comment.js';

export const likeComment = (req, res) => comment.likeComment(req, res);
export const unlikeComment = (req, res) => comment.unlikeComment(req, res);
