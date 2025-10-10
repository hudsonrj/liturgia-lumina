import { API_CONFIG } from '@/config/api';

const GOOGLE_TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';

interface TranslationResponse {
  data: {
    translations: Array<{
      translatedText: string;
      detectedSourceLanguage?: string;
    }>;
  };
}

export const translateText = async (
  text: string,
  targetLanguage: string,
  sourceLanguage?: string
): Promise<string> => {
  try {
    if (!API_CONFIG.GOOGLE_TRANSLATE_API_KEY) {
      throw new Error('Chave da API do Google Translate não configurada');
    }

    const response = await fetch(`${GOOGLE_TRANSLATE_API_URL}?key=${API_CONFIG.GOOGLE_TRANSLATE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: targetLanguage,
        source: sourceLanguage,
        format: 'text'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Erro na tradução');
    }

    const data: TranslationResponse = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Erro na tradução:', error);
    throw error;
  }
};

// Cache para armazenar traduções já feitas
const translationCache = new Map<string, string>();

export const translateWithCache = async (
  text: string,
  targetLanguage: string,
  sourceLanguage?: string
): Promise<string> => {
  const cacheKey = `${text}-${targetLanguage}-${sourceLanguage || 'auto'}`;
  
  // Verifica se a tradução já está em cache
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    const translatedText = await translateText(text, targetLanguage, sourceLanguage);
    
    // Armazena no cache
    translationCache.set(cacheKey, translatedText);
    
    return translatedText;
  } catch (error) {
    console.error('Erro na tradução com cache:', error);
    throw error;
  }
}; 