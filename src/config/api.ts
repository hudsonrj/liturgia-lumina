export const API_CONFIG = {
  GROQ_API_KEY: import.meta.env.VITE_GROQ_API_KEY,
  GROQ_API_URL: 'https://api.groq.com/openai/v1',
  BIBLE_API_URL: 'https://raw.githubusercontent.com/wldeh/bible-api/main/bibles',
  BIBLE_VERSION: 'en-kjv',
  BIBLE_NAME: 'King James Version',
  GOOGLE_TRANSLATE_API_KEY: import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY,
  
  // Para obter suas chaves de API:
  // 1. API Groq: https://console.groq.com
  // 2. Google Translate: https://console.cloud.google.com/apis/credentials
  // Configure as chaves no arquivo .env:
  // VITE_GROQ_API_KEY=sua_chave_aqui
  // VITE_GOOGLE_TRANSLATE_API_KEY=sua_chave_aqui
}; 