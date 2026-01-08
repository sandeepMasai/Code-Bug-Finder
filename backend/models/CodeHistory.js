import mongoose from 'mongoose';

const codeHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    default: 'Untitled Code',
  },
  originalCode: {
    type: String,
    required: true,
  },
  improvedCode: {
    type: String,
    default: '',
  },
  language: {
    type: String,
    required: true,
  },
  preference: {
    type: String,
    enum: ['Simple', 'Optimized', 'Best Practices'],
    default: 'Simple',
  },
  errors: [
    {
      line: Number,
      type: String,
      message: String,
      suggestion: String,
    },
  ],
  explanation: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update updatedAt before saving
codeHistorySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('CodeHistory', codeHistorySchema);

