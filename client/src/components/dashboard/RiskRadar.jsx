import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

const typeOrder = ['flood', 'cyclone', 'earthquake', 'landslide', 'heatwave', 'drought'];

const RiskRadar = ({ disasters = [] }) => {
  // Build radar data from real disasters
  const riskMap = {};
  disasters.forEach(d => {
    if (!riskMap[d.type] || d.riskScore > riskMap[d.type]) {
      riskMap[d.type] = d.riskScore;
    }
  });

  const radarData = typeOrder.map(type => ({
    subject: type.charAt(0).toUpperCase() + type.slice(1),
    value: riskMap[type] || 0,
    fullMark: 100,
  }));

  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Activity size={16} style={{ color: '#ff7b3b' }} />
        <span className="font-display font-bold text-sm" style={{ color: '#e8f4f8', letterSpacing: '0.05em' }}>
          DISASTER RISK ANALYSIS
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="#1a3a52" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#7aa3bc', fontSize: 11 }} />
          <Radar name="Risk" dataKey="value" stroke="#ff7b3b" fill="#ff7b3b" fillOpacity={0.2} strokeWidth={2} />
        </RadarChart>
      </ResponsiveContainer>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {radarData.map(item => (
          <div key={item.subject} className="text-center">
            <div className="font-display font-bold text-lg"
              style={{ color: item.value >= 75 ? '#ff3b3b' : item.value >= 50 ? '#ffcb3b' : item.value > 0 ? '#3bff8a' : '#3d6477' }}>
              {item.value > 0 ? `${item.value}%` : 'N/A'}
            </div>
            <div className="text-xs" style={{ color: '#7aa3bc' }}>{item.subject}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskRadar;
