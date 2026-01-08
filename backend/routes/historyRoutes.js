import express from 'express';
import CodeHistory from '../models/CodeHistory.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Save code history
router.post('/save', async (req, res) => {
  try {
    const { title, originalCode, improvedCode, language, preference, errors, explanation } = req.body;
    const userId = req.user.userId;

    if (!originalCode || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const codeHistory = new CodeHistory({
      userId,
      title: title || 'Untitled Code',
      originalCode,
      improvedCode: improvedCode || '',
      language,
      preference: preference || 'Simple',
      errors: errors || [],
      explanation: explanation || '',
    });

    await codeHistory.save();

    res.status(201).json({
      success: true,
      codeHistory: {
        id: codeHistory._id,
        title: codeHistory.title,
        originalCode: codeHistory.originalCode,
        improvedCode: codeHistory.improvedCode,
        language: codeHistory.language,
        preference: codeHistory.preference,
        errors: codeHistory.errors,
        explanation: codeHistory.explanation,
        createdAt: codeHistory.createdAt,
        updatedAt: codeHistory.updatedAt,
      },
    });
  } catch (error) {
    console.error('Save history error:', error);
    res.status(500).json({ error: 'Failed to save code history' });
  }
});

// Get all code history for user
router.get('/all', async (req, res) => {
  try {
    const userId = req.user.userId;
    const codeHistories = await CodeHistory.find({ userId })
      .sort({ updatedAt: -1 })
      .select('-userId');

    res.json({
      success: true,
      codeHistories,
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to retrieve code history' });
  }
});

// Get single code history by ID
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.userId;
    const codeHistory = await CodeHistory.findOne({
      _id: req.params.id,
      userId,
    });

    if (!codeHistory) {
      return res.status(404).json({ error: 'Code history not found' });
    }

    res.json({
      success: true,
      codeHistory: {
        id: codeHistory._id,
        title: codeHistory.title,
        originalCode: codeHistory.originalCode,
        improvedCode: codeHistory.improvedCode,
        language: codeHistory.language,
        preference: codeHistory.preference,
        errors: codeHistory.errors,
        explanation: codeHistory.explanation,
        createdAt: codeHistory.createdAt,
        updatedAt: codeHistory.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get single history error:', error);
    res.status(500).json({ error: 'Failed to retrieve code history' });
  }
});

// Update code history
router.put('/:id', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, originalCode, improvedCode, language, preference, errors, explanation } = req.body;

    const codeHistory = await CodeHistory.findOneAndUpdate(
      { _id: req.params.id, userId },
      {
        title,
        originalCode,
        improvedCode,
        language,
        preference,
        errors,
        explanation,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!codeHistory) {
      return res.status(404).json({ error: 'Code history not found' });
    }

    res.json({
      success: true,
      codeHistory: {
        id: codeHistory._id,
        title: codeHistory.title,
        originalCode: codeHistory.originalCode,
        improvedCode: codeHistory.improvedCode,
        language: codeHistory.language,
        preference: codeHistory.preference,
        errors: codeHistory.errors,
        explanation: codeHistory.explanation,
        createdAt: codeHistory.createdAt,
        updatedAt: codeHistory.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update history error:', error);
    res.status(500).json({ error: 'Failed to update code history' });
  }
});

// Delete code history
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.userId;
    const codeHistory = await CodeHistory.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!codeHistory) {
      return res.status(404).json({ error: 'Code history not found' });
    }

    res.json({
      success: true,
      message: 'Code history deleted successfully',
    });
  } catch (error) {
    console.error('Delete history error:', error);
    res.status(500).json({ error: 'Failed to delete code history' });
  }
});

export default router;

