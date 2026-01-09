import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  saveHistory,
  getAllHistory,
  getHistoryById,
  updateHistory,
  deleteHistory,
} from '../controllers/historyController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Save code history
router.post('/save', saveHistory);

// Get all code history for user
router.get('/all', getAllHistory);

// Get single code history by ID
router.get('/:id', getHistoryById);

// Update code history
router.put('/:id', updateHistory);

// Delete code history
router.delete('/:id', deleteHistory);

export default router;

