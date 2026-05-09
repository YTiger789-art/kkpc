const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  issue: { type: String, required: true, unique: true },
  draw_time: { type: Date, default: Date.now },
  numbers: {
    type: [Number],
    validate: {
      validator: v => Array.isArray(v) && v.length === 3 && v.every(n => Number.isInteger(n) && n >= 0 && n <= 9),
      message: 'numbers must be an array of three digits 0-9'
    },
    required: true
  },
  sum: Number,
  created_at: { type: Date, default: Date.now }
});

ResultSchema.pre('save', function (next) {
  if (Array.isArray(this.numbers)) this.sum = this.numbers.reduce((a, b) => a + b, 0);
  next();
});

module.exports = mongoose.model('Result', ResultSchema);
