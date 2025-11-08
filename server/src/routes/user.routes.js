import express from 'express';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser
} from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { idValidation, validate } from '../middleware/validation.middleware.js';

const router = express.Router();

// Protect all routes and restrict to admin
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getUsers);

router.route('/:id')
  .get(idValidation, validate, getUser)
  .put(idValidation, validate, updateUser)
  .delete(idValidation, validate, deleteUser);

export default router;
