import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, Map, Radio, ArrowRight, Zap } from 'lucide-react';
import DisasterMap from '../components/map/DisasterMap';
import StatCards from '../components/dashboard/StatCards';

const Home = () => {
  return (
    <div className="min-h-screen bg-grid" style={{ background: 'var(--bg-primary)' }}>
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ paddingTop: '80px', minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        {/* Background glow effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{
            position: 'absolute', top: '20%', left: '10%', width: '400px', height: '400px',
            background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)',
            borderRadius: '50%'
          }} />
          <div style={{
            position: 'absolute', top: '30%', right: '15%', width: '300px', height: '300px',
            background: 'radial-gradient(circle, rgba(255,59,59,0.06) 0%, transparent 70%)',
            borderRadius: '50%'
          }} />
        </div>

        <div className="relative z-10 w-full px-6 py-16">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 animate-slide-up"
            style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)' }}>
            <span className="w-2 h-2 rounded-full animate-blink" style={{ background: '#3bff8a' }} />
            <span className="font-mono-custom text-xs" style={{ color: '#00e5ff', letterSpacing: '0.1em' }}>
              7 ACTIVE INCIDENTS — SYSTEM OPERATIONAL
            </span>
          </div>

          {/* Main title */}
          <h1 className="font-display font-bold animate-slide-up delay-100"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', color: '#e8f4f8', lineHeight: 1.1, letterSpacing: '-0.02em', animationFillMode: 'both' }}>
            INTEGRATED<br />
            <span style={{ color: '#00e5ff', textShadow: '0 0 40px rgba(0,229,255,0.4)' }}>DISASTER</span>
            <br />COMMAND CENTER
          </h1>

          <p className="mt-4 max-w-2xl text-base animate-slide-up delay-200" style={{ color: '#7aa3bc', lineHeight: 1.7, animationFillMode: 'both' }}>
            Real-time disaster monitoring, AI-powered risk prediction, and coordinated rescue operations for India's national emergency response infrastructure.
          </p>

          <div className="flex flex-wrap gap-3 mt-8 animate-slide-up delay-300" style={{ animationFillMode: 'both' }}>
            <Link to="/dashboard" className="flex items-center gap-2 px-5 py-2.5 rounded font-display font-bold text-sm transition-all duration-200 hover:scale-105"
              style={{ background: '#00e5ff', color: '#050a0e', letterSpacing: '0.05em' }}>
              <Radio size={16} /> OPEN DASHBOARD
            </Link>
            <Link to="/map" className="flex items-center gap-2 px-5 py-2.5 rounded font-display font-bold text-sm transition-all duration-200"
              style={{ background: 'rgba(0,229,255,0.1)', color: '#00e5ff', border: '1px solid rgba(0,229,255,0.3)', letterSpacing: '0.05em' }}>
              <Map size={16} /> LIVE MAP <ArrowRight size={14} />
            </Link>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-2xl animate-slide-up delay-400" style={{ animationFillMode: 'both' }}>
            {[
              { val: '7', label: 'Active Incidents', color: '#ff3b3b' },
              { val: '3.8L', label: 'Affected People', color: '#ff7b3b' },
              { val: '24', label: 'Rescue Teams', color: '#3b9eff' },
              { val: '142', label: 'Relief Camps', color: '#3bff8a' },
            ].map((s, i) => (
              <div key={i} className="text-center py-3 rounded" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1a3a52' }}>
                <div className="font-display font-bold text-2xl" style={{ color: s.color }}>{s.val}</div>
                <div className="text-xs mt-0.5" style={{ color: '#7aa3bc' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Map Preview */}
      <div className="px-6 pb-8">
        <div className="flex items-center gap-2 mb-3">
          <Map size={16} style={{ color: '#00e5ff' }} />
          <span className="font-display font-bold text-sm" style={{ color: '#e8f4f8', letterSpacing: '0.05em' }}>LIVE DISASTER MAP — INDIA</span>
          <span className="ml-2 text-xs px-2 py-0.5 rounded font-mono-custom animate-blink"
            style={{ background: 'rgba(255,59,59,0.1)', color: '#ff3b3b', border: '1px solid rgba(255,59,59,0.3)' }}>LIVE</span>
        </div>
        <div style={{ height: '450px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #1a3a52' }}>
          <DisasterMap height="100%" />
        </div>
        <div className="flex items-center gap-6 mt-3 text-xs" style={{ color: '#7aa3bc' }}>
          <span className="flex items-center gap-1.5"><span style={{ color: '#ff3b3b' }}>●</span> Critical Disaster</span>
          <span className="flex items-center gap-1.5"><span style={{ color: '#ff7b3b' }}>●</span> High Alert</span>
          <span className="flex items-center gap-1.5"><span style={{ color: '#ffcb3b' }}>●</span> Medium Risk</span>
          <span className="flex items-center gap-1.5">🚁 Rescue Team</span>
          <span className="flex items-center gap-1.5">⛺ Shelter</span>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: '🌊', title: 'Real-Time Monitoring', desc: 'Live data from IMD, NASA, USGS and 500+ IoT sensors across India.', color: '#3b9eff', link: '/dashboard' },
            { icon: '🤖', title: 'AI Risk Prediction', desc: 'ML models predict flood, cyclone, and landslide risk up to 72 hours ahead.', color: '#00e5ff', link: '/dashboard' },
            { icon: '📡', title: 'Instant Alerts', desc: 'SMS, push, and siren integration reaching 1M+ citizens in seconds.', color: '#ff7b3b', link: '/alerts' },
            { icon: '🚁', title: 'Rescue Coordination', desc: 'Track NDRF, SDRF teams and allocate resources in real-time.', color: '#3bff8a', link: '/rescue' },
          ].map((f, i) => (
            <Link key={i} to={f.link} className="card p-5 block animate-slide-up" style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}>
              <div className="text-3xl mb-3">{f.icon}</div>
              <div className="font-display font-bold text-base mb-2" style={{ color: f.color, letterSpacing: '0.05em' }}>{f.title}</div>
              <p className="text-xs" style={{ color: '#7aa3bc', lineHeight: 1.6 }}>{f.desc}</p>
              <div className="flex items-center gap-1 mt-3 text-xs" style={{ color: f.color }}>
                <span>Explore</span> <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
