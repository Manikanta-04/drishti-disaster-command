import { useRescue } from '../hooks/useRescue';
import { useResources } from '../hooks/useResources';
import Loader from '../components/common/Loader';
import { Users, Radio, MapPin } from 'lucide-react';

const statusStyle = {
  deployed:    { text: '#00e5ff', bg: 'rgba(0,229,255,0.08)',   border: 'rgba(0,229,255,0.25)'   },
  standby:     { text: '#ffcb3b', bg: 'rgba(255,203,59,0.08)',  border: 'rgba(255,203,59,0.25)'  },
  returning:   { text: '#3bff8a', bg: 'rgba(59,255,138,0.08)',  border: 'rgba(59,255,138,0.25)'  },
  unavailable: { text: '#ff3b3b', bg: 'rgba(255,59,59,0.08)',   border: 'rgba(255,59,59,0.25)'   },
};

const resourceIcons = {
  food: '🍱', medical: '🏥', rescue_equipment: '⛵',
  shelter: '⛺', water: '💧', transport: '🚑', communication: '📡',
};

const RescueOps = () => {
  const { teams, stats, loading: tLoading } = useRescue();
  const { resources, loading: rLoading }    = useResources();

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Users size={18} style={{ color: '#3b9eff' }} />
        <h1 className="font-display font-bold text-xl" style={{ color: '#e8f4f8', letterSpacing: '0.05em' }}>
          RESCUE OPERATIONS
        </h1>
        <span className="ml-2 text-xs px-2 py-0.5 rounded font-mono-custom animate-blink"
          style={{ background: 'rgba(59,158,255,0.1)', color: '#3b9eff', border: '1px solid rgba(59,158,255,0.3)' }}>
          LIVE
        </span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Deployed',         value: stats?.deployed,        color: '#00e5ff' },
          { label: 'Standby',          value: stats?.standby,         color: '#ffcb3b' },
          { label: 'Returning',        value: stats?.returning,       color: '#3bff8a' },
          { label: 'Total Personnel',  value: stats?.totalPersonnel,  color: '#3b9eff' },
        ].map(s => (
          <div key={s.label} className="card p-3 text-center">
            <div className="font-display font-bold text-2xl" style={{ color: s.color }}>
              {tLoading ? '...' : (s.value ?? '—')}
            </div>
            <div className="text-xs" style={{ color: '#7aa3bc' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Teams + Resources side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* ── Teams ─────────────────────────────────── */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-4">
            <Radio size={16} style={{ color: '#3b9eff' }} />
            <span className="font-display font-bold text-sm" style={{ color: '#e8f4f8', letterSpacing: '0.05em' }}>
              TEAM STATUS
            </span>
            {!tLoading && (
              <span className="ml-auto font-mono-custom text-xs px-2 py-0.5 rounded"
                style={{ background: 'rgba(59,158,255,0.08)', color: '#3b9eff', border: '1px solid rgba(59,158,255,0.2)' }}>
                {teams.length} TEAMS
              </span>
            )}
          </div>

          {tLoading ? <Loader text="Loading teams" /> : (
            <div className="space-y-3">
              {teams.length === 0 ? (
                <div className="text-center py-8 text-xs" style={{ color: '#3d6477' }}>No teams found</div>
              ) : teams.map((team, i) => {
                const s = statusStyle[team.status] || statusStyle.standby;
                return (
                  <div key={team._id} className="p-3 rounded animate-slide-up"
                    style={{ background: s.bg, border: `1px solid ${s.border}`, animationDelay: `${i*80}ms`, animationFillMode:'both' }}>

                    {/* Team name + status badge */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <div className="font-display font-bold text-sm" style={{ color: '#e8f4f8' }}>{team.name}</div>
                        <div className="text-xs" style={{ color: '#7aa3bc' }}>
                          {team.unit} • {team.members} members
                        </div>
                        {team.commander?.name && (
                          <div className="text-xs" style={{ color: '#3d6477' }}>
                            CMD: {team.commander.name} ({team.commander.rank})
                          </div>
                        )}
                      </div>
                      <span className="flex-shrink-0 text-xs font-bold font-mono-custom px-2 py-0.5 rounded"
                        style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}`, fontSize: '9px' }}>
                        {team.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Mission */}
                    {team.mission && (
                      <div className="text-xs mb-1.5" style={{ color: '#7aa3bc' }}>📋 {team.mission}</div>
                    )}

                    {/* Location + Disaster */}
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 mb-2">
                      {team.currentLocation?.name && (
                        <div className="text-xs flex items-center gap-1" style={{ color: '#7aa3bc' }}>
                          <MapPin size={9} /> {team.currentLocation.name}
                        </div>
                      )}
                      {team.assignedDisaster?.name && (
                        <div className="text-xs" style={{ color: '#7aa3bc' }}>
                          🔗 {team.assignedDisaster.name}
                        </div>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div className="flex justify-between text-xs mb-1" style={{ color: '#7aa3bc' }}>
                      <span>Mission Progress</span>
                      <span style={{ color: s.text, fontWeight: 700 }}>{team.missionProgress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: '#1a3a52' }}>
                      <div className="h-full rounded-full"
                        style={{ width: `${team.missionProgress}%`, background: s.text, transition: 'width 1s ease' }} />
                    </div>

                    {/* Equipment tags */}
                    {team.equipment?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {team.equipment.map(eq => (
                          <span key={eq} className="text-xs px-1.5 py-0.5 rounded"
                            style={{ background: 'rgba(255,255,255,0.04)', color: '#7aa3bc', border: '1px solid #1a3a52', fontSize: '10px' }}>
                            {eq}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Resources ─────────────────────────────── */}
        <div className="card p-4">
          <div className="font-display font-bold text-sm mb-4" style={{ color: '#e8f4f8', letterSpacing: '0.05em' }}>
            RESOURCE DEPLOYMENT
          </div>
          {rLoading ? <Loader text="Loading resources" /> : (
            <div className="space-y-3">
              {resources.map((r, i) => {
                const pct   = Math.round((r.deployed / r.totalStock) * 100);
                const color = pct >= 85 ? '#ff3b3b' : pct >= 60 ? '#ffcb3b' : '#3bff8a';
                return (
                  <div key={r._id} className="animate-slide-up"
                    style={{ animationDelay: `${i*60}ms`, animationFillMode:'both' }}>

                    {/* ✅ FIX: use flex-wrap so text never truncates */}
                    <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                      <span className="text-xs flex items-center gap-1.5 min-w-0" style={{ color: '#e8f4f8' }}>
                        <span className="flex-shrink-0">{resourceIcons[r.category] || '📦'}</span>
                        <span className="truncate">{r.name}</span>
                      </span>
                      {/* ✅ FIX: number on its own line if narrow */}
                      <span className="font-mono-custom text-xs flex-shrink-0" style={{ color }}>
                        {r.deployed.toLocaleString()} / {r.totalStock.toLocaleString()} {r.unit}
                      </span>
                    </div>

                    <div className="h-1.5 rounded-full" style={{ background: '#1a3a52' }}>
                      <div className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: color, transition: 'width 1s ease' }} />
                    </div>

                    <div className="flex justify-between text-xs mt-0.5">
                      <span style={{ color: '#3d6477' }}>{r.location?.warehouse || r.location?.state}</span>
                      <span style={{ color }}>{pct}% deployed</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RescueOps;
