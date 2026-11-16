import { Router } from 'express';
import { deleteSinglePost, getPosts, getSinglePost } from '../../controllers/front-end/posts.js';

const router = Router();

router.get('/', getPosts);
router.get('/:id', getSinglePost);
router.delete('/:id', deleteSinglePost);

export default router;
