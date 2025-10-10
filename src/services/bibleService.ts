import { BibleBook, BibleChapter, BibleVerse } from '@/types/bible';
import { API_CONFIG } from '@/config/api';
import { toast } from 'react-hot-toast';
import { translateWithCache } from './translationService';

// Mapeamento de nomes de livros para seus identificadores na API
const BOOK_MAPPINGS: Record<string, string> = {
  'Gênesis': 'genesis',
  'Êxodo': 'exodus',
  'Levítico': 'leviticus',
  'Números': 'numbers',
  'Deuteronômio': 'deuteronomy',
  'Josué': 'joshua',
  'Juízes': 'judges',
  'Rute': 'ruth',
  '1 Samuel': '1samuel',
  '2 Samuel': '2samuel',
  '1 Reis': '1kings',
  '2 Reis': '2kings',
  '1 Crônicas': '1chronicles',
  '2 Crônicas': '2chronicles',
  'Esdras': 'ezra',
  'Neemias': 'nehemiah',
  'Ester': 'esther',
  'Jó': 'job',
  'Salmos': 'psalms',
  'Provérbios': 'proverbs',
  'Eclesiastes': 'ecclesiastes',
  'Cânticos': 'songofsolomon',
  'Isaías': 'isaiah',
  'Jeremias': 'jeremiah',
  'Lamentações': 'lamentations',
  'Ezequiel': 'ezekiel',
  'Daniel': 'daniel',
  'Oséias': 'hosea',
  'Joel': 'joel',
  'Amós': 'amos',
  'Obadias': 'obadiah',
  'Jonas': 'jonah',
  'Miquéias': 'micah',
  'Naum': 'nahum',
  'Habacuque': 'habakkuk',
  'Sofonias': 'zephaniah',
  'Ageu': 'haggai',
  'Zacarias': 'zechariah',
  'Malaquias': 'malachi',
  'Mateus': 'matthew',
  'Marcos': 'mark',
  'Lucas': 'luke',
  'João': 'john',
  'Atos': 'acts',
  'Romanos': 'romans',
  '1 Coríntios': '1corinthians',
  '2 Coríntios': '2corinthians',
  'Gálatas': 'galatians',
  'Efésios': 'ephesians',
  'Filipenses': 'philippians',
  'Colossenses': 'colossians',
  '1 Tessalonicenses': '1thessalonians',
  '2 Tessalonicenses': '2thessalonians',
  '1 Timóteo': '1timothy',
  '2 Timóteo': '2timothy',
  'Tito': 'titus',
  'Filemom': 'philemon',
  'Hebreus': 'hebrews',
  'Tiago': 'james',
  '1 Pedro': '1peter',
  '2 Pedro': '2peter',
  '1 João': '1john',
  '2 João': '2john',
  '3 João': '3john',
  'Judas': 'jude',
  'Apocalipse': 'revelation'
};

// Mapeamento de abreviações para nomes completos dos livros
const BOOK_ABBREVIATIONS: Record<string, string> = {
  'Gn': 'Gênesis',
  'Ex': 'Êxodo',
  'Lv': 'Levítico',
  'Nm': 'Números',
  'Dt': 'Deuteronômio',
  'Js': 'Josué',
  'Jz': 'Juízes',
  'Rt': 'Rute',
  '1Sm': '1 Samuel',
  '2Sm': '2 Samuel',
  '1Rs': '1 Reis',
  '2Rs': '2 Reis',
  '1Cr': '1 Crônicas',
  '2Cr': '2 Crônicas',
  'Ed': 'Esdras',
  'Ne': 'Neemias',
  'Et': 'Ester',
  'Jó': 'Jó',
  'Sl': 'Salmos',
  'Pr': 'Provérbios',
  'Ec': 'Eclesiastes',
  'Ct': 'Cânticos',
  'Is': 'Isaías',
  'Jr': 'Jeremias',
  'Lm': 'Lamentações',
  'Ez': 'Ezequiel',
  'Dn': 'Daniel',
  'Os': 'Oséias',
  'Jl': 'Joel',
  'Am': 'Amós',
  'Ob': 'Obadias',
  'Jn': 'Jonas',
  'Mq': 'Miquéias',
  'Na': 'Naum',
  'Hc': 'Habacuque',
  'Sf': 'Sofonias',
  'Ag': 'Ageu',
  'Zc': 'Zacarias',
  'Ml': 'Malaquias',
  'Mt': 'Mateus',
  'Mc': 'Marcos',
  'Lc': 'Lucas',
  'Jo': 'João',
  'At': 'Atos',
  'Rm': 'Romanos',
  '1Cor': '1 Coríntios',
  '2Cor': '2 Coríntios',
  'Gl': 'Gálatas',
  'Ef': 'Efésios',
  'Fp': 'Filipenses',
  'Cl': 'Colossenses',
  '1Ts': '1 Tessalonicenses',
  '2Ts': '2 Tessalonicenses',
  '1Tm': '1 Timóteo',
  '2Tm': '2 Timóteo',
  'Tt': 'Tito',
  'Fm': 'Filemom',
  'Hb': 'Hebreus',
  'Tg': 'Tiago',
  '1Pd': '1 Pedro',
  '2Pd': '2 Pedro',
  '1Jo': '1 João',
  '2Jo': '2 João',
  '3Jo': '3 João',
  'Jd': 'Judas',
  'Ap': 'Apocalipse'
};

