import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { shelters } from '../../data/mockData';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const severityColor = { critical: '#ff3b3b', high: '#ff7b3b', medium: '#ffcb3b', low: '#3bff8a' };
const severityRadius = { critical: 60000, high: 45000, medium: 30000, low: 15000 };
const typeEmoji = { flood: '🌊', cyclone: '🌀', earthquake: '⚡', heatwave: '🔥', landslide: '⛰️', other: '⚠️' };

const createDisasterIcon = (type, severity) => {
  const color = severityColor[severity] || '#ff7b3b';
  const emoji = typeEmoji[type] || '⚠️';
  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center;">
        <div style="position:absolute;inset:0;border-radius:50%;border:2px solid ${color};animation:pulse-ring 2s ease-out infinite;opacity:0.7;"></div>
        <div style="position:absolute;inset:4px;border-radius:50%;background:${color}22;border:1px solid ${color};"></div>
        <span style="font-size:16px;z-index:1;">${emoji}</span>
      </div>`,
    iconSize: [40, 40], iconAnchor: [20, 20],
  });
};

const createTeamIcon = () => L.divIcon({
  className: '',
  html: `<div style="width:28px;height:28px;background:#3b9eff22;border:2px solid #3b9eff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;">🚁</div>`,
  iconSize: [28, 28], iconAnchor: [14, 14],
});

const createShelterIcon = () => L.divIcon({
  className: '',
  html: `<div style="width:24px;height:24px;background:#3bff8a22;border:2px solid #3bff8a;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:12px;">⛺</div>`,
  iconSize: [24, 24], iconAnchor: [12, 12],
});

const DisasterMap = ({ height = '100%', disasters = [], teams = [], onMarkerClick }) => {
  return (
    <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height, width: '100%', borderRadius: '8px' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="" />

      {/* Impact circles */}
      {disasters.map(d => (
        <Circle key={`c-${d._id}`}
          center={[d.location.coordinates.lat, d.location.coordinates.lng]}
          radius={(severityRadius[d.severity] || 30000)}
          pathOptions={{ color: severityColor[d.severity] || '#ff7b3b', fillColor: severityColor[d.severity] || '#ff7b3b', fillOpacity: 0.1, weight: 1.5, dashArray: '5,5' }}
        />
      ))}

      {/* Disaster markers */}
      {disasters.map(d => (
        <Marker key={d._id}
          position={[d.location.coordinates.lat, d.location.coordinates.lng]}
          icon={createDisasterIcon(d.type, d.severity)}
          eventHandlers={{ click: () => onMarkerClick?.(d) }}>
          <Popup>
            <div style={{ fontFamily: 'Exo 2, sans-serif', minWidth: '180px' }}>
              <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '6px', color: severityColor[d.severity] }}>
                {typeEmoji[d.type]} {d.name}
              </div>
              <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '2px' }}>📍 {d.location.name}</div>
              <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '2px' }}>👥 {d.affectedPeople?.toLocaleString()} affected</div>
              <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '2px' }}>💀 Casualties: {d.casualties}</div>
              <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '6px' }}>📊 Risk Score: {d.riskScore}%</div>
              <div style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700,
                background: `${severityColor[d.severity]}22`, color: severityColor[d.severity], border: `1px solid ${severityColor[d.severity]}` }}>
                {d.severity.toUpperCase()} — {d.status.toUpperCase()}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Rescue team markers */}
      {teams.filter(t => t.currentLocation?.coordinates).map(team => (
        <Marker key={`team-${team._id}`}
          position={[team.currentLocation.coordinates.lat, team.currentLocation.coordinates.lng]}
          icon={createTeamIcon()}>
          <Popup>
            <div style={{ fontFamily: 'Exo 2, sans-serif', minWidth: '160px' }}>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#3b9eff', marginBottom: '4px' }}>🚁 {team.name}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>{team.unit}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>👥 {team.members} members</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>📋 {team.mission}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>Progress: {team.missionProgress}%</div>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Shelters */}
      {shelters.map(shelter => (
        <Marker key={`s-${shelter.id}`} position={[shelter.lat, shelter.lng]} icon={createShelterIcon()}>
          <Popup>
            <div style={{ fontFamily: 'Exo 2, sans-serif', minWidth: '160px' }}>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#3bff8a', marginBottom: '4px' }}>⛺ {shelter.name}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>Capacity: {shelter.capacity}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>Occupied: {shelter.occupied}</div>
              <div style={{ fontSize: '11px', color: shelter.status === 'open' ? '#3bff8a' : '#ffcb3b' }}>
                {shelter.status.toUpperCase()}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default DisasterMap;
