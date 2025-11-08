import express from 'express';
import {
  getPosts,
  getPost,
  getUserPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
  deleteComment
} from '../controllers/post.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { body } from 'express-validator';

const router = express.Router();

// Validation middleware
const createPostValidation = [
  body('content').trim().isLength({ min: 1, max: 5000 }).withMessage('Content must be between 1 and 5000 characters')
];

const addCommentValidation = [
  body('content').trim().isLength({ min: 1, max: 500 }).withMessage('Comment must be between 1 and 500 characters')
];

// All routes require authentication
router.use(protect);

// Post routes
router.route('/')
  .get(getPosts)
  .post(createPostValidation, createPost);

router.route('/user/:userId')
  .get(getUserPosts);

router.route('/:id')
  .get(getPost)
  .put(createPostValidation, updatePost)
  .delete(deletePost);

router.route('/:id/like')
  .put(likePost);

router.route('/:id/comment')
  .post(addCommentValidation, addComment);

router.route('/:id/comment/:commentId')
  .delete(deleteComment);

export default router;
