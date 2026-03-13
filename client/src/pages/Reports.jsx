import { useDisasters } from '../hooks/useDisasters';
import { useAlerts } from '../hooks/useAlerts';
import { useRescue } from '../hooks/useRescue';
import { BarChart3, TrendingUp, AlertTriangle, Users, Clock } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';

const monthlyData = [
  { month: 'Aug', floods: 3, cyclones: 1, earthquakes: 2, heatwaves: 0, landslides: 1 },
  { month: 'Sep', floods: 2, cyclones: 0, earthquakes: 3, heatwaves: 1, landslides: 2 },
  { month: 'Oct', floods: 4, cyclones: 2, earthquakes: 1, heatwaves: 2, landslides: 3 },
  { month: 'Nov', floods: 6, cyclones: 3, earthquakes: 2, heatwaves: 5, landslides: 1 },
  { month: 'Dec', floods: 8, cyclones: 4, earthquakes: 1, heatwaves: 8, landslides: 2 },
  { month: 'Jan', floods: 5, cyclones: 2, earthquakes: 3, heatwaves: 3, landslides: 4 },
  { month: 'Feb', floods: 7, cyclones: 1, earthquakes: 2, heatwaves: 6, landslides: 2 },
  { month: 'Mar', floods: 9, cyclones: 3, earthquakes: 4, heatwaves: 4, landslides: 5 },
];

const pieData = [
  { name: 'Floods',      value: 38, color: '#3b9eff' },
  { name: 'Cyclones',    value: 22, color: '#00e5ff' },
  { name: 'Heatwaves',   value: 19, color: '#ff7b3b' },
  { name: 'Earthquakes', value: 12, color: '#ffcb3b' },
  { name: 'Landslides',  value: 9,  color: '#3bff8a' },
];

const responseTimeData = [
  { month: 'Aug', avgHours: 4.2 },
  { month: 'Sep', avgHours: 3.8 },
  { month: 'Oct', avgHours: 3.1 },
  { month: 'Nov', avgHours: 2.9 },
  { month: 'Dec', avgHours: 2.4 },
  { month: 'Jan', avgHours: 2.1 },
  { month: 'Feb', avgHours: 1.8 },
  { month: 'Mar', avgHours: 1.5 },
];

const recentIncidents = [
  { name: 'Kerala Flood Alert',       type: 'Flood',      severity: 'critical', affected: '2,50,000', status: 'Active',   response: '1.2h' },
  { name: 'Cyclone Mocha',            type: 'Cyclone',    severity: 'high',     affected: '1,20,000', status: 'Active',   response: '0.8h' },
  { name: 'Uttarakhand Earthquake',   type: 'Earthquake', severity: 'medium',   affected: '8,000',    status: 'Monitoring','response': '2.1h' },
  { name: 'Rajasthan Heatwave',       type: 'Heatwave',   severity: 'high',     affected: '2,00,000', status: 'Active',   response: '1.5h' },
  { name: 'HP Landslide',             type: 'Landslide',  severity: 'medium',   affected: '3,500',    status: 'Warning',  response: '3.0h' },
];

const severityColor = {
  critical: { text: '#ff3b3b', bg: 'rgba(255,59,59,0.08)', border: 'rgba(255,59,59,0.25)' },
  high:     { text: '#ff7b3b', bg: 'rgba(255,123,59,0.08)', border: 'rgba(255,123,59,0.25)' },
  medium:   { text: '#ffcb3b', bg: 'rgba(255,203,59,0.08)', border: 'rgba(255,203,59,0.25)' },
  low:      { text: '#3bff8a', bg: 'rgba(59,255,138,0.08)', border: 'rgba(59,255,138,0.25)' },
};

const tooltipStyle = { background: '#0a1628', border: '1px solid #1a3a52', color: '#e8f4f8', fontSize: 12 };

