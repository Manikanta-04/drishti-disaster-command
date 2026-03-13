import { useState } from 'react';
import { useAlerts } from '../hooks/useAlerts';
import Loader from '../components/common/Loader';
import { Bell, Send, X, Mail } from 'lucide-react';
import { sendAlertEmail, isConfigured } from '../services/emailService';
import toast from 'react-hot-toast';

const severityColor = {
  critical: { text: '#ff3b3b', border: 'rgba(255,59,59,0.3)',  bg: 'rgba(255,59,59,0.05)'  },
  high:     { text: '#ff7b3b', border: 'rgba(255,123,59,0.3)', bg: 'rgba(255,123,59,0.05)' },
  medium:   { text: '#ffcb3b', border: 'rgba(255,203,59,0.3)', bg: 'rgba(255,203,59,0.05)' },
  low:      { text: '#3bff8a', border: 'rgba(59,255,138,0.3)', bg: 'rgba(59,255,138,0.05)' },
};

const Alerts = () => {
  const { alerts, loading, createAlert } = useAlerts();
  const [filter, setFilter]     = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmit] = useState(false);
  const [notifyEmail, setEmail] = useState('');
  const [form, setForm]         = useState({
    title: '', message: '', type: 'flood', severity: 'high',
    location: { name: '', state: '' },
  });

  const filtered = filter === 'all' ? alerts : alerts.filter(a => a.severity === filter);

  const handleSubmit = async () => {
    if (!form.title || !form.message) return toast.error('Title and message are required');
    setSubmit(true);
    try {
      // 1. Create alert in DB
      const result = await createAlert(form);
      if (!result.success) { toast.error(result.message || 'Failed to create alert'); return; }
      toast.success('✅ Alert created & broadcast via Socket.io');

      // 2. Send email if address given and EmailJS configured
      if (notifyEmail && isConfigured()) {
        const emailResult = await sendAlertEmail({
          to_email: notifyEmail,
          title:    form.title,
          message:  form.message,
          severity: form.severity,
          location: form.location.name,
        });
        if (emailResult.success) toast.success('📧 Email alert sent!');
        else toast(`📧 Email skipped: ${emailResult.reason}`, { icon: '⚠️' });
      } else if (notifyEmail && !isConfigured()) {
        toast('📧 EmailJS not configured in .env — skipped', { icon: 'ℹ️' });
      }

      setShowForm(false);
      setForm({ title:'', message:'', type:'flood', severity:'high', location:{ name:'', state:'' } });
      setEmail('');
    } finally {
      setSubmit(false);
    }
  };

  const inputStyle = {
    width:'100%', background:'#0a1628', border:'1px solid #1a3a52', borderRadius:'6px',
    padding:'8px 12px', color:'#e8f4f8', fontSize:'13px', outline:'none',
    fontFamily:'Exo 2, sans-serif',
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Bell size={18} style={{ color:'#ff3b3b' }} />
          <h1 className="font-display font-bold text-xl" style={{ color:'#e8f4f8', letterSpacing:'0.05em' }}>ALERT CENTER</h1>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded font-display font-bold text-xs transition-all hover:scale-105"
          style={{ background:'#ff3b3b', color:'white', letterSpacing:'0.05em' }}>
          <Send size={14} /> CREATE ALERT
        </button>
      </div>

      {/* Severity stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {['critical','high','medium','low'].map(s => {
          const c = severityColor[s];
          return (
            <div key={s} className="card p-3 text-center">
              <div className="font-display font-bold text-2xl" style={{ color: c.text }}>{loading ? '...' : alerts.filter(a=>a.severity===s).length}</div>
              <div className="text-xs capitalize" style={{ color:'#7aa3bc' }}>{s} Alerts</div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all','critical','high','medium','low'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="text-xs px-3 py-1.5 rounded font-display font-semibold transition-all"
            style={{
              background: filter===f ? 'rgba(0,229,255,0.1)' : 'transparent',
              color: filter===f ? '#00e5ff' : '#7aa3bc',
              border: `1px solid ${filter===f ? 'rgba(0,229,255,0.3)' : '#1a3a52'}`,
              letterSpacing:'0.05em',
            }}>
            {f.toUpperCase()} {f !== 'all' && `(${alerts.filter(a=>a.severity===f).length})`}
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="card p-4">
        {loading ? <Loader text="Loading alerts" /> : (
          <div className="space-y-2">
            {filtered.length === 0
              ? <div className="text-center py-8" style={{ color:'#7aa3bc' }}>No alerts found</div>
              : filtered.map((alert, i) => {
                const s = severityColor[alert.severity] || severityColor.medium;
                return (
                  <div key={alert._id} className="p-3 rounded animate-slide-up"
                    style={{ background:s.bg, border:`1px solid ${s.border}`, animationDelay:`${i*40}ms`, animationFillMode:'both' }}>
                    <div className="flex items-start gap-3">
                      <Bell size={14} style={{ color:s.text, flexShrink:0, marginTop:2 }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-display font-bold text-sm" style={{ color:'#e8f4f8' }}>{alert.title}</span>
                          {alert.isActive && <span className="w-1.5 h-1.5 rounded-full animate-blink flex-shrink-0" style={{ background:s.text }} />}
                        </div>
                        <p className="text-xs mb-1.5" style={{ color:'#7aa3bc', lineHeight:1.5 }}>{alert.message}</p>
                        <div className="flex items-center gap-3 text-xs" style={{ color:'#3d6477' }}>
                          <span>📍 {alert.location?.name}</span>
                          <span>🕐 {new Date(alert.createdAt).toLocaleString('en-IN', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })}</span>
                        </div>
                      </div>
                      <span className="font-mono-custom flex-shrink-0"
                        style={{ color:s.text, fontSize:'9px', padding:'2px 6px', borderRadius:'3px', background:s.bg, border:`1px solid ${s.border}` }}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })
            }
          </div>
        )}
      </div>

      {/* Create Alert Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:'rgba(0,0,0,0.85)' }}>
          <div className="w-full max-w-lg rounded-xl p-6 space-y-4" style={{ background:'#0a1628', border:'1px solid #1a3a52' }}>
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-lg" style={{ color:'#00e5ff', letterSpacing:'0.05em' }}>CREATE NEW ALERT</h2>
              <button onClick={() => setShowForm(false)} style={{ color:'#7aa3bc' }}><X size={20} /></button>
            </div>

            <div className="space-y-3">
              <input style={inputStyle} placeholder="Alert Title *" value={form.title}
                onChange={e => setForm(p=>({...p, title:e.target.value}))} />
              <textarea style={{ ...inputStyle, height:'80px', resize:'none' }}
                placeholder="Alert Message *" value={form.message}
                onChange={e => setForm(p=>({...p, message:e.target.value}))} />
              <div className="grid grid-cols-2 gap-3">
                <select style={inputStyle} value={form.type} onChange={e => setForm(p=>({...p, type:e.target.value}))}>
                  {['flood','cyclone','earthquake','heatwave','landslide','general'].map(t =>
                    <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>
                  )}
                </select>
                <select style={inputStyle} value={form.severity} onChange={e => setForm(p=>({...p, severity:e.target.value}))}>
                  {['low','medium','high','critical'].map(s =>
                    <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
                  )}
                </select>
              </div>
              <input style={inputStyle} placeholder="Location Name"
                value={form.location.name}
                onChange={e => setForm(p=>({...p, location:{...p.location, name:e.target.value}}))} />

              {/* Email notification field */}
              <div className="p-3 rounded" style={{ background:'rgba(0,229,255,0.04)', border:'1px solid rgba(0,229,255,0.15)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Mail size={13} style={{ color:'#00e5ff' }} />
                  <span className="text-xs font-display font-semibold" style={{ color:'#00e5ff', letterSpacing:'0.05em' }}>
                    EMAIL NOTIFICATION {isConfigured() ? '(EmailJS Ready ✅)' : '(Setup .env to enable)'}
                  </span>
                </div>
                <input style={inputStyle} placeholder="Send email to: officer@ndrf.gov.in (optional)"
                  value={notifyEmail} onChange={e => setEmail(e.target.value)} type="email" />
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button onClick={handleSubmit} disabled={submitting}
                className="flex-1 py-2.5 rounded font-display font-bold text-sm transition-all"
                style={{ background:'#ff3b3b', color:'white', opacity:submitting?0.7:1 }}>
                {submitting ? 'SENDING...' : '🚨 SEND ALERT'}
              </button>
              <button onClick={() => setShowForm(false)}
                className="px-4 py-2.5 rounded font-display font-bold text-sm"
                style={{ background:'transparent', color:'#7aa3bc', border:'1px solid #1a3a52' }}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;
