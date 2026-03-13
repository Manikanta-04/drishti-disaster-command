import { activeDisasters } from '../../data/mockData';
import { AlertTriangle, MapPin, Users } from 'lucide-react';

const severityColor = {
  critical: { text: '#ff3b3b', bg: 'rgba(255,59,59,0.12)', border: 'rgba(255,59,59,0.3)' },
  high: { text: '#ff7b3b', bg: 'rgba(255,123,59,0.12)', border: 'rgba(255,123,59,0.3)' },
  medium: { text: '#ffcb3b', bg: 'rgba(255,203,59,0.12)', border: 'rgba(255,203,59,0.3)' },
  low: { text: '#3bff8a', bg: 'rgba(59,255,138,0.12)', border: 'rgba(59,255,138,0.3)' },
};

const ActiveDisasters = () => {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={16} style={{ color: '#ff3b3b' }} />
        <span className="font-display font-bold text-sm" style={{ color: '#e8f4f8', letterSpacing: '0.05em' }}>
          ACTIVE DISASTERS
        </span>
        <span className="ml-auto font-mono-custom text-xs px-2 py-0.5 rounded animate-blink"
          style={{ background: 'rgba(255,59,59,0.1)', color: '#ff3b3b', border: '1px solid rgba(255,59,59,0.3)' }}>
          {activeDisasters.length} ACTIVE
        </span>
      </div>
      <div className="space-y-2">
        {activeDisasters.map((d, i) => {
          const c = severityColor[d.severity];
          return (
            <div
              key={d.id}
              className="flex items-center gap-3 p-3 rounded cursor-pointer transition-all duration-200 animate-slide-up"
              style={{
                background: c.bg,
                border: `1px solid ${c.border}`,
                animationDelay: `${i * 80}ms`,
                animationFillMode: 'both',
              }}
            >
              <span className="text-xl flex-shrink-0">{d.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-display font-semibold text-sm truncate" style={{ color: '#e8f4f8' }}>
                    {d.name}
                  </span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded font-bold uppercase flex-shrink-0 font-mono-custom"
                    style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}`, fontSize: '9px' }}
                  >
                    {d.severity}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs" style={{ color: '#7aa3bc' }}>
                  <span className="flex items-center gap-1">
                    <MapPin size={10} /> {d.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={10} /> {d.affected.toLocaleString()} affected
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs font-mono-custom" style={{ color: c.text }}>{d.status.toUpperCase()}</div>
                <div className="text-xs" style={{ color: '#3d6477' }}>{d.time}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveDisasters;