// Dados dos livros da Bíblia com número de capítulos
const BIBLE_BOOKS: BibleBook[] = [
  { name: 'Gênesis', chapters: 50, testament: 'old' },
  { name: 'Êxodo', chapters: 40, testament: 'old' },
  { name: 'Levítico', chapters: 27, testament: 'old' },
  { name: 'Números', chapters: 36, testament: 'old' },
  { name: 'Deuteronômio', chapters: 34, testament: 'old' },
  { name: 'Josué', chapters: 24, testament: 'old' },
  { name: 'Juízes', chapters: 21, testament: 'old' },
  { name: 'Rute', chapters: 4, testament: 'old' },
  { name: '1 Samuel', chapters: 31, testament: 'old' },
  { name: '2 Samuel', chapters: 24, testament: 'old' },
  { name: '1 Reis', chapters: 22, testament: 'old' },
  { name: '2 Reis', chapters: 25, testament: 'old' },
  { name: '1 Crônicas', chapters: 29, testament: 'old' },
  { name: '2 Crônicas', chapters: 36, testament: 'old' },
  { name: 'Esdras', chapters: 10, testament: 'old' },
  { name: 'Neemias', chapters: 13, testament: 'old' },
  { name: 'Ester', chapters: 10, testament: 'old' },
  { name: 'Jó', chapters: 42, testament: 'old' },
  { name: 'Salmos', chapters: 150, testament: 'old' },
  { name: 'Provérbios', chapters: 31, testament: 'old' },
  { name: 'Eclesiastes', chapters: 12, testament: 'old' },
  { name: 'Cânticos', chapters: 8, testament: 'old' },
  { name: 'Isaías', chapters: 66, testament: 'old' },
  { name: 'Jeremias', chapters: 52, testament: 'old' },
  { name: 'Lamentações', chapters: 5, testament: 'old' },
  { name: 'Ezequiel', chapters: 48, testament: 'old' },
  { name: 'Daniel', chapters: 12, testament: 'old' },
  { name: 'Oséias', chapters: 14, testament: 'old' },
  { name: 'Joel', chapters: 3, testament: 'old' },
  { name: 'Amós', chapters: 9, testament: 'old' },
  { name: 'Obadias', chapters: 1, testament: 'old' },
  { name: 'Jonas', chapters: 4, testament: 'old' },
  { name: 'Miquéias', chapters: 7, testament: 'old' },
  { name: 'Naum', chapters: 3, testament: 'old' },
  { name: 'Habacuque', chapters: 3, testament: 'old' },
  { name: 'Sofonias', chapters: 3, testament: 'old' },
  { name: 'Ageu', chapters: 2, testament: 'old' },
  { name: 'Zacarias', chapters: 14, testament: 'old' },
  { name: 'Malaquias', chapters: 4, testament: 'old' },
  { name: 'Mateus', chapters: 28, testament: 'new' },
  { name: 'Marcos', chapters: 16, testament: 'new' },
  { name: 'Lucas', chapters: 24, testament: 'new' },
  { name: 'João', chapters: 21, testament: 'new' },
  { name: 'Atos', chapters: 28, testament: 'new' },
  { name: 'Romanos', chapters: 16, testament: 'new' },
  { name: '1 Coríntios', chapters: 16, testament: 'new' },
  { name: '2 Coríntios', chapters: 13, testament: 'new' },
  { name: 'Gálatas', chapters: 6, testament: 'new' },
  { name: 'Efésios', chapters: 6, testament: 'new' },
  { name: 'Filipenses', chapters: 4, testament: 'new' },
  { name: 'Colossenses', chapters: 4, testament: 'new' },
  { name: '1 Tessalonicenses', chapters: 5, testament: 'new' },
  { name: '2 Tessalonicenses', chapters: 3, testament: 'new' },
  { name: '1 Timóteo', chapters: 6, testament: 'new' },
  { name: '2 Timóteo', chapters: 4, testament: 'new' },
  { name: 'Tito', chapters: 3, testament: 'new' },
  { name: 'Filemom', chapters: 1, testament: 'new' },
  { name: 'Hebreus', chapters: 13, testament: 'new' },
  { name: 'Tiago', chapters: 5, testament: 'new' },
  { name: '1 Pedro', chapters: 5, testament: 'new' },
  { name: '2 Pedro', chapters: 3, testament: 'new' },
  { name: '1 João', chapters: 5, testament: 'new' },
  { name: '2 João', chapters: 1, testament: 'new' },
  { name: '3 João', chapters: 1, testament: 'new' },
  { name: 'Judas', chapters: 1, testament: 'new' },
  { name: 'Apocalipse', chapters: 22, testament: 'new' },
];

