import { useResources } from '../hooks/useResources';
import Loader from '../components/common/Loader';
import { Package } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, Legend,
} from 'recharts';

const icons = {
  food: '🍱', medical: '🏥', rescue_equipment: '⛵',
  shelter: '⛺', water: '💧', transport: '🚑', communication: '📡',
};

// Custom tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0a1628', border: '1px solid #1a3a52', borderRadius: 6, padding: '8px 12px' }}>
      <p style={{ color: '#e8f4f8', fontWeight: 700, marginBottom: 4, fontSize: 12 }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.fill, fontSize: 11, margin: '2px 0' }}>
          {p.name}: {p.value}%
        </p>
      ))}
    </div>
  );
};

const Resources = () => {
  const { resources, loading } = useResources();

  // ✅ FIX: Use percentage values so all bars are on the same 0-100 scale
  const chartData = resources.map(r => {
    const pct       = Math.round((r.deployed / r.totalStock) * 100);
    const available = 100 - pct;
    return {
      name:      r.name.split(' ')[0],
      deployed:  pct,
      available,
      color:     pct >= 85 ? '#ff3b3b' : pct >= 60 ? '#ffcb3b' : '#3bff8a',
    };
  });

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Package size={18} style={{ color: '#3bff8a' }} />
        <h1 className="font-display font-bold text-xl" style={{ color: '#e8f4f8', letterSpacing: '0.05em' }}>
          RESOURCE MANAGEMENT
        </h1>
      </div>

      {loading ? <Loader text="Loading resources" /> : (
        <>
          {/* Resource cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {resources.map((r, i) => {
              const pct   = Math.round((r.deployed / r.totalStock) * 100);
              const color = pct >= 85 ? '#ff3b3b' : pct >= 60 ? '#ffcb3b' : '#3bff8a';
              return (
                <div key={r._id} className="card p-3 text-center animate-slide-up"
                  style={{ animationDelay: `${i*80}ms`, animationFillMode:'both' }}>
                  <div className="text-2xl mb-1">{icons[r.category] || '📦'}</div>
                  <div className="font-display font-bold text-xl" style={{ color }}>{pct}%</div>
                  <div className="h-1 rounded-full mt-1 mb-2" style={{ background: '#1a3a52' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 9999, transition: 'width 1s ease' }} />
                  </div>
                  <div className="text-xs font-semibold" style={{ color: '#e8f4f8' }}>{r.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#7aa3bc' }}>
                    {r.deployed.toLocaleString()} / {r.totalStock.toLocaleString()}
                  </div>
                  <div className="text-xs" style={{ color: '#3d6477' }}>{r.unit}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#3d6477' }}>{r.location?.state}</div>
                </div>
              );
            })}
          </div>

          {/* ✅ FIX: Percentage chart — all resources on same 0-100% scale */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <span className="font-display font-bold text-sm" style={{ color: '#e8f4f8', letterSpacing: '0.05em' }}>
                DEPLOYMENT VS AVAILABILITY (%)
              </span>
              <span className="text-xs font-mono-custom" style={{ color: '#3d6477' }}>
                All values normalised to percentage
              </span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#1a3a52" />
                <XAxis dataKey="name" tick={{ fill: '#7aa3bc', fontSize: 11 }} axisLine={{ stroke: '#1a3a52' }} />
                <YAxis tick={{ fill: '#7aa3bc', fontSize: 11 }} axisLine={{ stroke: '#1a3a52' }}
                  domain={[0, 100]} tickFormatter={v => `${v}%`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: '#7aa3bc', fontSize: 11 }} />
                <Bar dataKey="deployed"  name="Deployed %" radius={[3,3,0,0]} stackId="s">
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
                <Bar dataKey="available" name="Available %" fill="#1a3a52" radius={[3,3,0,0]} stackId="s" />
              </BarChart>
            </ResponsiveContainer>

            {/* Legend with actual numbers */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-3">
              {resources.map(r => {
                const pct   = Math.round((r.deployed / r.totalStock) * 100);
                const color = pct >= 85 ? '#ff3b3b' : pct >= 60 ? '#ffcb3b' : '#3bff8a';
                const avail = r.totalStock - r.deployed - (r.reserved || 0);
                return (
                  <div key={r._id} className="text-center p-2 rounded"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1a3a52' }}>
                    <div className="font-mono-custom text-xs font-bold" style={{ color }}>{pct}%</div>
                    <div className="text-xs" style={{ color: '#3d6477', fontSize: '10px' }}>{r.name.split(' ')[0]}</div>
                    <div className="text-xs" style={{ color: '#3d6477', fontSize: '9px' }}>
                      {avail.toLocaleString()} left
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Resources;
