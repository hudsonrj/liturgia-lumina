import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDateLong, getNextDay, getPreviousDay } from '../utils/dateUtils';
import { FaithExample, getFaithExampleForDate } from '../data/faithExamples';

// We now use the FaithExample interface and data from our database
// instead of generating content with AI

const ExampleOfFaith: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [faithExample, setFaithExample] = useState<FaithExample | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Load faith example for the selected date from our database
  useEffect(() => {
    const loadFaithExample = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate a short loading time for better UX
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Get the faith example for the selected date from our database
        const example = getFaithExampleForDate(selectedDate);
        setFaithExample(example);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro desconhecido'));
        console.error('Erro ao carregar exemplo de fé:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadFaithExample();
  }, [selectedDate]);
  
  // Animation when faith example changes
  useEffect(() => {
    if (contentRef.current && !loading) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [faithExample, loading]);
  
  // Navigate to previous day
  const handlePreviousDay = () => {
    setSelectedDate(prevDate => getPreviousDay(prevDate));
  };
  
  // Navigate to next day
  const handleNextDay = () => {
    setSelectedDate(prevDate => getNextDay(prevDate));
  };
  
  // Navigate back to home
  const handleBackToHome = () => {
    navigate('/');
  };
  
  // Navigate to calendar view
  const handleOpenCalendar = () => {
    navigate('/', { state: { openCalendar: true } });
  };
  
  // Initialize page animations
  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.from(".header-anim", {
      y: -30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out"
    });
    
    tl.from(".navigation-anim", {
      x: -20,
      opacity: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: "power3.out"
    }, "-=0.3");
    
    // Cleanup
    return () => {
      tl.kill();
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-4 md:mb-0">
            <Button
              variant="ghost"
              onClick={handleBackToHome}
              className="text-liturgy-burgundy hover:bg-liturgy-gold/10 header-anim"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </div>
          
          <div className="flex items-center space-x-2 header-anim">
            <Button
              variant="outline"
              onClick={handlePreviousDay}
              className="border-liturgy-gold/50 text-liturgy-burgundy hover:bg-liturgy-gold/10 navigation-anim"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only md:not-sr-only md:ml-2">Anterior</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={handleOpenCalendar}
              className="border-liturgy-gold/50 text-liturgy-burgundy hover:bg-liturgy-gold/10 navigation-anim"
            >
              <Calendar className="h-4 w-4 md:mr-2" />
              <span className="sr-only md:not-sr-only">Calendário</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={handleNextDay}
              className="border-liturgy-gold/50 text-liturgy-burgundy hover:bg-liturgy-gold/10 navigation-anim"
            >
              <span className="sr-only md:not-sr-only md:mr-2">Próximo</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </header>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-title text-liturgy-burgundy mb-2 header-anim">
            Exemplo de Fé
          </h1>
          <p className="text-gray-600 font-handwriting text-xl md:text-2xl header-anim">
            {formatDateLong(selectedDate)}
          </p>
        </div>
        
        <div ref={contentRef}>
          {loading ? (
            <Card className="bg-white/80 backdrop-blur-sm border border-liturgy-gold/20">
              <CardHeader>
                <Skeleton className="h-8 w-3/4 mx-auto" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="bg-white/80 backdrop-blur-sm border border-liturgy-gold/20">
              <CardHeader>
                <CardTitle className="text-red-500">Erro ao carregar o exemplo de fé</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Não foi possível carregar o exemplo de fé para {formatDateLong(selectedDate)}.
                  Por favor, tente novamente mais tarde.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleBackToHome}
                  className="bg-liturgy-burgundy hover:bg-liturgy-burgundy/90 text-white"
                >
                  Voltar para a Página Inicial
                </Button>
              </CardFooter>
            </Card>
          ) : faithExample ? (
            <Card className="bg-white/80 backdrop-blur-sm border border-liturgy-gold/20">
              <CardHeader>
                <CardTitle className="text-2xl font-title text-liturgy-burgundy text-center">
                  {faithExample.title}
                </CardTitle>
                <CardDescription className="text-center font-handwriting text-lg">
                  Uma história de fé e milagre para inspirar sua jornada espiritual
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium text-liturgy-purple mb-2">A História</h3>
                  <p className="text-gray-700 font-script">{faithExample.story}</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-liturgy-purple mb-2">O Milagre</h3>
                  <p className="text-gray-700 font-script">{faithExample.miracle}</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-liturgy-purple mb-2">A Lição</h3>
                  <p className="text-gray-700 font-script">{faithExample.lesson}</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-liturgy-purple mb-2">Conexão com os Ensinamentos de Jesus</h3>
                  <p className="text-gray-700 font-script">{faithExample.connection}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-gray-500 italic">
                  "A fé é a certeza daquilo que esperamos e a prova das coisas que não vemos." - Hebreus 11:1
                </p>
              </CardFooter>
            </Card>
          ) : (
            <Card className="bg-white/80 backdrop-blur-sm border border-liturgy-gold/20">
              <CardContent className="py-8">
                <p className="text-gray-600 text-center">
                  Não foi encontrado um exemplo de fé para esta data.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExampleOfFaith;