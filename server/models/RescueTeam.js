const mongoose = require('mongoose');

const rescueTeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  unit: { type: String, required: true }, // NDRF, SDRF, Army, etc.
  teamCode: { type: String, unique: true },
  members: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['standby', 'deployed', 'returning', 'unavailable'],
    default: 'standby',
  },
  currentLocation: {
    name: String,
    coordinates: { lat: Number, lng: Number },
  },
  assignedDisaster: { type: mongoose.Schema.Types.ObjectId, ref: 'Disaster' },
  mission: { type: String },
  missionProgress: { type: Number, min: 0, max: 100, default: 0 },
  equipment: [{ type: String }],
  commander: {
    name: String,
    phone: String,
    rank: String,
  },
  deployedAt: { type: Date },
  estimatedReturn: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('RescueTeam', rescueTeamSchema);
