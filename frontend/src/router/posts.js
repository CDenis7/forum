// routes/posts.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

// Rute publice
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.get('/community/:communityId', postController.getPostsByCommunity);

// Rute protejate
router.post('/', authMiddleware, postController.createPost);
router.put('/:id', authMiddleware, postController.updatePost);
router.delete('/:id', authMiddleware, postController.deletePost);
router.post('/:id/vote', authMiddleware, postController.votePost);

module.exports = router;