const express = require('express');
const notificationsRoutes = require('./api/notifications/routes');

const cors = require('cors');
const { Session } = require('./api/sessions/models');
const { Sequelize } = require('sequelize');
// initialize the application
const app = express();

app.use(cors({
    credentials: true,
    origin: process.env.origin || "http://localhost:3000",
    contentType: ['application/json', 'multipart/form-data'],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin",
        "X-Forwarded-For",
        "X-Session-ID"
    ],
    exposedHeaders: ['X-Session-ID']
}));

  
app.use(
    express.json({
      limit: '1024mb',
    }),
);

app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
    let sessionId = req.headers['x-session-id'];
    
    if (!sessionId) {
        sessionId = `anon-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        await Session.create({ id: sessionId });
    } else {
        await Session.update(
            { last_active: Sequelize.fn('NOW') },
            { where: { id: sessionId } }
        );
    }
    
    req.sessionId = sessionId;
    res.set('X-Session-ID', sessionId);
    next();
});

app.use('/api/notifications', notificationsRoutes);

module.exports = app;