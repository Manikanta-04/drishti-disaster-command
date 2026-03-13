import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield } from 'lucide-react';
import NotificationCenter from '../notifications/NotificationCenter';

const navLinks = [
  { path: '/',          label: 'Home'      },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/map',       label: 'Map'       },
  { path: '/alerts',    label: 'Alerts'    },
  { path: '/rescue',    label: 'Rescue'    },
  { path: '/resources', label: 'Resources' },
  { path: '/reports',   label: 'Reports'   },
];

const Navbar = ({ onMenuToggle, sidebarOpen }) => {
  const location = useLocation();
  const [time, setTime]     = useState(new Date());
  const [ticker, setTicker] = useState(0);

  const tickers = [
    '🚨 CYCLONE MOCHA: CAT 3 — ODISHA COAST',
    '⚠️ FLOOD ALERT: KOTTAYAM DISTRICT',
    '⚡ EARTHQUAKE M4.2 — UTTARAKHAND',
    '🔥 HEATWAVE ADVISORY — RAJASTHAN',
  ];

  useEffect(() => {
    const t1 = setInterval(() => setTime(new Date()), 1000);
    const t2 = setInterval(() => setTicker(p => (p + 1) % tickers.length), 4000);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50"
      style={{ background: 'rgba(5,10,14,0.97)', borderBottom: '1px solid #1a3a52', backdropFilter: 'blur(12px)' }}>

      {/* Alert ticker */}
      <div className="flex items-center gap-3 px-4 py-1 overflow-hidden"
        style={{ background: 'rgba(255,59,59,0.08)', borderBottom: '1px solid rgba(255,59,59,0.15)' }}>
        <span className="text-xs font-bold font-mono-custom flex-shrink-0 animate-blink" style={{ color: '#ff3b3b' }}>
          ● LIVE
        </span>
        <span className="text-xs font-mono-custom" style={{ color: '#ffcb3b', letterSpacing: '0.03em' }}>
          {tickers[ticker]}
        </span>
        <span className="ml-auto text-xs font-mono-custom flex-shrink-0" style={{ color: '#7aa3bc' }}>
          {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      </div>

      {/* Main nav */}
      <div className="flex items-center gap-4 px-4 py-2.5">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 rounded flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #ff3b3b, #ff7b3b)' }}>
            <Shield size={14} color="white" />
          </div>
          <div>
            <div className="font-display font-black text-sm leading-none" style={{ color: '#e8f4f8', letterSpacing: '0.1em' }}>DRISHTI</div>
            <div className="font-mono-custom text-xs leading-none" style={{ color: '#00e5ff', letterSpacing: '0.08em', fontSize: '8px' }}>DISASTER COMMAND</div>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-1 ml-4">
          {navLinks.map(link => {
            const active = location.pathname === link.path;
            return (
              <Link key={link.path} to={link.path}
                className="px-3 py-1.5 rounded text-xs font-display font-semibold transition-all"
                style={{
                  background: active ? 'rgba(0,229,255,0.1)' : 'transparent',
                  color: active ? '#00e5ff' : '#7aa3bc',
                  border: `1px solid ${active ? 'rgba(0,229,255,0.25)' : 'transparent'}`,
                  letterSpacing: '0.05em',
                }}>
                {link.label.toUpperCase()}
              </Link>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Notification Center (Phase 5) */}
          <NotificationCenter />

          {/* Status badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded"
            style={{ background: 'rgba(59,255,138,0.08)', border: '1px solid rgba(59,255,138,0.2)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-blink" style={{ background: '#3bff8a' }} />
            <span className="text-xs font-mono-custom" style={{ color: '#3bff8a', letterSpacing: '0.05em' }}>SYSTEMS ONLINE</span>
          </div>

          {/* Mobile menu */}
          <button onClick={onMenuToggle} className="lg:hidden p-2 rounded" style={{ color: '#7aa3bc' }}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
