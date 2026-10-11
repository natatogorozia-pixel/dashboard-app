import { useState, useEffect } from 'react';
import { StatItem } from '../types/dashboard';
import { fetchDashboardStats } from '../services/statsService';

export const useStats = () => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchDashboardStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  return { stats, loading };
};