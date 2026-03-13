const express = require('express');
const router = express.Router();
const {
  getAllDisasters, getActiveDisasters, getDisasterById,
  createDisaster, updateDisaster, deleteDisaster, getStats
} = require('../controllers/disasterController');
const { protect, authorize, optionalAuth } = require('../middleware/authMiddleware');

router.get('/stats/summary', getStats);
router.get('/active', getActiveDisasters);
router.get('/', getAllDisasters);
router.get('/:id', getDisasterById);
router.post('/', optionalAuth, createDisaster);
router.put('/:id', protect, updateDisaster);
router.delete('/:id', protect, authorize('district_admin', 'state_admin', 'super_admin'), deleteDisaster);

module.exports = router;
