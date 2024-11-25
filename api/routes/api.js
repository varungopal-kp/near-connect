const express = require('express');
const router = express.Router();
const userRoutes = require('./users');
const postRoutes = require('./posts');
const commentRoutes = require('./comment');

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);

module.exports = router;
