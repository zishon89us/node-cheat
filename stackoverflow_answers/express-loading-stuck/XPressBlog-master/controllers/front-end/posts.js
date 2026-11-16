import { isValidObjectId } from 'mongoose';
import Post from '../../models/post.js';

export const getPosts = async (req, res) => {
  const posts = await Post.find().sort({ created_at: -1 }).limit(20).lean();
  res.render('default/index', {
    page_heading: 'XPressBlog',
    page_subheading: 'A CMS made with Express.js and EJS',
    posts,
  });
};

export const getSinglePost = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).send('Invalid post id');

  const post = await Post.findById(id).lean();
  if (!post) return res.status(404).send('Post not found');
  res.render('default/singlepost', { post });
};

export const deleteSinglePost = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid post id' });

  const deleted = await Post.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ error: 'Post not found' });
  res.status(204).end();
};
