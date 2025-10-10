import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchBibleBooks, fetchBibleChapter, getVerseExplanation, translateBibleText, getLiteralTranslation, generateSpeech, getFullBookName } from '@/services/bibleService';
import type { BibleBook, BibleChapter, BibleVerse } from '@/types/bible';
import { ArrowLeft, Book, Languages, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { queryClient } from '@/lib/react-query';

type Language = {
  code: string;
  name: string;
  isOriginal?: boolean;
};

const AVAILABLE_LANGUAGES: Language[] = [
  { code: 'pt', name: 'Português' },
  { code: 'grc', name: 'Grego (Koiné)' },
  { code: 'heb', name: 'Hebraico (Bíblico)' },
  { code: 'de', name: 'Alemão' },
  { code: 'original', name: 'Texto Original', isOriginal: true }
];

type AnalysisType = 'OR' | 'HI' | 'EX' | 'JS' | 'BL' | 'AU' | 'PG';

interface AnalysisButton {
  type: AnalysisType;
  label: string;
  title: string;
}

const ANALYSIS_BUTTONS: AnalysisButton[] = [
  { type: 'OR', label: 'OR', title: 'Língua Original e Tradução Literal' },
  { type: 'HI', label: 'HI', title: 'Contexto Histórico' },
  { type: 'EX', label: 'EX', title: 'Explicação Teológica' },
  { type: 'JS', label: 'JS', title: 'Conexões com Jesus' },
  { type: 'BL', label: 'BL', title: 'Referências Bíblicas' },
  { type: 'AU', label: 'AU', title: 'Autoria' },
  { type: 'PG', label: 'PG', title: 'Gerar Palestra' }
];

export default function Bible() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [selectedVerse, setSelectedVerse] = useState<BibleVerse | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanation, setExplanation] = useState<string>('');
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('pt');
  const [isTranslating, setIsTranslating] = useState(false);
  const [verseTranslations, setVerseTranslations] = useState<Record<string, string>>({});
  const [translatingVerses, setTranslatingVerses] = useState<number[]>([]);
  const [literalTranslation, setLiteralTranslation] = useState<string>('');
  const [isLoadingLiteralTranslation, setIsLoadingLiteralTranslation] = useState(false);
  const [analysisType, setAnalysisType] = useState<AnalysisType | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [chapter, setChapter] = useState<BibleChapter | null>(null);
  const [touchedVerse, setTouchedVerse] = useState<number | null>(null);
  const [selectedVerses, setSelectedVerses] = useState<BibleVerse[]>([]);

  const {
    data: booksData = [],
    isLoading: isLoadingBooks,
    error: booksError
  } = useQuery({
    queryKey: ['bibleBooks'],
    queryFn: fetchBibleBooks,
    staleTime: Infinity
  });

  const {
    data: chapterData,
    isLoading: isLoadingChapter,
    error: chapterError,
    refetch: refetchChapter
  } = useQuery({
    queryKey: ['bibleChapter', selectedBook, selectedChapter],
    queryFn: () => fetchBibleChapter(selectedBook || '', selectedChapter || 1),
    enabled: !!selectedBook && !!selectedChapter,
    staleTime: Infinity,
    retry: 3
  });

  // Efeito para inicializar com os parâmetros da URL
  useEffect(() => {
    const book = searchParams.get('book');
    const chapter = searchParams.get('chapter');
    
    if (book) {
      // Converter abreviação para nome completo e encontrar o livro correspondente
      const fullBookName = getFullBookName(book);
      const normalizedBook = fullBookName.toLowerCase();
      const foundBook = booksData.find(b => 
        b.name.toLowerCase() === normalizedBook
      );
      
      if (foundBook) {
        setSelectedBook(foundBook.name);
        if (chapter) {
          const chapterNum = parseInt(chapter);
          if (!isNaN(chapterNum) && chapterNum > 0 && chapterNum <= foundBook.chapters) {
            setSelectedChapter(chapterNum);
          }
        }
      }
    }
  }, [searchParams, booksData]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const text = range.toString().trim();
    
    if (text) {
      // Encontrar o versículo selecionado
      const verseElement = range.startContainer.parentElement?.closest('[data-verse]');
      if (verseElement) {
        const verseData = JSON.parse(verseElement.getAttribute('data-verse') || '{}');
        setSelectedText(text);
        setSelectedVerse(verseData);
        setExplanation(''); // Limpa explicação anterior
      }
    }
  };

  const handleExplainVerse = async () => {
    if (!selectedVerse) return;
    
    try {
      setIsLoadingExplanation(true);
      const explanation = await getVerseExplanation(selectedVerse);
      setExplanation(explanation);
      setShowExplanation(true);
    } catch (error) {
      console.error('Erro ao buscar explicação:', error);
      setExplanation('Desculpe, não foi possível gerar a explicação neste momento. Por favor, tente novamente.');
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  const getVerseNumberFromSelection = (): number | null => {
    if (!selectedText || !chapter) return null;
    
    // Procura o versículo que contém o texto selecionado
    const verseIndex = chapter.verses.findIndex(verse => 
      verse.text.includes(selectedText)
    );
    
    return verseIndex !== -1 ? verseIndex + 1 : null;
  };

  const handleTranslate = async () => {
    if (!selectedVerses.length) {
      toast.error('Selecione pelo menos um versículo');
      return;
    }

    const versesToTranslate = selectedVerses.filter(
      verse => !verseTranslations[`${verse.number}-${selectedLanguage}`]
    );

    if (versesToTranslate.length === 0) {
      const langName = AVAILABLE_LANGUAGES.find(lang => lang.code === selectedLanguage)?.name;
      toast.success(`Versículos já traduzidos para ${langName}`);
      return;
    }

    setTranslatingVerses(versesToTranslate.map(v => v.number));
    setIsTranslating(true);
    
    try {
      const translations = await Promise.all(
        versesToTranslate.map(async (verse) => {
          const translatedText = await translateBibleText(
            verse.text,
            selectedLanguage,
            verse.book
          );
          return {
            verseNumber: verse.number,
            translation: translatedText
          };
        })
      );

      setVerseTranslations(prev => {
        const newTranslations = { ...prev };
        translations.forEach(({ verseNumber, translation }) => {
          newTranslations[`${verseNumber}-${selectedLanguage}`] = translation;
        });
        return newTranslations;
      });

      const langName = AVAILABLE_LANGUAGES.find(lang => lang.code === selectedLanguage)?.name;
      toast.success(`Tradução para ${langName} concluída`);
    } catch (error) {
      console.error('Erro na tradução:', error);
      toast.error('Erro ao traduzir o texto. Por favor, tente novamente.');
    } finally {
      setIsTranslating(false);
      setTranslatingVerses([]);
    }
  };

  const handleLiteralTranslation = async () => {
    if (!selectedVerse || !selectedText) return;
    
    try {
      setIsLoadingLiteralTranslation(true);
      setLiteralTranslation('');
      
      const translation = await getLiteralTranslation(
        selectedText,
        selectedLanguage,
        selectedVerse.book
      );
      
      setLiteralTranslation(translation);
      setShowExplanation(true);
    } catch (error) {
      console.error('Erro ao traduzir literalmente:', error);
      setLiteralTranslation('Erro ao gerar tradução literal. Por favor, tente novamente.');
    } finally {
      setIsLoadingLiteralTranslation(false);
    }
  };

  const handleAnalysis = async (type: AnalysisType) => {
    if (!selectedText || !selectedVerse) {
      toast.error('Selecione um texto primeiro');
      return;
    }

    setIsLoadingAnalysis(true);
    setAnalysisType(type);
    setAnalysisResult('');
    setShowExplanation(true);
    
    try {
      let result = '';
      const verseWithType = {
        ...selectedVerse,
        text: selectedText,
        analysisType: type
      };

      if (type === 'PG') {
        result = await generateSpeech(verseWithType);
      } else {
        result = await getVerseExplanation(verseWithType);
      }

      if (!result) {
        throw new Error('Resposta vazia recebida');
      }

      setAnalysisResult(result);
    } catch (error) {
      console.error('Erro ao gerar análise:', error);
      toast.error('Erro ao gerar análise. Por favor, tente novamente.');
      setAnalysisResult('');
      setShowExplanation(false);
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const currentBook = booksData?.find(book => book.name === selectedBook);

  // Efeito para atualizar o capítulo quando mudar o livro
  useEffect(() => {
    if (selectedBook) {
      setSelectedChapter(1);
    }
  }, [selectedBook]);

  // Efeito para manter os dados do capítulo
  useEffect(() => {
    if (chapterData) {
      console.log('Dados do capítulo atualizados:', chapterData);
    }
  }, [chapterData]);

  const handleVerseClick = (verse: BibleVerse) => {
    setSelectedVerses(prev => {
      const isSelected = prev.some(v => v.number === verse.number);
      if (isSelected) {
        return prev.filter(v => v.number !== verse.number);
      } else {
        return [...prev, verse];
      }
    });
  };

  const handleVerseTouch = (e: React.TouchEvent, verse: BibleVerse) => {
    e.preventDefault(); // Previne comportamento padrão
    setTouchedVerse(verse.number);

    // Adiciona feedback visual imediato
    const target = e.currentTarget as HTMLElement;
    target.style.backgroundColor = 'rgba(147, 51, 74, 0.1)'; // Cor burgundy com baixa opacidade
  };

  const handleVerseTouchEnd = (e: React.TouchEvent, verse: BibleVerse) => {
    e.preventDefault();
    setTouchedVerse(null);

    // Remove o feedback visual
    const target = e.currentTarget as HTMLElement;
    target.style.backgroundColor = '';

    // Processa a seleção do versículo
    handleVerseClick(verse);
  };

  const handleAnalyzeSelected = async () => {
    if (selectedVerses.length === 0) {
      toast.error('Selecione pelo menos um versículo');
      return;
    }

    setSelectedText(selectedVerses.map(v => v.text).join('\n'));
    setSelectedVerse(selectedVerses[0]); // Usa o primeiro versículo como referência
    setShowExplanation(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-8 text-liturgy-burgundy hover:text-liturgy-burgundy/80"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <header className="text-center mb-8">
          <h1 className="text-4xl font-serif text-liturgy-burgundy mb-4">
            Bíblia Ave Maria
          </h1>
          <p className="text-gray-600">Selecione um livro e capítulo para começar</p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Livro
            </label>
            <Select
              value={selectedBook || ''}
              onValueChange={setSelectedBook}
              disabled={isLoadingBooks}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um livro" />
              </SelectTrigger>
              <SelectContent>
                {booksData.map((book) => (
                  <SelectItem key={book.name} value={book.name}>
                    {book.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capítulo
            </label>
            <Select
              value={selectedChapter?.toString() || ''}
              onValueChange={(value) => setSelectedChapter(Number(value))}
              disabled={!selectedBook}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um capítulo" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: currentBook?.chapters || 0 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    Capítulo {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Botão de tradução */}
        <div className="flex items-center gap-2 mb-4">
          <Select
            value={selectedLanguage}
            onValueChange={setSelectedLanguage}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o idioma" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleTranslate}
            disabled={isTranslating}
            className="flex items-center gap-2"
          >
            {isTranslating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Traduzindo...
              </>
            ) : (
              <>
                <Languages className="h-4 w-4" />
                Traduzir
              </>
            )}
          </Button>
        </div>

        {/* Botão de análise dos versículos selecionados */}
        {selectedVerses.length > 0 && (
          <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2">
            <Button
              onClick={handleTranslate}
              disabled={isTranslating}
              className="bg-liturgy-burgundy hover:bg-liturgy-burgundy/90 text-white shadow-lg rounded-full px-6 py-3"
            >
              {isTranslating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Traduzindo...
                </>
              ) : (
                <>
                  <Languages className="h-5 w-5 mr-2" />
                  Traduzir ({selectedVerses.length})
                </>
              )}
            </Button>
            <Button
              onClick={handleAnalyzeSelected}
              className="bg-liturgy-burgundy hover:bg-liturgy-burgundy/90 text-white shadow-lg rounded-full px-6 py-3"
            >
              Analisar ({selectedVerses.length})
            </Button>
          </div>
        )}

        {/* Conteúdo do capítulo */}
        <div className="mt-8">
          {isLoadingChapter ? (
            <div className="space-y-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          ) : chapterError ? (
            <div className="text-center text-red-500 p-4 bg-red-50 rounded">
              <p>Erro ao carregar o capítulo.</p>
              <button
                onClick={() => refetchChapter()}
                className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
              >
                Tentar novamente
              </button>
            </div>
          ) : chapterData ? (
            <div className="prose max-w-none liturgy-text">
              <h2 className="text-2xl font-serif text-liturgy-burgundy mb-4 flex items-center">
                <Book className="mr-2 h-5 w-5" />
                {selectedBook} - Capítulo {selectedChapter}
              </h2>
              <div className="space-y-4">
                {chapterData.verses.map((verse) => (
                  <div
                    key={verse.number}
                    className={`
                      mb-4 p-4 rounded select-none touch-manipulation
                      active:bg-liturgy-burgundy/20
                      transition-all duration-200 ease-in-out
                      ${
                        selectedVerses.some(v => v.number === verse.number)
                          ? 'bg-liturgy-burgundy/20 border-2 border-liturgy-burgundy shadow-md'
                          : 'bg-white hover:bg-accent/50'
                      }
                    `}
                    onClick={() => handleVerseClick(verse)}
                    onTouchStart={(e) => handleVerseTouch(e, verse)}
                    onTouchEnd={(e) => handleVerseTouchEnd(e, verse)}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-primary text-lg min-w-[1.5rem]">{verse.number}</span>
                        <span className="text-base leading-relaxed flex-1">{verse.text}</span>
                        {selectedVerses.some(v => v.number === verse.number) && (
                          <span className="text-liturgy-burgundy text-xl">✓</span>
                        )}
                      </div>
                      
                      {/* Tradução do versículo */}
                      {selectedVerses.some(v => v.number === verse.number) && (
                        <div className="pl-7 mt-2">
                          {translatingVerses.includes(verse.number) ? (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <div className="w-4 h-4 border-2 border-liturgy-burgundy border-t-transparent rounded-full animate-spin" />
                              Traduzindo...
                            </div>
                          ) : verseTranslations[`${verse.number}-${selectedLanguage}`] ? (
                            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded shadow-sm">
                              <span className="font-medium text-xs text-gray-500 block mb-1">
                                {AVAILABLE_LANGUAGES.find(lang => lang.code === selectedLanguage)?.name}:
                              </span>
                              {verseTranslations[`${verse.number}-${selectedLanguage}`]}
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-600 p-8">
              <Book className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p>Selecione um livro e capítulo para começar a leitura.</p>
            </div>
          )}
        </div>

        {/* Popup de análise */}
        {selectedText && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => {
                setSelectedText(null);
                setSelectedVerse(null);
                setExplanation('');
                setAnalysisResult('');
                setShowExplanation(false);
              }}
            />
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden relative z-10 flex flex-col">
              <button
                onClick={() => {
                  setSelectedText(null);
                  setSelectedVerse(null);
                  setExplanation('');
                  setAnalysisResult('');
                  setShowExplanation(false);
                }}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
              
              <div className="flex flex-col h-full overflow-hidden">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Texto Selecionado:</h3>
                  <p className="text-gray-700">{selectedText}</p>
                  
                  {selectedVerse && (
                    <p className="text-sm text-gray-500 mt-2">
                      {selectedVerse.book} {selectedVerse.chapter}:{selectedVerse.number}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Select
                    value={selectedLanguage}
                    onValueChange={setSelectedLanguage}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Selecione o idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_LANGUAGES.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleTranslate}
                    disabled={isTranslating}
                    className="flex items-center gap-2"
                  >
                    {isTranslating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Traduzindo...
                      </>
                    ) : (
                      <>
                        <Languages className="h-4 w-4" />
                        Traduzir
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {ANALYSIS_BUTTONS.map((button) => (
                    <Button
                      key={button.type}
                      onClick={() => handleAnalysis(button.type)}
                      disabled={isLoadingAnalysis || !selectedText}
                      className={`${
                        button.type === 'PG' ? 'col-span-2 bg-liturgy-burgundy' : ''
                      } ${isLoadingAnalysis ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title={button.title}
                    >
                      {isLoadingAnalysis && analysisType === button.type ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      ) : null}
                      {button.label}
                    </Button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto mt-4 pr-4">
                  {explanation && (
                    <div className="bg-gray-50 rounded p-6 mb-4">
                      <h4 className="font-semibold mb-4 text-lg">Análise:</h4>
                      <div className="prose prose-slate max-w-none">
                        {explanation.split('\n').map((paragraph, index) => (
                          paragraph.trim() && (
                            <p key={index} className="mb-4">
                              {paragraph}
                            </p>
                          )
                        ))}
                      </div>
                    </div>
                  )}

                  {analysisResult && (
                    <div className="bg-gray-50 rounded p-6">
                      <h4 className="font-semibold mb-4 text-lg">
                        {ANALYSIS_BUTTONS.find(b => b.type === analysisType)?.title || 'Análise'}:
                      </h4>
                      <div className="prose prose-slate max-w-none whitespace-pre-line">
                        {analysisResult}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <Dialog open={showExplanation} onOpenChange={setShowExplanation}>
          <DialogContent className="relative max-w-2xl max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setShowExplanation(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <DialogHeader>
              <DialogTitle>
                {analysisType ? ANALYSIS_BUTTONS.find(b => b.type === analysisType)?.title : 'Análise do Versículo'}
              </DialogTitle>
              {selectedVerse && (
                <DialogDescription>
                  {selectedVerse.book} {selectedVerse.chapter}:{selectedVerse.number}
                </DialogDescription>
              )}
            </DialogHeader>
            <div className="mt-4 prose prose-slate max-w-none overflow-y-auto max-h-[60vh] pr-4">
              {isLoadingAnalysis ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-liturgy-burgundy"></div>
                </div>
              ) : (
                <div className="whitespace-pre-line">
                  {analysisResult}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}