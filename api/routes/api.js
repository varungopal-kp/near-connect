const express = require('express');
const router = express.Router();
const userRoutes = require('./users');
const postRoutes = require('./posts');
const commentRoutes = require('./comment');
const followRoutes = require('./follow');

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/follow', followRoutes);

module.exports = router;
