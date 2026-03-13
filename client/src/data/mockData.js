export const activeDisasters = [
  { id: 1, type: 'flood', name: 'Kerala Flood Alert', severity: 'critical', location: 'Kottayam, Kerala', lat: 9.5916, lng: 76.5222, affected: 45000, status: 'active', time: '2 hrs ago', icon: '🌊' },
  { id: 2, type: 'cyclone', name: 'Cyclone Mocha', severity: 'high', location: 'Bay of Bengal, Odisha Coast', lat: 19.8135, lng: 85.8312, affected: 120000, status: 'approaching', time: '5 hrs ago', icon: '🌀' },
  { id: 3, type: 'earthquake', name: 'Seismic Activity', severity: 'medium', location: 'Uttarakhand', lat: 30.0668, lng: 79.0193, affected: 8000, status: 'monitoring', time: '1 hr ago', icon: '⚡' },
  { id: 4, type: 'heatwave', name: 'Severe Heatwave', severity: 'high', location: 'Rajasthan', lat: 27.0238, lng: 74.2179, affected: 200000, status: 'active', time: '12 hrs ago', icon: '🔥' },
  { id: 5, type: 'landslide', name: 'Landslide Warning', severity: 'medium', location: 'Himachal Pradesh', lat: 31.1048, lng: 77.1734, affected: 3500, status: 'warning', time: '30 min ago', icon: '⛰️' },
];

export const alerts = [
  { id: 1, type: 'flood', severity: 'critical', title: 'CRITICAL: Flash Flood Warning', message: 'Immediate evacuation required. Water levels rising rapidly in low-lying areas.', location: 'Kottayam, Kerala', time: '10:32 AM', read: false },
  { id: 2, type: 'cyclone', severity: 'high', title: 'Cyclone Landfall Expected in 24hrs', message: 'Cyclone Mocha expected to make landfall near Puri. Wind speeds 180 km/h.', location: 'Puri, Odisha', time: '09:15 AM', read: false },
  { id: 3, type: 'earthquake', severity: 'medium', title: 'Earthquake Magnitude 4.8 Detected', message: 'Seismic activity recorded. Aftershocks possible. Avoid damaged structures.', location: 'Chamoli, Uttarakhand', time: '08:47 AM', read: true },
  { id: 4, type: 'heatwave', severity: 'high', title: 'Extreme Heat Advisory', message: 'Temperatures forecast at 48°C. Avoid outdoor activity between 11AM–4PM.', location: 'Jaisalmer, Rajasthan', time: '07:00 AM', read: true },
  { id: 5, type: 'landslide', severity: 'medium', title: 'Landslide Risk: NH-5 Blocked', message: 'Heavy rainfall triggered landslide. NH-5 closed between Shimla and Manali.', location: 'Shimla, HP', time: '06:30 AM', read: false },
];

export const rescueTeams = [
  { id: 1, name: 'Alpha Team', unit: 'NDRF Battalion 7', members: 12, status: 'deployed', location: 'Kottayam', lat: 9.5916, lng: 76.5222, mission: 'Flood rescue operations', progress: 65 },
  { id: 2, name: 'Bravo Team', unit: 'SDRF Kerala', members: 8, status: 'standby', location: 'Puri Base Camp', lat: 19.8135, lng: 85.8312, mission: 'Pre-cyclone evacuation', progress: 30 },
  { id: 3, name: 'Charlie Team', unit: 'Army Corps', members: 20, status: 'deployed', location: 'Chamoli', lat: 30.0668, lng: 79.0193, mission: 'Search and rescue', progress: 80 },
  { id: 4, name: 'Delta Team', unit: 'Civil Defence', members: 15, status: 'returning', location: 'Jaisalmer', lat: 27.0238, lng: 74.2179, mission: 'Medical aid distribution', progress: 95 },
];

export const resources = [
  { name: 'Food Packets', total: 50000, deployed: 32000, unit: 'packets', icon: '🍱' },
  { name: 'Medical Kits', total: 8000, deployed: 5200, unit: 'kits', icon: '🏥' },
  { name: 'Rescue Boats', total: 120, deployed: 87, unit: 'boats', icon: '⛵' },
  { name: 'Tents/Shelters', total: 3000, deployed: 1850, unit: 'units', icon: '⛺' },
  { name: 'Water Tankers', total: 200, deployed: 143, unit: 'tankers', icon: '💧' },
  { name: 'Ambulances', total: 85, deployed: 62, unit: 'vehicles', icon: '🚑' },
];

export const weatherData = [
  { time: '00:00', rainfall: 12, windSpeed: 35, temperature: 28, humidity: 82 },
  { time: '03:00', rainfall: 25, windSpeed: 42, temperature: 27, humidity: 85 },
  { time: '06:00', rainfall: 45, windSpeed: 58, temperature: 26, humidity: 90 },
  { time: '09:00', rainfall: 68, windSpeed: 72, temperature: 25, humidity: 94 },
  { time: '12:00', rainfall: 82, windSpeed: 89, temperature: 24, humidity: 96 },
  { time: '15:00', rainfall: 95, windSpeed: 102, temperature: 24, humidity: 98 },
  { time: '18:00', rainfall: 78, windSpeed: 85, temperature: 25, humidity: 95 },
  { time: '21:00', rainfall: 55, windSpeed: 65, temperature: 26, humidity: 91 },
];

export const riskData = [
  { subject: 'Flood', value: 88, fullMark: 100 },
  { subject: 'Cyclone', value: 72, fullMark: 100 },
  { subject: 'Earthquake', value: 45, fullMark: 100 },
  { subject: 'Landslide', value: 61, fullMark: 100 },
  { subject: 'Heatwave', value: 79, fullMark: 100 },
  { subject: 'Drought', value: 34, fullMark: 100 },
];

export const shelters = [
  { id: 1, name: 'Government School Relief Camp', lat: 9.6100, lng: 76.5400, capacity: 500, occupied: 320, status: 'open' },
  { id: 2, name: 'District Sports Complex', lat: 9.5700, lng: 76.5100, capacity: 1200, occupied: 980, status: 'near-full' },
  { id: 3, name: 'Municipal Community Hall', lat: 9.6300, lng: 76.4900, capacity: 300, occupied: 145, status: 'open' },
  { id: 4, name: 'NDRF Emergency Base', lat: 9.5500, lng: 76.5600, capacity: 800, occupied: 200, status: 'open' },
];

export const statCards = [
  { label: 'Active Disasters', value: '7', change: '+2', trend: 'up', color: 'red', icon: '⚠️' },
  { label: 'People Affected', value: '3.8L', change: '+45K', trend: 'up', color: 'orange', icon: '👥' },
  { label: 'Rescue Teams', value: '24', change: '+6', trend: 'up', color: 'blue', icon: '🚁' },
  { label: 'Alerts Sent', value: '1.2M', change: '+120K', trend: 'up', color: 'cyan', icon: '📡' },
  { label: 'Shelters Active', value: '142', change: '+18', trend: 'up', color: 'green', icon: '🏕️' },
  { label: 'Response Time', value: '8 min', change: '-2m', trend: 'down', color: 'green', icon: '⏱️' },
];