const Reports = () => {
  const { disasters, stats }       = useDisasters();
  const { alerts }                 = useAlerts();
  const { stats: teamStats }       = useRescue();

  const summaryCards = [
    { label: 'Total Disasters (2026)', value: stats?.total ?? recentIncidents.length, icon: '⚠️', color: '#ff3b3b', sub: `${stats?.active ?? 4} currently active` },
    { label: 'People Affected',        value: stats?.totalAffected ? `${(stats.totalAffected/100000).toFixed(1)}L` : '5.8L', icon: '👥', color: '#ff7b3b', sub: 'across all active zones' },
    { label: 'Alerts Issued',          value: alerts.length || 8,  icon: '📡', color: '#ffcb3b', sub: `${alerts.filter(a=>a.severity==='critical').length || 3} critical` },
    { label: 'Teams Deployed',         value: teamStats?.deployed ?? 2, icon: '🚁', color: '#00e5ff', sub: `${teamStats?.totalPersonnel ?? 55} total personnel` },
    { label: 'Avg Response Time',      value: '1.5h', icon: '⏱️', color: '#3bff8a', sub: '↓ 65% faster than last year' },
    { label: 'Lives Saved (Est.)',     value: '12,400', icon: '❤️', color: '#3bff8a', sub: 'across all operations' },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <BarChart3 size={18} style={{ color: '#3b9eff' }} />
          <h1 className="font-display font-bold text-xl" style={{ color: '#e8f4f8', letterSpacing: '0.05em' }}>
            DISASTER REPORTS & ANALYTICS
          </h1>
        </div>
        <div className="text-xs px-3 py-1.5 rounded font-mono-custom"
          style={{ background: 'rgba(59,158,255,0.08)', color: '#3b9eff', border: '1px solid rgba(59,158,255,0.2)' }}>
          AUG 2025 — MAR 2026
        </div>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {summaryCards.map((c, i) => (
          <div key={i} className="card p-3 animate-slide-up" style={{ animationDelay: `${i*60}ms`, animationFillMode:'both' }}>
            <div className="text-xl mb-1">{c.icon}</div>
            <div className="font-display font-bold text-xl" style={{ color: c.color }}>{c.value}</div>
            <div className="text-xs font-semibold mt-0.5" style={{ color: '#e8f4f8' }}>{c.label}</div>
            <div className="text-xs mt-0.5" style={{ color: '#3d6477' }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly frequency - spans 2 cols */}
        <div className="lg:col-span-2 card p-4">
          <div className="font-display font-bold text-sm mb-4" style={{ color: '#e8f4f8', letterSpacing: '0.05em' }}>
            MONTHLY DISASTER FREQUENCY (2026)
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3a52" />
              <XAxis dataKey="month" tick={{ fill: '#7aa3bc', fontSize: 11 }} axisLine={{ stroke: '#1a3a52' }} />
              <YAxis tick={{ fill: '#7aa3bc', fontSize: 11 }} axisLine={{ stroke: '#1a3a52' }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ color: '#7aa3bc', fontSize: 11 }} />
              <Bar dataKey="floods"      fill="#3b9eff" radius={[2,2,0,0]} name="Floods"      stackId="a" />
              <Bar dataKey="cyclones"    fill="#00e5ff" radius={[2,2,0,0]} name="Cyclones"    stackId="a" />
              <Bar dataKey="heatwaves"   fill="#ff7b3b" radius={[2,2,0,0]} name="Heatwaves"   stackId="a" />
              <Bar dataKey="earthquakes" fill="#ffcb3b" radius={[2,2,0,0]} name="Earthquakes" stackId="a" />
              <Bar dataKey="landslides"  fill="#3bff8a" radius={[2,2,0,0]} name="Landslides"  stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="card p-4">
          <div className="font-display font-bold text-sm mb-3" style={{ color: '#e8f4f8', letterSpacing: '0.05em' }}>
            DISASTER TYPE DISTRIBUTION
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: d.color }} />
                <span style={{ color: '#7aa3bc' }}>{d.name}</span>
                <span className="ml-auto font-bold font-mono-custom" style={{ color: d.color }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Response time trend */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={14} style={{ color: '#3bff8a' }} />
            <span className="font-display font-bold text-sm" style={{ color: '#e8f4f8', letterSpacing: '0.05em' }}>
              AVG RESPONSE TIME TREND (hours)
            </span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3a52" />
              <XAxis dataKey="month" tick={{ fill: '#7aa3bc', fontSize: 11 }} axisLine={{ stroke: '#1a3a52' }} />
              <YAxis tick={{ fill: '#7aa3bc', fontSize: 11 }} axisLine={{ stroke: '#1a3a52' }} domain={[0, 5]} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}h`, 'Avg Response']} />
              <Line type="monotone" dataKey="avgHours" stroke="#3bff8a" strokeWidth={2.5}
                dot={{ fill: '#3bff8a', r: 4 }} activeDot={{ r: 6 }} name="Avg Hours" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-2 text-xs text-center" style={{ color: '#3bff8a' }}>
            ↓ 64% improvement over 8 months
          </div>
        </div>

        {/* Severity breakdown bar */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={14} style={{ color: '#ff3b3b' }} />
            <span className="font-display font-bold text-sm" style={{ color: '#e8f4f8', letterSpacing: '0.05em' }}>
              MONTHLY SEVERITY BREAKDOWN
            </span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={[
              { month: 'Jan', critical: 2, high: 3, medium: 4, low: 1 },
              { month: 'Feb', critical: 1, high: 4, medium: 3, low: 2 },
              { month: 'Mar', critical: 3, high: 5, medium: 2, low: 3 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3a52" />
              <XAxis dataKey="month" tick={{ fill: '#7aa3bc', fontSize: 11 }} axisLine={{ stroke: '#1a3a52' }} />
              <YAxis tick={{ fill: '#7aa3bc', fontSize: 11 }} axisLine={{ stroke: '#1a3a52' }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="critical" fill="#ff3b3b" radius={[2,2,0,0]} name="Critical" stackId="s" />
              <Bar dataKey="high"     fill="#ff7b3b" radius={[2,2,0,0]} name="High"     stackId="s" />
              <Bar dataKey="medium"   fill="#ffcb3b" radius={[2,2,0,0]} name="Medium"   stackId="s" />
              <Bar dataKey="low"      fill="#3bff8a" radius={[2,2,0,0]} name="Low"      stackId="s" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent incidents table */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={14} style={{ color: '#00e5ff' }} />
          <span className="font-display font-bold text-sm" style={{ color: '#e8f4f8', letterSpacing: '0.05em' }}>
            RECENT INCIDENT SUMMARY
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid #1a3a52' }}>
                {['Incident', 'Type', 'Severity', 'Affected', 'Response Time', 'Status'].map(h => (
                  <th key={h} className="text-left pb-2 pr-4 font-display font-bold"
                    style={{ color: '#7aa3bc', letterSpacing: '0.05em', fontSize: '10px' }}>
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentIncidents.map((inc, i) => {
                const c = severityColor[inc.severity];
                return (
                  <tr key={i} className="animate-slide-up"
                    style={{ borderBottom: '1px solid #0d1a28', animationDelay: `${i*50}ms`, animationFillMode:'both' }}>
                    <td className="py-2.5 pr-4 font-display font-semibold" style={{ color: '#e8f4f8' }}>{inc.name}</td>
                    <td className="py-2.5 pr-4" style={{ color: '#7aa3bc' }}>{inc.type}</td>
                    <td className="py-2.5 pr-4">
                      <span className="px-2 py-0.5 rounded font-mono-custom font-bold"
                        style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}`, fontSize: '9px' }}>
                        {inc.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 font-mono-custom" style={{ color: '#e8f4f8' }}>{inc.affected}</td>
                    <td className="py-2.5 pr-4 font-mono-custom" style={{ color: '#3bff8a' }}>{inc.response}</td>
                    <td className="py-2.5">
                      <span className="flex items-center gap-1" style={{ color: inc.status === 'Active' ? '#ff3b3b' : '#ffcb3b' }}>
                        <span className="w-1.5 h-1.5 rounded-full animate-blink" style={{ background: 'currentColor' }} />
                        {inc.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
