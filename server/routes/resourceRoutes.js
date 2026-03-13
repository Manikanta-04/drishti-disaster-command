const express = require('express');
const router = express.Router();
const { getAllResources, createResource, updateResource, deployResource, getResourceStats } = require('../controllers/resourceController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

router.get('/stats/summary', getResourceStats);
router.get('/', getAllResources);
router.post('/', optionalAuth, createResource);
router.put('/:id', optionalAuth, updateResource);
router.put('/:id/deploy', optionalAuth, deployResource);

module.exports = router;
