import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchLiturgicalData, LiturgicalData } from '../services/liturgicalService';

export const useLiturgicalData = (date: Date) => {
  const [data, setData] = useState<LiturgicalData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const lastFetchRef = useRef<Date | null>(null);
  const isFetchingRef = useRef<boolean>(false);

  const getLiturgicalData = useCallback(async () => {
    // Evita chamadas simultâneas e desnecessárias
    if (isFetchingRef.current || 
        (lastFetchRef.current && 
         lastFetchRef.current.getDate() === date.getDate() && 
         lastFetchRef.current.getMonth() === date.getMonth() && 
         lastFetchRef.current.getFullYear() === date.getFullYear())) {
      return;
    }

    try {
      isFetchingRef.current = true;
      setLoading(true);
      const liturgicalData = await fetchLiturgicalData(date);
      setData(liturgicalData);
      setError(null);
      lastFetchRef.current = date;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error('Error fetching liturgical data:', err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [date]);

  useEffect(() => {
    getLiturgicalData();
  }, [getLiturgicalData]);

  return { data, loading, error };
};
