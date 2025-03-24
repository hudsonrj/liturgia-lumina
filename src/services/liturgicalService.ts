
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

// Fetch liturgical data from the API
export const fetchLiturgicalData = async (date: Date): Promise<LiturgicalData> => {
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
    
    return data;
  } catch (error) {
    console.error('Error fetching liturgical data:', error);
    throw error;
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
