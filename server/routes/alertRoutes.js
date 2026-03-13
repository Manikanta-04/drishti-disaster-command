// alertRoutes.js
const express = require('express');
const router = express.Router();
const { getAllAlerts, createAlert, updateAlert, deleteAlert, broadcastAlert } = require('../controllers/alertController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

router.get('/', getAllAlerts);
router.post('/', optionalAuth, createAlert);
router.post('/broadcast', protect, broadcastAlert);
router.put('/:id', protect, updateAlert);
router.delete('/:id', protect, deleteAlert);

module.exports = router;
