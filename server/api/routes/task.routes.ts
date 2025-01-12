import express from 'express';
import { auth, authorize } from '../middleware/auth.middleware';
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  updateTaskStatus,
  deleteTask
} from '../controllers/task.controller';

const router = express.Router();

router.post('/', auth, authorize('manager'), createTask);
router.get('/', auth, getTasks);
router.get('/:id', auth, getTask);
router.put('/:id', auth, authorize('manager'), updateTask);
router.put('/:id/status', auth, updateTaskStatus);
router.delete('/:id', auth, authorize('manager'), deleteTask);

export default router;