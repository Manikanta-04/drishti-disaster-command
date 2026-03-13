const Resource = require('../models/Resource');

// @GET /api/resources
const getAllResources = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const resources = await Resource.find(filter).sort({ category: 1 });
    res.json({ success: true, count: resources.length, resources });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/resources
const createResource = async (req, res) => {
  try {
    const resource = await Resource.create({ ...req.body, lastUpdatedBy: req.user?.id });
    res.status(201).json({ success: true, resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/resources/:id
const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastUpdatedBy: req.user?.id },
      { new: true }
    );
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
    res.json({ success: true, resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/resources/:id/deploy
const deployResource = async (req, res) => {
  try {
    const { quantity, disasterId } = req.body;
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });

    const available = resource.totalStock - resource.deployed - resource.reserved;
    if (quantity > available) {
      return res.status(400).json({ success: false, message: `Only ${available} ${resource.unit} available` });
    }

    resource.deployed += quantity;
    resource.assignedTo = disasterId;
    resource.lastUpdatedBy = req.user?.id;
    await resource.save();

    res.json({ success: true, resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/resources/stats/summary
const getResourceStats = async (req, res) => {
  try {
    const stats = await Resource.aggregate([
      {
        $group: {
          _id: '$category',
          totalStock: { $sum: '$totalStock' },
          deployed: { $sum: '$deployed' },
        }
      }
    ]);
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllResources, createResource, updateResource, deployResource, getResourceStats };
