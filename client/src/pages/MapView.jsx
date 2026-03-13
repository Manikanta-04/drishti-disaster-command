import { useState } from 'react';
import { useDisasters } from '../hooks/useDisasters';
import { useRescue } from '../hooks/useRescue';
import DisasterMap from '../components/map/DisasterMap';
import Loader from '../components/common/Loader';
import { Map, Filter, MapPin, Users } from 'lucide-react';

const severityColor = {
  critical: '#ff3b3b', high: '#ff7b3b', medium: '#ffcb3b', low: '#3bff8a',
};

const typeIcon = {
  flood: '🌊', cyclone: '🌀', earthquake: '⚡', heatwave: '🔥', landslide: '⛰️', other: '⚠️',
};

const NAVBAR_HEIGHT = 88; // px — matches your Navbar height

const MapView = () => {
  const { disasters, loading: dLoading } = useDisasters();
  const { teams }                        = useRescue();
  const [selectedType, setSelectedType]  = useState('all');
  const [selected, setSelected]          = useState(null);

  const types = ['all', 'flood', 'cyclone', 'earthquake', 'heatwave', 'landslide'];

  const filtered = selectedType === 'all'
    ? disasters
    : disasters.filter(d => d.type === selectedType);

  return (
    // ✅ FIX: use calc(100vh - NAVBAR_HEIGHT) and remove paddingTop from wrapper
    // This ensures the map fills exactly the remaining viewport with NO blank strip
    <div style={{
      height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>

      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-2.5 flex-shrink-0 flex-wrap"
        style={{ borderBottom: '1px solid #1a3a52', background: 'rgba(5,10,14,0.97)' }}>
        <div className="flex items-center gap-2">
          <Map size={16} style={{ color: '#00e5ff' }} />
          <span className="font-display font-bold text-sm"
            style={{ color: '#e8f4f8', letterSpacing: '0.05em' }}>LIVE DISASTER MAP</span>
          <span className="text-xs px-2 py-0.5 rounded font-mono-custom animate-blink ml-1"
            style={{ background: 'rgba(255,59,59,0.1)', color: '#ff3b3b', border: '1px solid rgba(255,59,59,0.3)' }}>
            {filtered.length} ACTIVE
          </span>
        </div>

        {/* Type filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter size={11} style={{ color: '#7aa3bc' }} />
          {types.map(t => (
            <button key={t} onClick={() => setSelectedType(t)}
              className="text-xs px-2.5 py-1 rounded font-display font-semibold transition-all"
              style={{
                background: selectedType === t ? 'rgba(0,229,255,0.15)' : 'transparent',
                color: selectedType === t ? '#00e5ff' : '#7aa3bc',
                border: `1px solid ${selectedType === t ? 'rgba(0,229,255,0.3)' : '#1a3a52'}`,
                letterSpacing: '0.05em',
              }}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 ml-auto text-xs">
          <span className="flex items-center gap-1.5" style={{ color: '#7aa3bc' }}>
            <span style={{ color: '#ff3b3b' }}>⬤</span> Disaster
          </span>
          <span className="flex items-center gap-1.5" style={{ color: '#7aa3bc' }}>🚁 Rescue</span>
          <span className="flex items-center gap-1.5" style={{ color: '#7aa3bc' }}>⛺ Shelter</span>
        </div>
      </div>

      {/* Map + Sidebar — fills remaining height exactly */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

        {/* Map */}
        <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
          {dLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader text="Loading map data" />
            </div>
          ) : (
            <DisasterMap
              height="100%"
              disasters={filtered}
              teams={teams}
              onMarkerClick={setSelected}
            />
          )}
        </div>

        {/* ✅ Sidebar — scrollable, no truncation */}
        <div style={{
          width: '280px',
          flexShrink: 0,
          overflowY: 'auto',
          background: '#0a1628',
          borderLeft: '1px solid #1a3a52',
        }}>
          <div className="p-3">

            {/* Incidents */}
            <div className="font-display font-bold text-xs mb-2 flex items-center justify-between"
              style={{ color: '#7aa3bc', letterSpacing: '0.1em' }}>
              <span>INCIDENTS ({filtered.length})</span>
              {selected && (
                <button onClick={() => setSelected(null)}
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{ color: '#3d6477', background: '#0d1a28', border: '1px solid #1a3a52' }}>
                  ✕ clear
                </button>
              )}
            </div>

            {dLoading ? <Loader text="Loading" /> : (
              <div className="space-y-2">
                {filtered.map(d => {
                  const c = severityColor[d.severity];
                  const isSelected = selected?._id === d._id;
                  return (
                    <div key={d._id}
                      className="p-2.5 rounded cursor-pointer transition-all duration-150"
                      onClick={() => setSelected(d)}
                      style={{
                        background: isSelected ? `${c}18` : `${c}08`,
                        border: `1px solid ${isSelected ? c : c + '30'}`,
                        transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                      }}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="flex-shrink-0">{typeIcon[d.type] || '⚠️'}</span>
                        <span className="font-display font-semibold text-xs truncate" style={{ color: '#e8f4f8' }}>
                          {d.name}
                        </span>
                      </div>
                      <div className="text-xs mb-1" style={{ color: '#7aa3bc' }}>
                        <MapPin size={9} className="inline mr-1" />{d.location?.name}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs" style={{ color: '#7aa3bc' }}>
                          <Users size={9} className="inline mr-1" />{d.affectedPeople?.toLocaleString()}
                        </span>
                        <span className="font-mono-custom font-bold"
                          style={{ color: c, fontSize: '9px' }}>
                          {d.severity.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs mt-1" style={{ color: '#3d6477' }}>
                        Risk: {d.riskScore}% • {d.status}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Selected incident detail */}
            {selected && (
              <div className="mt-3 p-3 rounded animate-slide-up"
                style={{ background: `${severityColor[selected.severity]}10`, border: `1px solid ${severityColor[selected.severity]}40` }}>
                <div className="font-display font-bold text-xs mb-2"
                  style={{ color: severityColor[selected.severity], letterSpacing: '0.08em' }}>
                  SELECTED INCIDENT
                </div>
                <div className="space-y-1 text-xs">
                  {[
                    ['Name', selected.name],
                    ['Type', selected.type],
                    ['Severity', selected.severity],
                    ['Status', selected.status],
                    ['Affected', selected.affectedPeople?.toLocaleString()],
                    ['Casualties', selected.casualties],
                    ['Risk Score', `${selected.riskScore}%`],
                    ['Location', selected.location?.name],
                  ].map(([k, v]) => v != null && (
                    <div key={k} className="flex justify-between gap-2">
                      <span style={{ color: '#3d6477' }}>{k}</span>
                      <span className="text-right" style={{ color: '#e8f4f8' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rescue teams */}
            {teams.length > 0 && (
              <>
                <div className="font-display font-bold text-xs mt-4 mb-2"
                  style={{ color: '#7aa3bc', letterSpacing: '0.1em' }}>
                  RESCUE TEAMS ({teams.length})
                </div>
                <div className="space-y-2">
                  {teams.map(team => (
                    <div key={team._id} className="p-2.5 rounded"
                      style={{ background: 'rgba(59,158,255,0.06)', border: '1px solid rgba(59,158,255,0.2)' }}>
                      <div className="font-display font-semibold text-xs" style={{ color: '#3b9eff' }}>
                        🚁 {team.name}
                      </div>
                      <div className="text-xs" style={{ color: '#7aa3bc' }}>{team.unit}</div>
                      {team.currentLocation?.name && (
                        <div className="text-xs" style={{ color: '#7aa3bc' }}>
                          <MapPin size={9} className="inline mr-1" />{team.currentLocation.name}
                        </div>
                      )}
                      <div className="mt-1">
                        <div className="h-1 rounded-full" style={{ background: '#1a3a52' }}>
                          <div className="h-full rounded-full"
                            style={{ width: `${team.missionProgress}%`, background: '#3b9eff' }} />
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: '#3d6477' }}>
                          {team.missionProgress}% mission progress
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
