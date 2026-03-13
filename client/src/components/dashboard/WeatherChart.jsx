import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { weatherData } from '../../data/mockData';
import { CloudRain } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded text-xs" style={{ background: '#0a1628', border: '1px solid #1a3a52' }}>
        <div className="font-bold mb-1" style={{ color: '#00e5ff' }}>{label}</div>
        {payload.map(p => (
          <div key={p.name} style={{ color: p.color }}>{p.name}: {p.value}{p.name === 'temperature' ? '°C' : p.name === 'humidity' ? '%' : ' mm'}</div>
        ))}
      </div>
    );
  }
  return null;
};

const WeatherChart = () => {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-4">
        <CloudRain size={16} style={{ color: '#3b9eff' }} />
        <span className="font-display font-bold text-sm" style={{ color: '#e8f4f8', letterSpacing: '0.05em' }}>
          WEATHER MONITORING — LAST 24 HOURS
        </span>
        <span className="ml-auto text-xs px-2 py-0.5 rounded font-mono-custom animate-blink"
          style={{ background: 'rgba(59,158,255,0.1)', color: '#3b9eff', border: '1px solid rgba(59,158,255,0.3)' }}>
          LIVE
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={weatherData}>
          <defs>
            <linearGradient id="rainfall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b9eff" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b9eff" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="windSpeed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a3a52" />
          <XAxis dataKey="time" tick={{ fill: '#7aa3bc', fontSize: 11 }} axisLine={{ stroke: '#1a3a52' }} />
          <YAxis tick={{ fill: '#7aa3bc', fontSize: 11 }} axisLine={{ stroke: '#1a3a52' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: '#7aa3bc', fontSize: 12 }} />
          <Area type="monotone" dataKey="rainfall" stroke="#3b9eff" strokeWidth={2} fill="url(#rainfall)" name="rainfall" />
          <Area type="monotone" dataKey="windSpeed" stroke="#00e5ff" strokeWidth={2} fill="url(#windSpeed)" name="windSpeed" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeatherChart;
