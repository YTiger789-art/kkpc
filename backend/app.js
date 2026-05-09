require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const resultRoutes = require('./routes/result');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pc28';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => { console.error('MongoDB connection error', err); process.exit(1); });

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Make io available to routes via app.locals
app.locals.io = io;

app.use('/api/result', resultRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

io.on('connection', socket => {
  console.log('socket connected', socket.id);
  socket.on('disconnect', () => console.log('socket disconnected', socket.id));
});

server.listen(PORT, () => console.log(`API server listening on ${PORT}`));
