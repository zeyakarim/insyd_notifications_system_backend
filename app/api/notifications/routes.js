const express = require('express');
const router = express.Router();
const controllers = require('./controllers');

router.post('/create', controllers.createNotifications);

router.get('/', controllers.fetchNotifications);

router.patch('/:id/read', controllers.markAsRead);

module.exports = router;