import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Map, Bell, Users, Package, BarChart3, Settings, Radio, Zap } from 'lucide-react';

const navItems = [
  { path: '/', icon: Radio, label: 'Overview', badge: null },
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
  { path: '/map', icon: Map, label: 'Live Map', badge: 'LIVE' },
  { path: '/alerts', icon: Bell, label: 'Alerts', badge: '5' },
  { path: '/rescue', icon: Users, label: 'Rescue Ops', badge: null },
  { path: '/resources', icon: Package, label: 'Resources', badge: null },
  { path: '/reports', icon: BarChart3, label: 'Reports', badge: null },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed left-0 top-0 bottom-0 z-40 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        style={{
          width: '220px',
          paddingTop: '88px',
          background: 'rgba(5,10,14,0.98)',
          borderRight: '1px solid #1a3a52',
        }}
      >
        {/* System Status */}
        <div className="mx-3 mb-4 p-3 rounded" style={{ background: 'rgba(0,229,255,0.05)', border: '1px solid rgba(0,229,255,0.15)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Zap size={12} style={{ color: '#00e5ff' }} />
            <span className="text-xs font-display font-semibold" style={{ color: '#00e5ff', letterSpacing: '0.1em' }}>SYSTEM STATUS</span>
          </div>
          {[
            { label: 'Weather APIs', status: 'online' },
            { label: 'ML Models', status: 'online' },
            { label: 'Alert Engine', status: 'active' },
            { label: 'Sensor Feed', status: 'partial' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-0.5">
              <span className="text-xs" style={{ color: '#7aa3bc' }}>{item.label}</span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{
                  background: item.status === 'online' || item.status === 'active' ? '#3bff8a' : '#ffcb3b'
                }} />
                <span className="text-xs font-mono-custom" style={{
                  color: item.status === 'online' || item.status === 'active' ? '#3bff8a' : '#ffcb3b',
                  fontSize: '10px'
                }}>{item.status.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(({ path, icon: Icon, label, badge }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-200 group relative"
                style={{
                  background: active ? 'rgba(0,229,255,0.1)' : 'transparent',
                  border: active ? '1px solid rgba(0,229,255,0.2)' : '1px solid transparent',
                  color: active ? '#00e5ff' : '#7aa3bc',
                }}
              >
                {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r" style={{ background: '#00e5ff' }} />}
                <Icon size={16} className="transition-colors group-hover:text-cyan-400" />
                <span className="text-sm font-display font-semibold tracking-wide group-hover:text-cyan-400 transition-colors" style={{ letterSpacing: '0.05em' }}>
                  {label}
                </span>
                {badge && (
                  <span className="ml-auto text-xs px-1.5 py-0.5 rounded font-bold font-mono-custom"
                    style={{
                      background: badge === 'LIVE' ? 'rgba(59,255,138,0.15)' : 'rgba(255,59,59,0.2)',
                      color: badge === 'LIVE' ? '#3bff8a' : '#ff3b3b',
                      fontSize: '9px',
                      border: `1px solid ${badge === 'LIVE' ? 'rgba(59,255,138,0.3)' : 'rgba(255,59,59,0.3)'}`,
                      animation: badge === 'LIVE' ? 'blink 2s ease infinite' : 'none'
                    }}>
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t" style={{ borderColor: '#1a3a52' }}>
          <Link to="/settings" className="flex items-center gap-3 px-3 py-2 rounded transition-colors" style={{ color: '#7aa3bc' }}>
            <Settings size={16} />
            <span className="text-sm font-display font-semibold" style={{ letterSpacing: '0.05em' }}>Settings</span>
          </Link>
          <div className="mt-2 px-3 py-2 rounded" style={{ background: 'rgba(255,59,59,0.05)', border: '1px solid rgba(255,59,59,0.15)' }}>
            <div className="text-xs font-bold font-display" style={{ color: '#ff3b3b', letterSpacing: '0.1em' }}>EMERGENCY</div>
            <div className="text-xs mt-0.5" style={{ color: '#7aa3bc' }}>NDRF Hotline: 1078</div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
