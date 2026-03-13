import { useState } from 'react';
import { alerts } from '../../data/mockData';
import { Bell, MapPin, Clock, Check } from 'lucide-react';

const severityStyle = {
  critical: { text: '#ff3b3b', border: 'rgba(255,59,59,0.3)', bg: 'rgba(255,59,59,0.05)' },
  high: { text: '#ff7b3b', border: 'rgba(255,123,59,0.3)', bg: 'rgba(255,123,59,0.05)' },
  medium: { text: '#ffcb3b', border: 'rgba(255,203,59,0.3)', bg: 'rgba(255,203,59,0.05)' },
  low: { text: '#3bff8a', border: 'rgba(59,255,138,0.3)', bg: 'rgba(59,255,138,0.05)' },
};

const AlertsList = ({ limit }) => {
  const [readAlerts, setReadAlerts] = useState(new Set(alerts.filter(a => a.read).map(a => a.id)));
  const displayAlerts = limit ? alerts.slice(0, limit) : alerts;

  return (
    <div className="space-y-2">
      {displayAlerts.map((alert, i) => {
        const s = severityStyle[alert.severity];
        const isRead = readAlerts.has(alert.id);
        return (
          <div
            key={alert.id}
            className={`p-3 rounded cursor-pointer transition-all duration-200 animate-slide-up`}
            style={{
              background: s.bg,
              border: `1px solid ${s.border}`,
              opacity: isRead ? 0.6 : 1,
              animationDelay: `${i * 60}ms`,
              animationFillMode: 'both',
            }}
            onClick={() => setReadAlerts(prev => new Set([...prev, alert.id]))}
          >
            <div className="flex items-start gap-3">
              <Bell size={14} style={{ color: s.text, flexShrink: 0, marginTop: 2 }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display font-bold text-sm" style={{ color: '#e8f4f8' }}>
                    {alert.title}
                  </span>
                  {!isRead && (
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-blink" style={{ background: s.text }} />
                  )}
                </div>
                <p className="text-xs mb-1.5" style={{ color: '#7aa3bc', lineHeight: 1.5 }}>{alert.message}</p>
                <div className="flex items-center gap-3 text-xs" style={{ color: '#3d6477' }}>
                  <span className="flex items-center gap-1"><MapPin size={10} /> {alert.location}</span>
                  <span className="flex items-center gap-1"><Clock size={10} /> {alert.time}</span>
                </div>
              </div>
              <span
                className="text-xs px-2 py-0.5 rounded font-bold font-mono-custom flex-shrink-0"
                style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}`, fontSize: '9px' }}
              >
                {alert.severity.toUpperCase()}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AlertsList;
