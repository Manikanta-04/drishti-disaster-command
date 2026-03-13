require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Disaster = require('./models/Disaster');
const Alert = require('./models/Alert');
const RescueTeam = require('./models/RescueTeam');
const Resource = require('./models/Resource');
const User = require('./models/User');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB Atlas');

  // Clear existing
  await Promise.all([
    Disaster.deleteMany({}),
    Alert.deleteMany({}),
    RescueTeam.deleteMany({}),
    Resource.deleteMany({}),
    User.deleteMany({}),
  ]);
  console.log('🗑️  Cleared existing data');

  // Seed admin user
  const admin = await User.create({
    name: 'Super Admin',
    email: 'admin@drishti.gov.in',
    password: 'Admin@2026',
    role: 'super_admin',
    phone: '9999999999',
  });
  console.log('👤 Admin user created: admin@drishti.gov.in / Admin@2026');

  // Seed disasters
  const disasters = await Disaster.insertMany([
    {
      name: 'Kerala Flood Alert',
      type: 'flood',
      severity: 'critical',
      status: 'active',
      location: { name: 'Kottayam, Kerala', state: 'Kerala', district: 'Kottayam', coordinates: { lat: 9.5916, lng: 76.5222 }, affectedRadius: 60 },
      affectedPeople: 45000,
      casualties: 12,
      description: 'Heavy rainfall causing flash floods in low-lying areas.',
      weatherData: { rainfall: 95, windSpeed: 45, temperature: 26, humidity: 98 },
      riskScore: 92,
      source: 'imd',
      reportedBy: admin._id,
    },
    {
      name: 'Cyclone Mocha',
      type: 'cyclone',
      severity: 'high',
      status: 'approaching',
      location: { name: 'Puri, Odisha', state: 'Odisha', district: 'Puri', coordinates: { lat: 19.8135, lng: 85.8312 }, affectedRadius: 120 },
      affectedPeople: 120000,
      casualties: 0,
      description: 'Cyclone approaching from Bay of Bengal, landfall expected in 24 hours.',
      weatherData: { rainfall: 40, windSpeed: 180, temperature: 28, humidity: 85 },
      riskScore: 78,
      source: 'imd',
      reportedBy: admin._id,
    },
    {
      name: 'Seismic Activity',
      type: 'earthquake',
      severity: 'medium',
      status: 'monitoring',
      location: { name: 'Chamoli, Uttarakhand', state: 'Uttarakhand', district: 'Chamoli', coordinates: { lat: 30.0668, lng: 79.0193 }, affectedRadius: 30 },
      affectedPeople: 8000,
      casualties: 3,
      description: 'Magnitude 4.8 earthquake. Aftershocks possible.',
      weatherData: { rainfall: 5, windSpeed: 20, temperature: 18, humidity: 65 },
      riskScore: 55,
      source: 'usgs',
      reportedBy: admin._id,
    },
    {
      name: 'Severe Heatwave',
      type: 'heatwave',
      severity: 'high',
      status: 'active',
      location: { name: 'Jaisalmer, Rajasthan', state: 'Rajasthan', district: 'Jaisalmer', coordinates: { lat: 27.0238, lng: 74.2179 }, affectedRadius: 80 },
      affectedPeople: 200000,
      casualties: 8,
      description: 'Temperatures exceeding 48°C. Heat stroke risk is critical.',
      weatherData: { rainfall: 0, windSpeed: 30, temperature: 48, humidity: 12 },
      riskScore: 82,
      source: 'imd',
      reportedBy: admin._id,
    },
    {
      name: 'Landslide Warning',
      type: 'landslide',
      severity: 'medium',
      status: 'warning',
      location: { name: 'Shimla, Himachal Pradesh', state: 'Himachal Pradesh', district: 'Shimla', coordinates: { lat: 31.1048, lng: 77.1734 }, affectedRadius: 20 },
      affectedPeople: 3500,
      casualties: 1,
      description: 'NH-5 blocked. Multiple landslide triggers from heavy rain.',
      weatherData: { rainfall: 75, windSpeed: 35, temperature: 15, humidity: 92 },
      riskScore: 65,
      source: 'manual',
      reportedBy: admin._id,
    },
  ]);
  console.log(`🌊 ${disasters.length} disasters seeded`);

  // Seed alerts
  await Alert.insertMany([
    { title: 'CRITICAL: Flash Flood Warning', message: 'Immediate evacuation required. Water levels rising rapidly.', type: 'flood', severity: 'critical', location: { name: 'Kottayam, Kerala', state: 'Kerala' }, disaster: disasters[0]._id, createdBy: admin._id },
    { title: 'Cyclone Landfall Expected in 24hrs', message: 'Cyclone Mocha landfall near Puri. Wind speeds 180 km/h.', type: 'cyclone', severity: 'high', location: { name: 'Puri, Odisha', state: 'Odisha' }, disaster: disasters[1]._id, createdBy: admin._id },
    { title: 'Earthquake Magnitude 4.8', message: 'Seismic activity recorded. Avoid damaged structures.', type: 'earthquake', severity: 'medium', location: { name: 'Chamoli, Uttarakhand' }, disaster: disasters[2]._id, createdBy: admin._id },
    { title: 'Extreme Heat Advisory', message: 'Temperature 48°C. Stay indoors between 11AM-4PM.', type: 'heatwave', severity: 'high', location: { name: 'Jaisalmer, Rajasthan' }, disaster: disasters[3]._id, createdBy: admin._id },
    { title: 'Landslide: NH-5 Blocked', message: 'NH-5 closed between Shimla and Manali. Use alternate routes.', type: 'landslide', severity: 'medium', location: { name: 'Shimla, HP' }, disaster: disasters[4]._id, createdBy: admin._id },
  ]);
  console.log('🔔 Alerts seeded');

  // Seed rescue teams
  await RescueTeam.insertMany([
    { name: 'Alpha Team', unit: 'NDRF Battalion 7', teamCode: 'NDRF-07-A', members: 12, status: 'deployed', currentLocation: { name: 'Kottayam', coordinates: { lat: 9.5916, lng: 76.5222 } }, assignedDisaster: disasters[0]._id, mission: 'Flood rescue and evacuation operations', missionProgress: 65, equipment: ['Rescue boats', 'Life jackets', 'Medical kits'], commander: { name: 'Col. Rajesh Kumar', phone: '9800001111', rank: 'Colonel' }, deployedAt: new Date() },
    { name: 'Bravo Team', unit: 'SDRF Kerala', teamCode: 'SDRF-KL-B', members: 8, status: 'standby', currentLocation: { name: 'Puri Base Camp', coordinates: { lat: 19.8135, lng: 85.8312 } }, assignedDisaster: disasters[1]._id, mission: 'Pre-cyclone coastal evacuation', missionProgress: 30, equipment: ['Trucks', 'Tents', 'Food packs'], commander: { name: 'Maj. Anita Singh', phone: '9800002222', rank: 'Major' } },
    { name: 'Charlie Team', unit: 'Army Corps of Engineers', teamCode: 'ARMY-CE-C', members: 20, status: 'deployed', currentLocation: { name: 'Chamoli', coordinates: { lat: 30.0668, lng: 79.0193 } }, assignedDisaster: disasters[2]._id, mission: 'Search and rescue operations', missionProgress: 80, equipment: ['Excavators', 'Search dogs', 'Thermal cameras'], commander: { name: 'Lt. Col. Vikram', phone: '9800003333', rank: 'Lt. Colonel' }, deployedAt: new Date() },
    { name: 'Delta Team', unit: 'Civil Defence Corps', teamCode: 'CD-RJ-D', members: 15, status: 'returning', currentLocation: { name: 'Jaisalmer', coordinates: { lat: 27.0238, lng: 74.2179 } }, assignedDisaster: disasters[3]._id, mission: 'Medical aid and ORS distribution', missionProgress: 95, equipment: ['Medical vans', 'ORS packets', 'Water purifiers'], commander: { name: 'Dr. Priya Mehta', phone: '9800004444', rank: 'Director' }, deployedAt: new Date() },
  ]);
  console.log('🚁 Rescue teams seeded');

  // Seed resources
  await Resource.insertMany([
    { name: 'Food Packets', category: 'food', unit: 'packets', totalStock: 50000, deployed: 32000, location: { warehouse: 'Central Warehouse Delhi', state: 'Delhi' } },
    { name: 'Medical First Aid Kits', category: 'medical', unit: 'kits', totalStock: 8000, deployed: 5200, location: { warehouse: 'NDRF Medical Store', state: 'Delhi' } },
    { name: 'Rescue Boats', category: 'rescue_equipment', unit: 'boats', totalStock: 120, deployed: 87, location: { warehouse: 'Kerala Naval Base', state: 'Kerala' } },
    { name: 'Emergency Tents', category: 'shelter', unit: 'units', totalStock: 3000, deployed: 1850, location: { warehouse: 'NDRF Nagpur', state: 'Maharashtra' } },
    { name: 'Water Tankers', category: 'water', unit: 'tankers', totalStock: 200, deployed: 143, location: { warehouse: 'State DM Authority', state: 'Rajasthan' } },
    { name: 'Ambulances', category: 'transport', unit: 'vehicles', totalStock: 85, deployed: 62, location: { warehouse: 'NDRF Fleet', state: 'Delhi' } },
  ]);
  console.log('📦 Resources seeded');

  console.log('\n🎉 Database seeded successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin Login:');
  console.log('  Email   : admin@drishti.gov.in');
  console.log('  Password: Admin@2026');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  process.exit(0);
};

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
