const Disaster = require('../models/Disaster');
const logger = require('../utils/logger');

// @GET /api/disasters
const getAllDisasters = async (req, res) => {
  try {
    const { type, severity, status, limit = 20 } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (severity) filter.severity = severity;
    if (status) filter.status = status;

    const disasters = await Disaster.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate('reportedBy', 'name email');

    res.json({ success: true, count: disasters.length, disasters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/disasters/active
const getActiveDisasters = async (req, res) => {
  try {
    const disasters = await Disaster.find({
      status: { $in: ['active', 'warning', 'approaching', 'monitoring'] },
    }).sort({ severity: -1, createdAt: -1 });

    res.json({ success: true, count: disasters.length, disasters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/disasters/:id
const getDisasterById = async (req, res) => {
  try {
    const disaster = await Disaster.findById(req.params.id).populate('reportedBy', 'name email');
    if (!disaster) return res.status(404).json({ success: false, message: 'Disaster not found' });
    res.json({ success: true, disaster });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/disasters
const createDisaster = async (req, res) => {
  try {
    const disaster = await Disaster.create({ ...req.body, reportedBy: req.user?.id });
    logger.info(`New disaster created: ${disaster.name} (${disaster.type})`);

    // Emit socket event
    if (req.app.get('io')) {
      req.app.get('io').emit('disaster:new', disaster);
    }

    res.status(201).json({ success: true, disaster });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/disasters/:id
const updateDisaster = async (req, res) => {
  try {
    const disaster = await Disaster.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!disaster) return res.status(404).json({ success: false, message: 'Disaster not found' });

    if (req.app.get('io')) {
      req.app.get('io').emit('disaster:updated', disaster);
    }

    res.json({ success: true, disaster });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @DELETE /api/disasters/:id
const deleteDisaster = async (req, res) => {
  try {
    await Disaster.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Disaster deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/disasters/stats/summary
const getStats = async (req, res) => {
  try {
    const total = await Disaster.countDocuments();
    const active = await Disaster.countDocuments({ status: { $in: ['active', 'warning', 'approaching'] } });
    const critical = await Disaster.countDocuments({ severity: 'critical' });
    const byType = await Disaster.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    const totalAffected = await Disaster.aggregate([
      { $group: { _id: null, total: { $sum: '$affectedPeople' } } }
    ]);

    res.json({
      success: true,
      stats: {
        total, active, critical,
        byType,
        totalAffected: totalAffected[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllDisasters, getActiveDisasters, getDisasterById, createDisaster, updateDisaster, deleteDisaster, getStats };
