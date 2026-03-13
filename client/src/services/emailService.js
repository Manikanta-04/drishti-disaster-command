// EmailJS Service — send real emails FREE (200/month)
// ─────────────────────────────────────────────────────────
// SETUP (one-time):
// 1. https://www.emailjs.com → Sign up free
// 2. Email Services → Add Service → choose Gmail
// 3. Email Templates → Create Template, use these variables:
//      {{to_email}} {{alert_title}} {{alert_message}}
//      {{severity}} {{location}} {{timestamp}} {{severity_emoji}}
// 4. Account → API Keys → copy Public Key
// 5. Add to client/.env:
//      VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
//      VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
//      VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
// ─────────────────────────────────────────────────────────

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const isConfigured = () => !!(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

// Send a single alert email
export const sendAlertEmail = async ({ to_email, title, message, severity, location }) => {
  if (!isConfigured()) {
    console.warn('EmailJS not configured — add keys to client/.env');
    return { success: false, reason: 'not_configured' };
  }
  try {
    // Dynamic import — only loads if configured
    const emailjs = await import('@emailjs/browser');

    const params = {
      to_email,
      alert_title:    title,
      alert_message:  message,
      severity:       severity?.toUpperCase() || 'HIGH',
      location:       location || 'Unknown',
      timestamp:      new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      severity_emoji: { critical: '🚨', high: '⚠️', medium: '⚡', low: '📢' }[severity] || '📢',
    };

    const result = await emailjs.default.send(SERVICE_ID, TEMPLATE_ID, params, PUBLIC_KEY);
    console.log('✅ Email sent:', result.status);
    return { success: true };
  } catch (err) {
    console.error('EmailJS error:', err);
    return { success: false, reason: err.text || err.message };
  }
};

// Broadcast to multiple recipients
export const broadcastEmail = async (alert, recipients = []) => {
  if (!isConfigured() || recipients.length === 0) return { sent: 0 };
  const results = await Promise.allSettled(
    recipients.map(email =>
      sendAlertEmail({
        to_email: email,
        title:    alert.title,
        message:  alert.message,
        severity: alert.severity,
        location: alert.location?.name,
      })
    )
  );
  const sent = results.filter(r => r.value?.success).length;
  return { sent, total: recipients.length };
};
