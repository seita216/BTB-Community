const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');
const Database = require('./src/database');
const authRoutes = require('./src/routes/auth');
const chatRoutes = require('./src/routes/chat');
const adminRoutes = require('./src/routes/admin');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Database
const db = new Database();
db.initialize();

// Routes
app.use('/api/auth', authRoutes(db));
app.use('/api/chat', chatRoutes(db));
app.use('/api/admin', adminRoutes(db));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '0.1.0-beta' });
});

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'client/build')));

// Fallback to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 BTB Community Platform running on port ${PORT}`);
  console.log(`📍 Visit http://localhost:${PORT}`);
});
