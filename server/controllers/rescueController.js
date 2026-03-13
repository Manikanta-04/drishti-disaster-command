const RescueTeam = require('../models/RescueTeam');
const logger = require('../utils/logger');

// @GET /api/rescue
const getAllTeams = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const teams = await RescueTeam.find(filter)
      .sort({ createdAt: -1 })
      .populate('assignedDisaster', 'name type location');
    res.json({ success: true, count: teams.length, teams });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/rescue/:id
const getTeamById = async (req, res) => {
  try {
    const team = await RescueTeam.findById(req.params.id).populate('assignedDisaster');
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
    res.json({ success: true, team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/rescue
const createTeam = async (req, res) => {
  try {
    const team = await RescueTeam.create(req.body);
    logger.info(`Rescue team created: ${team.name}`);
    res.status(201).json({ success: true, team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/rescue/:id
const updateTeam = async (req, res) => {
  try {
    const team = await RescueTeam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

    // Broadcast location update
    if (req.app.get('io')) {
      req.app.get('io').emit('team:updated', team);
    }

    res.json({ success: true, team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/rescue/:id/deploy
const deployTeam = async (req, res) => {
  try {
    const { disasterId, mission, location } = req.body;
    const team = await RescueTeam.findByIdAndUpdate(
      req.params.id,
      {
        status: 'deployed',
        assignedDisaster: disasterId,
        mission,
        currentLocation: location,
        deployedAt: new Date(),
        missionProgress: 0,
      },
      { new: true }
    ).populate('assignedDisaster', 'name type');

    if (req.app.get('io')) {
      req.app.get('io').emit('team:deployed', team);
    }

    logger.info(`Team ${team.name} deployed to ${mission}`);
    res.json({ success: true, team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/rescue/stats/summary
const getTeamStats = async (req, res) => {
  try {
    const total = await RescueTeam.countDocuments();
    const deployed = await RescueTeam.countDocuments({ status: 'deployed' });
    const standby = await RescueTeam.countDocuments({ status: 'standby' });
    const returning = await RescueTeam.countDocuments({ status: 'returning' });
    const totalPersonnel = await RescueTeam.aggregate([
      { $group: { _id: null, total: { $sum: '$members' } } }
    ]);

    res.json({
      success: true,
      stats: { total, deployed, standby, returning, totalPersonnel: totalPersonnel[0]?.total || 0 },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllTeams, getTeamById, createTeam, updateTeam, deployTeam, getTeamStats };
