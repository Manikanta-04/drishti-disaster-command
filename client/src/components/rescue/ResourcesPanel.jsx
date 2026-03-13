import { resources } from '../../data/mockData';
import { Package } from 'lucide-react';

const ResourcesPanel = () => {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Package size={16} style={{ color: '#3bff8a' }} />
        <span className="font-display font-bold text-sm" style={{ color: '#e8f4f8', letterSpacing: '0.05em' }}>
          RESOURCE DEPLOYMENT
        </span>
      </div>
      <div className="space-y-3">
        {resources.map((r, i) => {
          const pct = Math.round((r.deployed / r.total) * 100);
          const color = pct >= 85 ? '#ff3b3b' : pct >= 60 ? '#ffcb3b' : '#3bff8a';
          return (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs flex items-center gap-1.5" style={{ color: '#e8f4f8' }}>
                  <span>{r.icon}</span> {r.name}
                </span>
                <span className="font-mono-custom text-xs" style={{ color }}>
                  {r.deployed.toLocaleString()} / {r.total.toLocaleString()}
                </span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: '#1a3a52' }}>
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
              <div className="text-xs mt-0.5" style={{ color: '#3d6477' }}>{pct}% deployed</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResourcesPanel;
