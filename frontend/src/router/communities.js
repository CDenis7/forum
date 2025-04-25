const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const authMiddleware = require('../middleware/authMiddleware');

// Rute publice
router.get('/', communityController.getAllCommunities);
router.get('/:id', communityController.getCommunityById);
router.get('/name/:name', communityController.getCommunityByName);

// Rute protejate
router.post('/', authMiddleware, communityController.createCommunity);
router.post('/:id/join', authMiddleware, communityController.joinCommunity);
router.delete('/:id/leave', authMiddleware, communityController.leaveCommunity);

module.exports = router;