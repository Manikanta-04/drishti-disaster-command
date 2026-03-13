import { useDisasters } from '../hooks/useDisasters';
import { useAlerts } from '../hooks/useAlerts';
import { useResources } from '../hooks/useResources';
import { useRescue } from '../hooks/useRescue';
import WeatherChart from '../components/dashboard/WeatherChart';
import RiskRadar from '../components/dashboard/RiskRadar';
import DisasterMap from '../components/map/DisasterMap';
import MLPredictionPanel from '../components/ml/MLPredictionPanel';
import Loader from '../components/common/Loader';
import { LayoutDashboard, MapPin, Users, AlertTriangle, Package } from 'lucide-react';
import { weatherData } from '../data/mockData';

const severityColor = {
  critical: { text: '#ff3b3b', bg: 'rgba(255,59,59,0.08)', border: 'rgba(255,59,59,0.2)' },
  high:     { text: '#ff7b3b', bg: 'rgba(255,123,59,0.08)', border: 'rgba(255,123,59,0.2)' },
  medium:   { text: '#ffcb3b', bg: 'rgba(255,203,59,0.08)', border: 'rgba(255,203,59,0.2)' },
  low:      { text: '#3bff8a', bg: 'rgba(59,255,138,0.08)', border: 'rgba(59,255,138,0.2)' },
};

const typeIcon = { flood: '🌊', cyclone: '🌀', earthquake: '⚡', heatwave: '🔥', landslide: '⛰️', other: '⚠️' };
const colorMap = { red: '#ff3b3b', orange: '#ff7b3b', green: '#3bff8a', blue: '#3b9eff', cyan: '#00e5ff' };

