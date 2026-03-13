const Alert = require('../models/Alert');
const logger = require('../utils/logger');

// @GET /api/alerts
const getAllAlerts = async (req, res) => {
  try {
    const { severity, type, active, limit = 50 } = req.query;
    const filter = {};
    if (severity) filter.severity = severity;
    if (type) filter.type = type;
    if (active !== undefined) filter.isActive = active === 'true';

    const alerts = await Alert.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate('disaster', 'name type')
      .populate('createdBy', 'name');

    res.json({ success: true, count: alerts.length, alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/alerts
const createAlert = async (req, res) => {
  try {
    const alert = await Alert.create({ ...req.body, createdBy: req.user?.id });
    logger.info(`Alert created: ${alert.title} [${alert.severity}]`);

    // Broadcast via socket
    if (req.app.get('io')) {
      req.app.get('io').emit('alert:new', alert);
    }

    res.status(201).json({ success: true, alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/alerts/:id
const updateAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' });
    res.json({ success: true, alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @DELETE /api/alerts/:id
const deleteAlert = async (req, res) => {
  try {
    await Alert.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Alert deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/alerts/broadcast
const broadcastAlert = async (req, res) => {
  try {
    const alert = await Alert.create({
      ...req.body,
      createdBy: req.user?.id,
      sentVia: { sms: true, push: true, dashboard: true },
    });

    // Emit to all connected clients
    if (req.app.get('io')) {
      req.app.get('io').emit('alert:broadcast', alert);
    }

    logger.info(`BROADCAST alert sent: ${alert.title}`);
    res.status(201).json({ success: true, message: 'Alert broadcasted', alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllAlerts, createAlert, updateAlert, deleteAlert, broadcastAlert };
