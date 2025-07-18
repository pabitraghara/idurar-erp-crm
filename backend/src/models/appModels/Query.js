const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
    required: true,
    autopopulate: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const querySchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },

  // Query details
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
    required: true,
    autopopulate: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Open', 'InProgress', 'Closed'],
    default: 'Open',
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
  },
  resolution: {
    type: String,
    default: '',
  },

  // Notes subsystem
  notes: [noteSchema],

  // AI Summary (for Phase 3)
  aiSummary: {
    type: String,
    default: '',
  },

  // Audit fields
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
    required: true,
    autopopulate: true,
  },
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
    autopopulate: true,
  },

  // Timestamps
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

// Update the 'updated' field before saving
querySchema.pre('save', function (next) {
  this.updated = Date.now();
  next();
});

querySchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Query', querySchema);
