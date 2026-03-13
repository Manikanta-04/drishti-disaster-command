const mongoose = require('mongoose');

const disasterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ['flood', 'cyclone', 'earthquake', 'heatwave', 'landslide', 'drought', 'tsunami', 'other'],
  },
  severity: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical'],
  },
  status: {
    type: String,
    enum: ['monitoring', 'warning', 'active', 'approaching', 'contained', 'resolved'],
    default: 'monitoring',
  },
  location: {
    name: { type: String, required: true },
    state: String,
    district: String,
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    affectedRadius: { type: Number, default: 50 }, // km
  },
  affectedPeople: { type: Number, default: 0 },
  casualties: { type: Number, default: 0 },
  missing: { type: Number, default: 0 },
  description: { type: String },
  weatherData: {
    rainfall: Number,
    windSpeed: Number,
    temperature: Number,
    humidity: Number,
  },
  riskScore: { type: Number, min: 0, max: 100, default: 0 },
  source: { type: String, default: 'manual' }, // manual, imd, usgs, auto
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolvedAt: { type: Date },
}, { timestamps: true });

disasterSchema.index({ 'location.coordinates': '2dsphere' });
disasterSchema.index({ type: 1, severity: 1, status: 1 });

module.exports = mongoose.model('Disaster', disasterSchema);
