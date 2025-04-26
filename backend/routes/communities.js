const express = require('express');
const router = express.Router();
const communityModel = require('../models/communityModel');
const authMiddleware = require('../middleware/authMiddleware');

// Get all communities
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const communities = await communityModel.findAll(limit, offset);
    res.json(communities);
  } catch (error) {
    console.error('Eroare la obținerea comunităților:', error);
    res.status(500).json({ message: 'Eroare la obținerea comunităților.' });
  }
});

// Get community by ID
router.get('/:id', async (req, res) => {
  try {
    const community = await communityModel.findById(req.params.id);
    if (!community) {
      return res.status(404).json({ message: 'Comunitate negăsită.' });
    }
    res.json(community);
  } catch (error) {
    console.error('Eroare la obținerea comunității:', error);
    res.status(500).json({ message: 'Eroare la obținerea comunității.' });
  }
});

// Get community by name
router.get('/name/:name', async (req, res) => {
  try {
    const community = await communityModel.findByName(req.params.name);
    if (!community) {
      return res.status(404).json({ message: 'Comunitate negăsită.' });
    }
    res.json(community);
  } catch (error) {
    console.error('Eroare la obținerea comunității:', error);
    res.status(500).json({ message: 'Eroare la obținerea comunității.' });
  }
});

// Create a new community
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;
    const newCommunity = await communityModel.create({
      name,
      description,
      creator_id: req.user.id
    });
    res.status(201).json(newCommunity);
  } catch (error) {
    console.error('Eroare la crearea comunității:', error);
    res.status(500).json({ message: 'Eroare la crearea comunității.' });
  }
});

// Join a community
router.post('/:id/join', authMiddleware, async (req, res) => {
  try {
    const communityMember = await communityModel.addMember(req.params.id, req.user.id);
    res.status(201).json(communityMember);
  } catch (error) {
    console.error('Eroare la alăturarea în comunitate:', error);
    res.status(500).json({ message: 'Eroare la alăturarea în comunitate.' });
  }
});

// Leave a community
router.delete('/:id/leave', authMiddleware, async (req, res) => {
  try {
    const result = await communityModel.removeMember(req.params.id, req.user.id);
    res.json(result);
  } catch (error) {
    console.error('Eroare la părăsirea comunității:', error);
    res.status(500).json({ message: 'Eroare la părăsirea comunității.' });
  }
});

module.exports = router;