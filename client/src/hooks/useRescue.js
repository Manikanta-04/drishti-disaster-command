import { useState, useEffect, useCallback } from 'react';
import { rescueAPI } from '../services/api';
import { connectSocket } from '../services/socketService';

export const useRescue = () => {
  const [teams, setTeams] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);
      const [teamsRes, statsRes] = await Promise.all([
        rescueAPI.getAll(),
        rescueAPI.getStats(),
      ]);
      setTeams(teamsRes.data.teams);
      setStats(statsRes.data.stats);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeams();

    const socket = connectSocket();

    socket.on('team:updated', (updated) => {
      setTeams(prev => prev.map(t => t._id === updated._id ? updated : t));
    });

    socket.on('team:deployed', (team) => {
      setTeams(prev => prev.map(t => t._id === team._id ? team : t));
    });

    socket.on('team:location:update', (data) => {
      setTeams(prev => prev.map(t =>
        t._id === data.teamId
          ? { ...t, currentLocation: { ...t.currentLocation, coordinates: data.coordinates } }
          : t
      ));
    });

    return () => {
      socket.off('team:updated');
      socket.off('team:deployed');
      socket.off('team:location:update');
    };
  }, [fetchTeams]);

  const updateTeam = async (id, data) => {
    try {
      const res = await rescueAPI.update(id, data);
      setTeams(prev => prev.map(t => t._id === id ? res.data.team : t));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    }
  };

  return { teams, stats, loading, error, fetchTeams, updateTeam };
};
