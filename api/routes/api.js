const express = require('express');
const router = express.Router();
const userRoutes = require('./users');
const postRoutes = require('./posts');
const commentRoutes = require('./comments');
const followRoutes = require('./follow');
const dashboardRoutes = require('./dashboard');
const notificationRoutes = require('./notifications');
const chatRoutes = require('./chat');

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/follow', followRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/notifications', notificationRoutes);
router.use('/chats', chatRoutes);

module.exports = router;
