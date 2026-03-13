const express = require('express');
const router = express.Router();
const { getAllTeams, getTeamById, createTeam, updateTeam, deployTeam, getTeamStats } = require('../controllers/rescueController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

router.get('/stats/summary', getTeamStats);
router.get('/', getAllTeams);
router.get('/:id', getTeamById);
router.post('/', optionalAuth, createTeam);
router.put('/:id', optionalAuth, updateTeam);
router.put('/:id/deploy', optionalAuth, deployTeam);

module.exports = router;