const CACHE_PREFIX = 'bible_cache_';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 dias em milissegundos

interface CacheEntry {
  data: any;
  timestamp: number;
}

const getFromCache = (key: string): any | null => {
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!cached) return null;

    const { data, timestamp }: CacheEntry = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao ler do cache:', error);
    return null;
  }
};

const saveToCache = (key: string, data: any): void => {
  try {
    const cacheEntry: CacheEntry = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(cacheEntry));
  } catch (error) {
    console.error('Erro ao salvar no cache:', error);
  }
};

const translateText = async (text: string): Promise<string> => {
  try {
    if (!API_CONFIG.GROQ_API_KEY) {
      toast.error('Chave da API Groq não configurada. Verifique o arquivo .env');
      return text;
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content: "Você é um tradutor especializado em textos bíblicos. Traduza o texto mantendo o significado teológico e o estilo literário original."
          },
          {
            role: "user",
            content: `Traduza este texto para o português: "${text}"`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erro na tradução:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(`Erro na tradução: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      console.error('Resposta da API sem texto traduzido:', data);
      throw new Error('Resposta da API inválida');
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Erro ao traduzir:', error);
    toast.error('Erro ao traduzir o texto. Por favor, tente novamente.');
    return text;
  }
};

const fetchFromAPI = async (bookId: string, chapter: number) => {
  try {
    const url = `${API_CONFIG.BIBLE_API_URL}/${API_CONFIG.BIBLE_VERSION}/books/${bookId}/chapters/${chapter}.json`;
    console.log('Fetching from URL:', url);
    
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Erro HTTP: ${response.status} - ${response.statusText}`);
      throw new Error('Erro ao carregar dados da Bíblia. Por favor, tente novamente.');
    }

    const data = await response.json();
    if (!data || !data.data) {
      throw new Error('Formato de dados inválido da API');
    }

    // Retorna os versículos diretamente sem tradução
    return {
      verses: data.data.reduce((acc: Record<string, string>, verse: any) => {
        acc[verse.verse] = verse.text;
        return acc;
      }, {})
    };
  } catch (error) {
    console.error(`Erro ao acessar a API:`, error);
    throw new Error('Erro ao carregar dados da Bíblia. Por favor, tente novamente.');
  }
};

export const fetchBibleBooks = async (): Promise<BibleBook[]> => {
  const cached = getFromCache('books');
  if (cached) return cached;

  // Como temos os dados dos livros estaticamente, não precisamos fazer requisição
  saveToCache('books', BIBLE_BOOKS);
  return BIBLE_BOOKS;
};

export const fetchBibleChapter = async (book: string, chapter: number): Promise<BibleChapter> => {
  const cacheKey = `${book}_${chapter}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const bookId = BOOK_MAPPINGS[book];
    if (!bookId) {
      throw new Error(`Livro não encontrado: ${book}`);
    }

    const chapterData = await fetchFromAPI(bookId, chapter);
    
    // Adapta o formato da resposta para nosso formato
    const adaptedChapter: BibleChapter = {
      book,
      chapter,
      verses: Object.entries(chapterData.verses).map(([number, text]) => ({
        book,
        chapter,
        verse: parseInt(number),
        number: parseInt(number),
        text: text as string
      }))
    };

    saveToCache(cacheKey, adaptedChapter);
    return adaptedChapter;
  } catch (error) {
    console.error('Erro ao buscar capítulo:', error);
    throw error;
  }
};

export const getOriginalLanguage = async (book: string): Promise<string> => {
  if (!API_CONFIG.GROQ_API_KEY) {
    console.warn('API Groq não configurada');
    return 'grc'; // Retorna grego como padrão
  }

  try {
    const prompt = `Determine a língua original do livro "${book}" da Bíblia.
    Responda APENAS com "grc" para grego koiné ou "heb" para hebraico bíblico.
    Não inclua explicações adicionais.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em línguas bíblicas. Responda apenas com o código da língua solicitada.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 10,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      throw new Error('Erro ao determinar língua original');
    }

    const data = await response.json();
    const language = data.choices[0]?.message?.content?.trim().toLowerCase();

    return language === 'heb' ? 'heb' : 'grc';
  } catch (error) {
    console.error('Erro ao determinar língua original:', error);
    return 'grc';
  }
};

