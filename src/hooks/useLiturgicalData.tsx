
import { useState, useEffect } from 'react';
import { fetchLiturgicalData, LiturgicalData } from '../services/liturgicalService';

export const useLiturgicalData = (date: Date) => {
  const [data, setData] = useState<LiturgicalData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getLiturgicalData = async () => {
      try {
        setLoading(true);
        const liturgicalData = await fetchLiturgicalData(date);
        setData(liturgicalData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        console.error('Error fetching liturgical data:', err);
      } finally {
        setLoading(false);
      }
    };

    getLiturgicalData();
  }, [date]);

  return { data, loading, error };
};
