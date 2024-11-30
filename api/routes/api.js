const express = require('express');
const router = express.Router();
const userRoutes = require('./users');
const postRoutes = require('./posts');
const commentRoutes = require('./comment');
const followerRoutes = require('./followers');

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/followers', followerRoutes);

module.exports = router;
