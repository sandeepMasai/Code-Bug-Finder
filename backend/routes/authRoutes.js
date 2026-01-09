import express from 'express';
import { signup, login, getCurrentUser } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Sign up
router.post('/signup', signup);

// Login
router.post('/login', login);

// Get current user (protected route)
router.get('/me', authenticateToken, getCurrentUser);

export default router;

