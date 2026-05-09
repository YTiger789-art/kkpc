const express = require('express');
const router = express.Router();
const Result = require('../models/Result');

const ADMIN_KEY = process.env.ADMIN_KEY || '';

function requireAdmin(req, res, next) {
  if (!ADMIN_KEY) return next();
  const key = req.headers['x-api-key'] || '';
  if (key === ADMIN_KEY) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}

async function emitLatest(app) {
  try {
    const latest = await Result.findOne().sort({ issue: -1 }).lean();
    if (app && app.locals && app.locals.io) {
      app.locals.io.emit('new_result', latest || {});
    }
  } catch (err) {
    console.error('emitLatest error', err);
  }
}

// Get latest
router.get('/latest', async (req, res) => {
  try {
    const latest = await Result.findOne().sort({ issue: -1 }).lean();
    res.json(latest || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// History (paginated)
router.get('/history', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize || '20', 10)));
    const skip = (page - 1) * pageSize;
    const [data, total] = await Promise.all([
      Result.find().sort({ issue: -1 }).skip(skip).limit(pageSize).lean(),
      Result.countDocuments()
    ]);
    res.json({ page, pageSize, total, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get by issue
router.get('/:issue', async (req, res) => {
  try {
    const r = await Result.findOne({ issue: req.params.issue }).lean();
    if (!r) return res.status(404).json({ error: 'Not found' });
    res.json(r);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add
router.post('/add', requireAdmin, async (req, res) => {
  try {
    const { issue, draw_time, numbers } = req.body;
    if (!issue || !numbers) return res.status(400).json({ error: 'issue and numbers required' });
    const exists = await Result.findOne({ issue });
    if (exists) return res.status(409).json({ error: 'issue exists' });
    const doc = await Result.create({ issue, draw_time, numbers });
    res.status(201).json(doc);
    // emit to sockets
    emitLatest(req.app);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update
router.put('/:issue', requireAdmin, async (req, res) => {
  try {
    const update = {};
    if (req.body.draw_time) update.draw_time = req.body.draw_time;
    if (req.body.numbers) update.numbers = req.body.numbers;
    const updated = await Result.findOneAndUpdate({ issue: req.params.issue }, update, { new: true, runValidators: true }).lean();
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
    emitLatest(req.app);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete
router.delete('/:issue', requireAdmin, async (req, res) => {
  try {
    const deleted = await Result.findOneAndDelete({ issue: req.params.issue });
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
    emitLatest(req.app);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
