const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');
const authMiddleware = require('../middleware/authMiddleware');

// Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilizator negăsit.' });
    }
    res.json(user);
  } catch (error) {
    console.error('Eroare la obținerea profilului:', error);
    res.status(500).json({ message: 'Eroare la obținerea profilului.' });
  }
});

// Update user profile
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const { username, avatar_url } = req.body;
    const updatedUser = await userModel.updateProfile(req.user.id, { username, avatar_url });
    res.json(updatedUser);
  } catch (error) {
    console.error('Eroare la actualizarea profilului:', error);
    res.status(500).json({ message: 'Eroare la actualizarea profilului.' });
  }
});

module.exports = router;