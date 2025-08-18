const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const userEventsRoutes = require('./routes/userEvents');
const connectDB = require('./config/db');
const contactRoutes = require('./routes/contact');
const clistRoutes = require('./routes/clist');

connectDB();
const app = express();

app.use(cors());
app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/user', userEventsRoutes);
// API routes
app.use('/api/clist', clistRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/contests', require('./routes/contestRoutes'));
app.use('/api/profile', require('./routes/profile')); // If your file is profile.js

const clientBuildPath = path.join(__dirname, 'client', 'build');
if (fs.existsSync(clientBuildPath)) {
    app.use(express.static(clientBuildPath));
    app.get('*', (req, res) => {
        // Only serve index.html for non-API routes
        if (!req.originalUrl.startsWith('/api/')) {
            res.sendFile(path.join(clientBuildPath, 'index.html'));
        } else {
            res.status(404).json({ message: 'API route not found' });
        }
    });
} else {
    console.warn('⚠️  client/build not found. React frontend will not be served.');
}

// Error handler should be last
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        message: err.message || 'Something went wrong on the server.',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));