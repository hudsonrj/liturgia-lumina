
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import DailyLiturgyView from '../components/DailyLiturgy/DailyLiturgyView';
import { useLiturgicalData } from '../hooks/useLiturgicalData';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDateLong, getNextDay, getPreviousDay } from '../utils/dateUtils';

const DailyReadings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialDate = location.state?.date ? new Date(location.state.date) : new Date();
  
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const { data: liturgicalData, loading, error } = useLiturgicalData(selectedDate);
  
  const contentRef = useRef<HTMLDivElement>(null);
  
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
  
  // Animation when liturgical data changes
  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [liturgicalData]);
  
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
    
    if (contentRef.current) {
      tl.from(contentRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.2");
    }
    
    // Cleanup
    return () => {
      tl.kill();
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
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
        
        <div ref={contentRef}>
          {loading ? (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="text-center">
                <Skeleton className="h-8 w-48 mx-auto mb-2" />
                <Skeleton className="h-12 w-96 mx-auto mb-2" />
                <Skeleton className="h-4 w-40 mx-auto" />
              </div>
              
              <div className="bg-white rounded-lg p-6">
                <Skeleton className="h-10 w-full mb-6" />
                <Skeleton className="h-48 w-full" />
              </div>
            </div>
          ) : error ? (
            <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 text-center">
              <h2 className="text-xl text-red-500 mb-4">
                Erro ao carregar os dados litúrgicos
              </h2>
              <p className="text-gray-600 mb-6">
                Não foi possível carregar as leituras para {formatDateLong(selectedDate)}.
                Por favor, tente novamente mais tarde.
              </p>
              <Button
                onClick={handleBackToHome}
                className="bg-liturgy-burgundy hover:bg-liturgy-burgundy/90 text-white"
              >
                Voltar para a Página Inicial
              </Button>
            </div>
          ) : liturgicalData ? (
            <DailyLiturgyView
              liturgicalData={liturgicalData}
              selectedDate={selectedDate}
            />
          ) : (
            <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 text-center">
              <p className="text-gray-600">
                Não foram encontradas leituras para esta data.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyReadings;
