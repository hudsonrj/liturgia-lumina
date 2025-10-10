import { formatDateToBrazilian } from '../utils/dateUtils';

// Types for liturgical data
export type LiturgyColor = 'Branco' | 'Verde' | 'Vermelho' | 'Roxo' | 'Rosa';

export interface Prayer {
  titulo?: string;
  texto: string;
}

export interface Reading {
  referencia: string;
  titulo: string;
  texto: string;
}

export interface PsalmReading {
  referencia: string;
  refrao: string;
  texto: string;
}

export interface ExtraReading {
  tipo?: string;
  titulo?: string;
  referencia?: string;
  texto: string;
}

export interface LiturgicalData {
  data: string;
  liturgia: string;
  cor: LiturgyColor;
  oracoes: {
    coleta: string;
    oferendas: string;
    comunhao: string;
    extras: Prayer[];
  };
  leituras: {
    primeiraLeitura: Reading[];
    salmo: PsalmReading[];
    segundaLeitura?: Reading[];
    evangelho: Reading[];
    extras: ExtraReading[];
  };
  antifonas: {
    entrada: string;
    comunhao: string;
  };
  saints?: string[];
}

// Mock data for saints when not provided by the API
const mockSaints: Record<string, string[]> = {
  '19/04': ['São Expedito', 'Santa Ema'],
  '20/04': ['Santa Inês de Montepulciano', 'Santa Sara'],
  '21/04': ['Santo Anselmo', 'São Conrado de Parzham'],
  '22/04': ['São Sotero', 'São Caio'],
  '23/04': ['São Jorge', 'São Adalberto'],
  '24/04': ['São Fidélis de Sigmaringa', 'Santa Maria Eufrásia Pelletier'],
  '25/04': ['São Marcos Evangelista'],
};

// Mock data for fallback
const mockLiturgicalData: LiturgicalData = {
  data: '',
  liturgia: 'Domingo',
  cor: 'Verde',
  oracoes: {
    coleta: 'Oração da Coleta',
    oferendas: 'Oração das Oferendas',
    comunhao: 'Oração da Comunhão',
    extras: []
  },
  leituras: {
    primeiraLeitura: [],
    salmo: [],
    evangelho: [],
    extras: []
  },
  antifonas: {
    entrada: 'Antífona de Entrada',
    comunhao: 'Antífona da Comunhão'
  }
};

// Cache management
const CACHE_PREFIX = 'liturgy_cache_';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const CACHE_CLEANUP_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

interface CacheEntry {
  data: LiturgicalData;
  timestamp: number;
}

// Clean up old cache entries periodically
const cleanupCache = () => {
  try {
    const now = Date.now();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(CACHE_PREFIX)) {
        const entry = localStorage.getItem(key);
        if (entry) {
          const { timestamp }: CacheEntry = JSON.parse(entry);
          if (now - timestamp > CACHE_CLEANUP_INTERVAL) {
            localStorage.removeItem(key);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error cleaning up cache:', error);
  }
};

// Run cleanup once per day
const lastCleanup = localStorage.getItem('last_cache_cleanup');
if (!lastCleanup || Date.now() - parseInt(lastCleanup) > 24 * 60 * 60 * 1000) {
  cleanupCache();
  localStorage.setItem('last_cache_cleanup', Date.now().toString());
}

const getCacheKey = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${CACHE_PREFIX}${day}_${month}_${year}`;
};

const getFromCache = (date: Date): LiturgicalData | null => {
  try {
    const cacheKey = getCacheKey(date);
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) return null;
    
    const { data, timestamp }: CacheEntry = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is still valid (less than 24 hours old)
    if (now - timestamp > CACHE_DURATION) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
};

const saveToCache = (date: Date, data: LiturgicalData): void => {
  try {
    const cacheKey = getCacheKey(date);
    const cacheEntry: CacheEntry = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
  } catch (error) {
    console.error('Error saving to cache:', error);
  }
};

// Fetch liturgical data from the API with retry mechanism and caching
export const fetchLiturgicalData = async (date: Date, retries = 3): Promise<LiturgicalData> => {
  // Try to get from cache first
  const cachedData = getFromCache(date);
  if (cachedData) {
    return cachedData;
  }

  try {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    const response = await fetch(`https://liturgia.up.railway.app/v2/?dia=${day}&mes=${month}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch liturgical data');
    }
    
    const data = await response.json();
    
    // Add mock saints data if not provided by API
    const formattedDate = formatDateToBrazilian(date);
    if (!data.saints && mockSaints[formattedDate]) {
      data.saints = mockSaints[formattedDate];
    }
    
    // Save successful response to cache
    saveToCache(date, data);
    
    return data;
  } catch (error) {
    // Retry logic with exponential backoff
    if (retries > 0) {
      const delay = Math.pow(2, 3 - retries) * 1000; // 1s, 2s, 4s
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchLiturgicalData(date, retries - 1);
    }
    
    // Fallback to mock data
    const mockData = { ...mockLiturgicalData };
    mockData.data = formatDateToBrazilian(date);
    
    // Add mock saints if available
    const formattedDate = formatDateToBrazilian(date);
    if (mockSaints[formattedDate]) {
      mockData.saints = mockSaints[formattedDate];
    }
    
    return mockData;
  }
};

// Function to get liturgy color class based on the color name
export const getLiturgyColorClass = (color: LiturgyColor): string => {
  switch (color) {
    case 'Branco':
      return 'bg-white text-gray-800 border border-gray-200';
    case 'Verde':
      return 'bg-liturgy-green text-white';
    case 'Vermelho':
      return 'bg-red-700 text-white';
    case 'Roxo':
      return 'bg-liturgy-purple text-white';
    case 'Rosa':
      return 'bg-pink-300 text-gray-800';
    default:
      return 'bg-liturgy-gold text-white';
  }
};
