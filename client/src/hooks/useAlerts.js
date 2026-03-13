import { useState, useEffect, useCallback } from 'react';
import { alertAPI } from '../services/api';
import { connectSocket } from '../services/socketService';
import toast from 'react-hot-toast';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await alertAPI.getAll({ limit: 50 });
      setAlerts(res.data.alerts);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();

    const socket = connectSocket();

    // ✅ FIX: Add new alert directly to top of list immediately
    socket.on('alert:new', (alert) => {
      setAlerts(prev => {
        // Avoid duplicates
        if (prev.find(a => a._id === alert._id)) return prev;
        return [alert, ...prev];
      });
      const emoji = { critical: '🚨', high: '⚠️', medium: '⚡', low: '📢' }[alert.severity] || '📢';
      toast(`${emoji} ${alert.title}`, {
        duration: 6000,
        style: {
          background: '#0d1f35',
          color: '#e8f4f8',
          border: alert.severity === 'critical' ? '1px solid #ff3b3b' : '1px solid #1a3a52',
        },
      });
    });

    socket.on('alert:broadcast', (alert) => {
      setAlerts(prev => {
        if (prev.find(a => a._id === alert._id)) return prev;
        return [alert, ...prev];
      });
      toast.error(`📡 BROADCAST: ${alert.title}`, { duration: 8000 });
    });

    return () => {
      socket.off('alert:new');
      socket.off('alert:broadcast');
    };
  }, [fetchAlerts]);

  const createAlert = async (data) => {
    try {
      const res = await alertAPI.create(data);
      const newAlert = res.data.alert;
      // ✅ FIX: Also add directly to state (in case socket is slow)
      setAlerts(prev => {
        if (prev.find(a => a._id === newAlert._id)) return prev;
        return [newAlert, ...prev];
      });
      return { success: true, alert: newAlert };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to create alert' };
    }
  };

  const broadcastAlert = async (data) => {
    try {
      const res = await alertAPI.broadcast(data);
      return { success: true, alert: res.data.alert };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    }
  };

  return { alerts, loading, error, fetchAlerts, createAlert, broadcastAlert };
};
