const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['food', 'medical', 'rescue_equipment', 'shelter', 'water', 'transport', 'communication'],
    required: true,
  },
  unit: { type: String, required: true }, // packets, kits, boats, etc.
  totalStock: { type: Number, default: 0 },
  deployed: { type: Number, default: 0 },
  reserved: { type: Number, default: 0 },
  location: {
    warehouse: String,
    state: String,
    coordinates: { lat: Number, lng: Number },
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Disaster' },
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

resourceSchema.virtual('available').get(function () {
  return this.totalStock - this.deployed - this.reserved;
});

module.exports = mongoose.model('Resource', resourceSchema);
