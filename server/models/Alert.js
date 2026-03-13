const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['flood', 'cyclone', 'earthquake', 'heatwave', 'landslide', 'drought', 'general'],
    required: true,
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true,
  },
  location: {
    name: String,
    state: String,
    district: String,
    coordinates: { lat: Number, lng: Number },
    radius: { type: Number, default: 100 }, // km
  },
  disaster: { type: mongoose.Schema.Types.ObjectId, ref: 'Disaster' },
  isActive: { type: Boolean, default: true },
  sentVia: {
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: false },
    dashboard: { type: Boolean, default: true },
  },
  sentCount: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  expiresAt: { type: Date },
}, { timestamps: true });

alertSchema.index({ severity: 1, isActive: 1 });
alertSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Alert', alertSchema);