export const translateBibleText = async (
  text: string,
  targetLanguage: string,
  bookName: string
): Promise<string> => {
  try {
    if (!API_CONFIG.GROQ_API_KEY) {
      console.error('Chave da API Groq não configurada. Configure a chave no arquivo .env');
      toast.error('Serviço de tradução indisponível. Configure a chave da API no arquivo .env');
      return text;
    }

    // Se for o texto original, retorna sem tradução
    if (targetLanguage === 'original') {
      return text;
    }

    // Mapeamento de códigos de idioma para nomes completos
    const languageNames: Record<string, string> = {
      'pt': 'português brasileiro',
      'de': 'alemão',
      'grc': 'grego koiné',
      'heb': 'hebraico bíblico'
    };

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `Você é um tradutor especializado em textos bíblicos. Traduza o texto mantendo o significado teológico e o estilo literário original. Responda APENAS com o texto traduzido, sem explicações adicionais.`
          },
          {
            role: "user",
            content: `Traduza este texto bíblico do livro ${bookName} para ${languageNames[targetLanguage] || targetLanguage}. Responda APENAS com o texto traduzido:\n\n"${text}"`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erro na API:', errorData);
      throw new Error('Erro ao comunicar com a API');
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Resposta inválida da API');
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Erro na tradução:', error);
    throw error;
  }
};

