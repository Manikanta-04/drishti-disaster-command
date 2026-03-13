import { useState, useEffect, useCallback } from 'react';
import { disasterAPI } from '../services/api';
import { connectSocket } from '../services/socketService';

export const useDisasters = () => {
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const fetchDisasters = useCallback(async () => {
    try {
      setLoading(true);
      const [activeRes, statsRes] = await Promise.all([
        disasterAPI.getActive(),
        disasterAPI.getStats(),
      ]);
      setDisasters(activeRes.data.disasters);
      setStats(statsRes.data.stats);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch disasters');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDisasters();

    // Socket.io live updates
    const socket = connectSocket();

    socket.on('disaster:new', (disaster) => {
      setDisasters(prev => [disaster, ...prev]);
    });

    socket.on('disaster:updated', (updated) => {
      setDisasters(prev => prev.map(d => d._id === updated._id ? updated : d));
    });

    return () => {
      socket.off('disaster:new');
      socket.off('disaster:updated');
    };
  }, [fetchDisasters]);

  return { disasters, loading, error, stats, refetch: fetchDisasters };
};
