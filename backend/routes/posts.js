const express = require('express');
const router = express.Router();
const postModel = require('../models/postModel');
const authMiddleware = require('../middleware/authMiddleware');

// Get all posts
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const posts = await postModel.findAll(limit, offset);
    res.json(posts);
  } catch (error) {
    console.error('Eroare la obținerea postărilor:', error);
    res.status(500).json({ message: 'Eroare la obținerea postărilor.' });
  }
});

// Get post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Postare negăsită.' });
    }
    res.json(post);
  } catch (error) {
    console.error('Eroare la obținerea postării:', error);
    res.status(500).json({ message: 'Eroare la obținerea postării.' });
  }
});

// Get posts by community
router.get('/community/:communityId', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const posts = await postModel.findByCommunity(req.params.communityId, limit, offset);
    res.json(posts);
  } catch (error) {
    console.error('Eroare la obținerea postărilor din comunitate:', error);
    res.status(500).json({ message: 'Eroare la obținerea postărilor din comunitate.' });
  }
});

// Create a new post
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content, community_id } = req.body;
    const newPost = await postModel.create({
      title,
      content,
      user_id: req.user.id,
      community_id
    });
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Eroare la crearea postării:', error);
    res.status(500).json({ message: 'Eroare la crearea postării.' });
  }
});

// Vote on a post
router.post('/:id/vote', authMiddleware, async (req, res) => {
  try {
    const { voteType } = req.body;
    const updatedPost = await postModel.vote(req.params.id, req.user.id, voteType);
    res.json(updatedPost);
  } catch (error) {
    console.error('Eroare la votarea postării:', error);
    res.status(500).json({ message: 'Eroare la votarea postării.' });
  }
});

module.exports = router;