export const getVerseExplanation = async (verse: BibleVerse): Promise<string> => {
  try {
    if (!API_CONFIG.GROQ_API_KEY) {
      console.error('Chave da API Groq não configurada. Configure a chave no arquivo .env');
      toast.error('Serviço de análise indisponível. Configure a chave da API no arquivo .env');
      return 'Serviço indisponível. Configure a chave da API no arquivo .env';
    }

    let prompt = '';
    switch (verse.analysisType) {
      case 'OR':
        prompt = `Analise o texto bíblico "${verse.text}" do livro ${verse.book} e forneça em português:
1. A língua original em que foi escrito
2. Uma tradução literal palavra por palavra
3. Uma explicação do significado de palavras-chave no idioma original
4. Uma tradução fluente que capture o significado completo

Importante: Sua resposta deve ser COMPLETAMENTE em português, incluindo todas as explicações e análises.`;
        break;
      case 'HI':
        prompt = `Forneça em português o contexto histórico detalhado do texto "${verse.text}" do livro ${verse.book}, incluindo:
1. Período histórico
2. Contexto cultural
3. Eventos importantes relacionados
4. Costumes e práticas da época

Importante: Sua resposta deve ser COMPLETAMENTE em português, usando termos e expressões comuns no Brasil.`;
        break;
      case 'EX':
        prompt = `Faça uma análise teológica em português do texto "${verse.text}" do livro ${verse.book}, incluindo:
1. Principais temas teológicos
2. Interpretação no contexto do livro
3. Significado para a fé
4. Aplicações práticas

Importante: Use linguagem teológica em português, adequada para o contexto brasileiro.`;
        break;
      case 'JS':
        prompt = `Explique em português as conexões do texto "${verse.text}" do livro ${verse.book} com Jesus Cristo:
1. Profecias (se aplicável)
2. Tipologia e simbolismo
3. Temas que apontam para Cristo
4. Cumprimento em Jesus

Importante: Use termos e explicações compreensíveis para o público brasileiro.`;
        break;
      case 'BL':
        prompt = `Identifique e explique em português as referências e conexões bíblicas do texto "${verse.text}" do livro ${verse.book}:
1. Versículos relacionados
2. Temas paralelos
3. Citações em outros livros
4. Conceitos teológicos comuns

Importante: Use os nomes dos livros bíblicos em português e cite os versículos no formato usado no Brasil.`;
        break;
      case 'AU':
        prompt = `Forneça em português informações sobre a autoria do texto "${verse.text}" do livro ${verse.book}:
1. Autor tradicional
2. Evidências históricas
3. Contexto da escrita
4. Estilo literário

Importante: Apresente as informações de forma clara e acessível para leitores brasileiros.`;
        break;
      case 'PG':
        prompt = `Gere em português uma homilia/palestra sobre o texto "${verse.text}" do livro ${verse.book}:
1. Introdução cativante
2. Três pontos principais para reflexão
3. Exemplos práticos do cotidiano brasileiro
4. Conclusão inspiradora com aplicação prática

Importante: Use linguagem pastoral adequada ao contexto brasileiro, com exemplos relevantes para nossa cultura.`;
        break;
      default:
        prompt = `Explique em português o significado do texto "${verse.text}" do livro ${verse.book}:
1. Contexto imediato
2. Significado teológico
3. Aplicação prática
4. Relevância atual

Importante: Use linguagem clara e acessível, adequada ao público brasileiro.`;
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "Você é um especialista brasileiro em estudos bíblicos, com profundo conhecimento em teologia, história, línguas originais e hermenêutica. Forneça análises detalhadas e bem estruturadas SEMPRE em português brasileiro, usando referências e exemplos relevantes para o contexto cultural brasileiro. Evite anglicismos e use a terminologia teológica comum nas igrejas brasileiras."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erro na API:', errorData);
      throw new Error('Erro ao comunicar com a API');
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Resposta inválida da API');
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Erro ao gerar explicação:', error);
    toast.error('Erro ao gerar análise. Por favor, tente novamente.');
    return 'Erro ao gerar análise. Por favor, tente novamente.';
  }
};

export const getLiteralTranslation = async (
  text: string,
  sourceLang: string,
  book: string
): Promise<string> => {
  try {
    if (!API_CONFIG.GROQ_API_KEY) {
      throw new Error('API Groq não configurada');
    }

    let actualSourceLang = sourceLang;
    if (sourceLang === 'original') {
      actualSourceLang = await getOriginalLanguage(book);
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "Você é um especialista em tradução bíblica e análise linguística."
          },
          {
            role: "user",
            content: `Forneça uma tradução literal palavra por palavra do seguinte texto do ${
              actualSourceLang === 'grc' ? 'grego koiné' :
              actualSourceLang === 'heb' ? 'hebraico bíblico' :
              actualSourceLang === 'de' ? 'alemão' : 'inglês'
            } para português brasileiro:

            "${text}"

            Por favor:
            1. Mostre cada palavra original seguida de sua tradução literal entre parênteses
            2. Depois forneça uma tradução fluida que mantenha o sentido original
            3. Explique brevemente as principais diferenças gramaticais ou idiomáticas`
          }
        ],
        temperature: 0.3,
        max_tokens: 1024,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erro na API:', errorData);
      throw new Error('Erro ao comunicar com a API');
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Resposta inválida da API');
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Erro na tradução literal:', error);
    throw error;
  }
};

export const generateSpeech = async (verse: BibleVerse): Promise<string> => {
  try {
    if (!API_CONFIG.GROQ_API_KEY) {
      throw new Error('API Groq não configurada');
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "Você é um especialista em estudos bíblicos e oratória, capaz de criar palestras envolventes e profundas em português."
          },
          {
            role: "user",
            content: `Gere uma palestra envolvente e informativa sobre o seguinte versículo bíblico:
    
            Livro: ${verse.book}
            Capítulo: ${verse.chapter}
            Versículo: "${verse.text}"

            A palestra deve incluir:

            1. INTRODUÇÃO
            - Contexto histórico e cultural fascinante
            - Uma curiosidade surpreendente sobre o texto
            - Apresentação do tema principal

            2. DESENVOLVIMENTO (3 lições principais)
            - Primeira lição: [Extraia uma lição relevante com aplicação prática]
            - Segunda lição: [Identifique uma verdade profunda com exemplos]
            - Terceira lição: [Apresente um princípio transformador]

            3. FATOS INTERESSANTES
            - Conexões com outros textos bíblicos
            - Aspectos linguísticos ou culturais únicos
            - Descobertas arqueológicas ou históricas relacionadas
            - Impacto deste texto ao longo da história

            4. CONCLUSÃO
            - Resumo das principais lições
            - Aplicação prática para os dias atuais
            - Uma reflexão final inspiradora`
          }
        ],
        temperature: 0.7,
        max_tokens: 3072,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erro na API:', errorData);
      throw new Error('Erro ao comunicar com a API');
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Resposta inválida da API');
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Erro ao gerar palestra:', error);
    throw error;
  }
};

// Função para converter abreviação em nome completo do livro
export const getFullBookName = (abbreviation: string): string => {
  return BOOK_ABBREVIATIONS[abbreviation] || abbreviation;
}; 