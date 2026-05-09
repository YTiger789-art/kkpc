const mongoose = require('mongoose');
const minimist = require('minimist');
require('dotenv').config();
const Result = require('../models/Result');

const argv = minimist(process.argv.slice(2));
const count = parseInt(argv.count || argv.c || '100', 10);
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pc28';

function rand() { return Math.floor(Math.random() * 10); }
function genNumbers() { return [rand(), rand(), rand()]; }
function makeIssue(prefix, seq) { return `${prefix}${String(seq).padStart(3, '0')}`; }

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB for seeding');
  const now = new Date();
  const prefix = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`;
  let created = 0;
  for (let i = 1; i <= count; i++) {
    const issue = makeIssue(prefix, i);
    const numbers = genNumbers();
    try {
      const exists = await Result.findOne({ issue });
      if (exists) continue;
      await Result.create({ issue, draw_time: new Date(), numbers });
      created++;
    } catch (err) {
      console.error('err', err.message);
    }
  }
  console.log(`Created ${created}`);
  await mongoose.disconnect();
  process.exit(0);
}

run();
