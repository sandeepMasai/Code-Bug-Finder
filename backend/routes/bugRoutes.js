import express from 'express';
import { findBugs } from '../controllers/bugController.js';
import limiter from '../middleware/rateLimiter.js';

const router = express.Router();

// POST /find-bugs endpoint with rate limiting
router.post('/find-bugs', limiter, findBugs);

export default router;

