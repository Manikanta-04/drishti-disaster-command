import { useState, useEffect, useRef } from 'react';
import { Bell, X, CheckCheck, Wifi, WifiOff, Smartphone } from 'lucide-react';
import { connectSocket } from '../../services/socketService';
import toast from 'react-hot-toast';

const severityColor = {
  critical: { text: '#ff3b3b', bg: 'rgba(255,59,59,0.06)', dot: '#ff3b3b' },
  high:     { text: '#ff7b3b', bg: 'rgba(255,123,59,0.06)', dot: '#ff7b3b' },
  medium:   { text: '#ffcb3b', bg: 'rgba(255,203,59,0.06)', dot: '#ffcb3b' },
  low:      { text: '#3bff8a', bg: 'rgba(59,255,138,0.06)', dot: '#3bff8a' },
};

const severityEmoji = { critical: '🚨', high: '⚠️', medium: '⚡', low: '📢' };

// Native browser push notification
const pushNotification = (title, body, severity = 'high') => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  new Notification(title, {
    body,
    icon: '/vite.svg',
    tag: `disaster-${Date.now()}`,
    requireInteraction: severity === 'critical',
  });
};

const NotificationCenter = () => {
  const [open, setOpen]             = useState(false);
  const [notifs, setNotifs]         = useState([]);
  const [pushEnabled, setPush]      = useState(Notification?.permission === 'granted');
  const ref = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  // Real-time socket alerts
  useEffect(() => {
    const socket = connectSocket();

    const addNotif = (data, type = 'alert') => {
      const notif = {
        id: data._id || Date.now(),
        title: type === 'disaster' ? `🆕 New: ${data.name}` : data.title,
        message: type === 'disaster'
          ? `${data.type} detected at ${data.location?.name} — ${data.severity} severity`
          : data.message,
        severity: data.severity,
        location: data.location?.name || '',
        time: new Date(),
        read: false,
        type,
      };
      setNotifs(prev => [notif, ...prev].slice(0, 50));

      // Push to OS notification tray
      if (Notification.permission === 'granted') {
        pushNotification(
          `${severityEmoji[data.severity] || '📢'} ${notif.title}`,
          `${notif.message}${notif.location ? `\n📍 ${notif.location}` : ''}`,
          data.severity
        );
      }
    };

    socket.on('alert:new',       (a) => addNotif(a, 'alert'));
    socket.on('alert:broadcast', (a) => addNotif(a, 'broadcast'));
    socket.on('disaster:new',    (d) => addNotif(d, 'disaster'));

    return () => {
      socket.off('alert:new');
      socket.off('alert:broadcast');
      socket.off('disaster:new');
    };
  }, []);

  const unread = notifs.filter(n => !n.read).length;

  const enablePush = async () => {
    if (!('Notification' in window)) return toast.error('Browser does not support notifications');
    const perm = await Notification.requestPermission();
    if (perm === 'granted') { setPush(true); toast.success('🔔 Push notifications enabled!'); }
    else toast.error('Permission denied. Check browser settings.');
  };

  const markAllRead = () => setNotifs(p => p.map(n => ({ ...n, read: true })));
  const markRead    = (id) => setNotifs(p => p.map(n => n.id === id ? { ...n, read: true } : n));
  const clear       = () => { setNotifs([]); setOpen(false); };

  return (
    <div className="relative" ref={ref}>
      {/* Bell icon */}
      <button onClick={() => setOpen(p => !p)}
        className="relative p-2 rounded transition-all hover:scale-105"
        style={{
          background: unread > 0 ? 'rgba(255,59,59,0.1)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${unread > 0 ? 'rgba(255,59,59,0.35)' : '#1a3a52'}`,
        }}>
        <Bell size={18} style={{ color: unread > 0 ? '#ff3b3b' : '#7aa3bc' }} />
        {unread > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center font-bold animate-blink"
            style={{ background: '#ff3b3b', color: 'white', fontSize: '9px' }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl overflow-hidden z-50 animate-slide-up"
          style={{ background: '#0a1628', border: '1px solid #1a3a52', boxShadow: '0 25px 60px rgba(0,0,0,0.6)' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #1a3a52' }}>
            <div className="flex items-center gap-2">
              <Bell size={14} style={{ color: '#00e5ff' }} />
              <span className="font-display font-bold text-sm" style={{ color: '#e8f4f8', letterSpacing: '0.05em' }}>NOTIFICATIONS</span>
              {unread > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded font-mono-custom animate-blink"
                  style={{ background: 'rgba(255,59,59,0.12)', color: '#ff3b3b', border: '1px solid rgba(255,59,59,0.3)' }}>
                  {unread} NEW
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button onClick={markAllRead} title="Mark all read"
                  className="p-1 rounded hover:bg-white/5 transition-all" style={{ color: '#7aa3bc' }}>
                  <CheckCheck size={13} />
                </button>
              )}
              <button onClick={clear} title="Clear all"
                className="p-1 rounded hover:bg-white/5 transition-all" style={{ color: '#7aa3bc' }}>
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Push notification bar */}
          <div className="px-4 py-2.5 flex items-center justify-between"
            style={{ borderBottom: '1px solid #1a3a52', background: 'rgba(0,0,0,0.25)' }}>
            <div className="flex items-center gap-2 text-xs" style={{ color: '#7aa3bc' }}>
              <Smartphone size={11} />
              <span>OS Push Notifications</span>
            </div>
            {pushEnabled ? (
              <div className="flex items-center gap-1.5 text-xs" style={{ color: '#3bff8a' }}>
                <Wifi size={10} />
                <span className="font-display font-semibold" style={{ letterSpacing: '0.05em' }}>ACTIVE</span>
              </div>
            ) : (
              <button onClick={enablePush}
                className="text-xs px-2.5 py-1 rounded font-display font-semibold transition-all hover:scale-105"
                style={{ background: 'rgba(0,229,255,0.1)', color: '#00e5ff', border: '1px solid rgba(0,229,255,0.3)' }}>
                ENABLE
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="overflow-y-auto" style={{ maxHeight: '380px' }}>
            {notifs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Bell size={28} style={{ color: '#1a3a52' }} />
                <div className="text-center">
                  <p className="text-xs font-display font-semibold" style={{ color: '#3d6477' }}>ALL CLEAR</p>
                  <p className="text-xs mt-1" style={{ color: '#3d6477' }}>Real-time alerts appear here</p>
                </div>
              </div>
            ) : notifs.map((n, i) => {
              const c = severityColor[n.severity] || severityColor.low;
              return (
                <div key={n.id} onClick={() => markRead(n.id)}
                  className="px-4 py-3 cursor-pointer transition-all hover:bg-white/[0.02] animate-slide-up"
                  style={{ borderBottom: '1px solid #0d1a28', background: n.read ? 'transparent' : c.bg, animationDelay: `${i * 30}ms`, animationFillMode: 'both' }}>
                  <div className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                      style={{ background: n.read ? '#1a3a52' : c.dot }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="font-display font-semibold text-xs truncate"
                          style={{ color: n.read ? '#7aa3bc' : '#e8f4f8' }}>
                          {n.title}
                        </span>
                        <span className="font-mono-custom px-1 rounded flex-shrink-0"
                          style={{ color: c.text, fontSize: '8px', background: `${c.text}15` }}>
                          {n.severity?.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: '#3d6477', lineHeight: 1.4 }}>{n.message}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs" style={{ color: '#3d6477' }}>
                        {n.location && <span>📍 {n.location}</span>}
                        <span>🕐 {new Date(n.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {notifs.length > 0 && (
            <div className="px-4 py-2 text-center" style={{ borderTop: '1px solid #1a3a52', background: 'rgba(0,0,0,0.2)' }}>
              <span className="text-xs font-mono-custom" style={{ color: '#3d6477' }}>
                {notifs.length} TOTAL • {unread} UNREAD • LIVE VIA SOCKET.IO
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