const Dashboard = () => {
  const { disasters, loading: dLoading, stats }      = useDisasters();
  const { alerts,    loading: aLoading }             = useAlerts();
  const { resources, loading: rLoading }             = useResources();
  const { teams,     stats: teamStats, loading: tLoading } = useRescue();

  const statCards = [
    { label: 'Active Disasters',  icon: '⚠️', color: 'red',    value: stats?.active ?? '—',          sub: `${stats?.critical ?? 0} critical` },
    { label: 'People Affected',   icon: '👥', color: 'orange', value: stats?.totalAffected ? (stats.totalAffected >= 100000 ? `${(stats.totalAffected/100000).toFixed(1)}L` : stats.totalAffected.toLocaleString()) : '—', sub: 'across all zones' },
    { label: 'Rescue Teams',      icon: '🚁', color: 'blue',   value: teamStats?.total ?? '—',        sub: `${teamStats?.deployed ?? 0} deployed` },
    { label: 'Active Alerts',     icon: '📡', color: 'cyan',   value: alerts.filter(a=>a.isActive).length || '—', sub: `${alerts.filter(a=>a.severity==='critical').length} critical` },
    { label: 'Teams on Standby',  icon: '🏕️', color: 'green',  value: teamStats?.standby ?? '—',      sub: `${teamStats?.returning ?? 0} returning` },
    { label: 'Total Personnel',   icon: '👷', color: 'cyan',   value: teamStats?.totalPersonnel ?? '—', sub: 'field operatives' },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <LayoutDashboard size={18} style={{ color: '#00e5ff' }} />
          <h1 className="font-display font-bold text-xl" style={{ color: '#e8f4f8', letterSpacing: '0.05em' }}>COMMAND DASHBOARD</h1>
        </div>
        <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded"
          style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)', color: '#00e5ff' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-blink" style={{ background: '#3bff8a' }} />
          Live — MongoDB + ML Service
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {statCards.map((card, i) => (
          <div key={i} className="card p-4 animate-slide-up" style={{ animationDelay: `${i*80}ms`, animationFillMode:'both' }}>
            <div className="text-xl mb-2">{card.icon}</div>
            <div className="font-display font-bold text-2xl" style={{ color: colorMap[card.color] }}>
              {dLoading || tLoading || aLoading ? '...' : card.value}
            </div>
            <div className="text-xs mt-0.5 font-semibold" style={{ color: '#e8f4f8' }}>{card.label}</div>
            <div className="text-xs" style={{ color: '#3d6477' }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><WeatherChart data={weatherData} /></div>
        <div><RiskRadar disasters={disasters} /></div>
      </div>

      {/* Main content: Disasters + ML Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Active Disasters */}
        <div className="lg:col-span-2 card p-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} style={{ color: '#ff3b3b' }} />
            <span className="font-display font-bold text-sm" style={{ color: '#e8f4f8', letterSpacing: '0.05em' }}>ACTIVE DISASTERS</span>
            <span className="ml-auto font-mono-custom text-xs px-2 py-0.5 rounded animate-blink"
              style={{ background: 'rgba(255,59,59,0.1)', color: '#ff3b3b', border: '1px solid rgba(255,59,59,0.3)' }}>
              {disasters.length} LIVE
            </span>
          </div>
          {dLoading ? <Loader text="Fetching disasters" /> : (
            <div className="space-y-2">
              {disasters.map((d, i) => {
                const c = severityColor[d.severity] || severityColor.medium;
                return (
                  <div key={d._id} className="flex items-center gap-3 p-3 rounded animate-slide-up"
                    style={{ background: c.bg, border: `1px solid ${c.border}`, animationDelay: `${i*60}ms`, animationFillMode:'both' }}>
                    <span className="text-xl flex-shrink-0">{typeIcon[d.type] || '⚠️'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-display font-semibold text-sm truncate" style={{ color: '#e8f4f8' }}>{d.name}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded font-bold font-mono-custom flex-shrink-0"
                          style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}`, fontSize: '9px' }}>
                          {d.severity.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs" style={{ color: '#7aa3bc' }}>
                        <span><MapPin size={10} className="inline mr-0.5" />{d.location.name}</span>
                        <span><Users size={10} className="inline mr-0.5" />{d.affectedPeople?.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-mono-custom" style={{ color: c.text }}>{d.status.toUpperCase()}</div>
                      <div className="text-xs" style={{ color: '#3d6477' }}>Risk: {d.riskScore}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ✅ ML Prediction Panel */}
        <div><MLPredictionPanel /></div>
      </div>

      {/* Map + Alerts + Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2 card p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-display font-bold text-sm" style={{ color: '#e8f4f8', letterSpacing: '0.05em' }}>SITUATION MAP</span>
            <span className="ml-auto text-xs animate-blink px-2 py-0.5 rounded font-mono-custom"
              style={{ background: 'rgba(255,59,59,0.1)', color: '#ff3b3b', border: '1px solid rgba(255,59,59,0.2)' }}>LIVE</span>
          </div>
          <div style={{ height: '260px' }}>
            <DisasterMap height="100%" disasters={disasters} teams={teams} />
          </div>
        </div>

        {/* Alerts */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={14} style={{ color: '#ffcb3b' }} />
            <span className="font-display font-bold text-sm" style={{ color: '#e8f4f8', letterSpacing: '0.05em' }}>RECENT ALERTS</span>
          </div>
          {aLoading ? <Loader text="Loading" /> : (
            <div className="space-y-2">
              {alerts.slice(0, 5).map((alert, i) => {
                const c = severityColor[alert.severity] || severityColor.medium;
                return (
                  <div key={alert._id} className="p-2.5 rounded animate-slide-up"
                    style={{ background: c.bg, border: `1px solid ${c.border}`, animationDelay: `${i*50}ms`, animationFillMode:'both' }}>
                    <div className="flex items-start justify-between gap-1 mb-0.5">
                      <span className="font-display font-bold text-xs" style={{ color: '#e8f4f8' }}>{alert.title}</span>
                      <span className="font-mono-custom flex-shrink-0"
                        style={{ color: c.text, fontSize: '8px', background: c.bg, padding: '1px 4px', borderRadius: '3px' }}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: '#7aa3bc' }}>{alert.message}</p>
                    <div className="text-xs mt-1" style={{ color: '#3d6477' }}>
                      📍 {alert.location?.name} • {new Date(alert.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Resources */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-4">
          <Package size={16} style={{ color: '#3bff8a' }} />
          <span className="font-display font-bold text-sm" style={{ color: '#e8f4f8', letterSpacing: '0.05em' }}>RESOURCE DEPLOYMENT</span>
        </div>
        {rLoading ? <Loader text="Loading" /> : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {resources.map((r, i) => {
              const pct = Math.round((r.deployed / r.totalStock) * 100);
              const color = pct >= 85 ? '#ff3b3b' : pct >= 60 ? '#ffcb3b' : '#3bff8a';
              const icons = { food:'🍱', medical:'🏥', rescue_equipment:'⛵', shelter:'⛺', water:'💧', transport:'🚑', communication:'📡' };
              return (
                <div key={r._id} className="animate-slide-up" style={{ animationDelay:`${i*60}ms`, animationFillMode:'both' }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs flex items-center gap-1" style={{ color: '#e8f4f8' }}>
                      {icons[r.category] || '📦'} {r.name.split(' ')[0]}
                    </span>
                    <span className="font-mono-custom text-xs" style={{ color }}>{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: '#1a3a52' }}>
                    <div className="h-full rounded-full" style={{ width:`${pct}%`, background: color, transition:'width 1s ease' }} />
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: '#3d6477' }}>{r.deployed}/{r.totalStock} {r.unit}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
