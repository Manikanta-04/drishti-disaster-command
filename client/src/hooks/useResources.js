import { useState, useEffect, useCallback } from 'react';
import { resourceAPI } from '../services/api';

export const useResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      const res = await resourceAPI.getAll();
      setResources(res.data.resources);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const deployResource = async (id, quantity, disasterId) => {
    try {
      const res = await resourceAPI.deploy(id, { quantity, disasterId });
      setResources(prev => prev.map(r => r._id === id ? res.data.resource : r));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    }
  };

  return { resources, loading, error, fetchResources, deployResource };
};
