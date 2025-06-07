
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LiturgicalCalendar from '../components/Calendar/LiturgicalCalendar';
import { useLiturgicalData } from '../hooks/useLiturgicalData';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpenText, CalendarDays } from 'lucide-react';
import { getLiturgyColorClass } from '../services/liturgicalService';

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { data: liturgicalData, loading, error } = useLiturgicalData(selectedDate);
  const navigate = useNavigate();
  const location = useLocation();
  
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);
  
  // Navigate to daily readings page
  const handleViewReadings = () => {
    navigate('/daily-readings', { state: { date: selectedDate } });
  };
  
  // Handle date selection from calendar
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  // When coming from another page, optionally focus calendar or set date
  useEffect(() => {
    if (location.state?.date) {
      const date = new Date(location.state.date);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
      }
    }

    if (location.state?.openCalendar && calendarRef.current) {
      calendarRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.state]);
  
  // Initialize animations
  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.from(titleRef.current, {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });
    
    tl.from(subtitleRef.current, {
      y: -20,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.5");
    
    tl.from(calendarRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    }, "-=0.3");
    
    tl.from(actionRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.5");
    
    // Cleanup
    return () => {
      tl.kill();
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-16">
          <h1 
            ref={titleRef} 
            className="text-4xl md:text-5xl lg:text-6xl font-serif text-liturgy-burgundy mb-4"
          >
            Liturgia Lumina
          </h1>
          <p 
            ref={subtitleRef}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Uma jornada sagrada através das leituras diárias, inspirando a fé e a meditação profunda na Palavra de Deus.
          </p>
        </header>
        
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
          <div ref={calendarRef} className="w-full lg:w-1/2">
            <LiturgicalCalendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              liturgicalData={liturgicalData}
            />
          </div>
          
          <div ref={actionRef} className="w-full lg:w-1/2 bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-liturgy-gold/20">
            <h2 className="text-2xl font-serif text-liturgy-burgundy mb-4">
              Leituras do Dia
            </h2>
            
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : error ? (
              <div className="text-red-500">
                Erro ao carregar os dados litúrgicos. Por favor, tente novamente.
              </div>
            ) : liturgicalData ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium text-liturgy-purple">
                    {liturgicalData.liturgia}
                  </h3>
                  <span 
                    className={`px-3 py-1 rounded-full text-sm ${getLiturgyColorClass(liturgicalData.cor)}`}
                  >
                    {liturgicalData.cor}
                  </span>
                </div>
                
                {liturgicalData.leituras.evangelho && liturgicalData.leituras.evangelho[0] && (
                  <div>
                    <p className="text-gray-500 mb-1">Evangelho:</p>
                    <p className="font-medium">{liturgicalData.leituras.evangelho[0].referencia}</p>
                    <p className="text-gray-700 line-clamp-3 mt-2">
                      {liturgicalData.leituras.evangelho[0].texto.substring(0, 150)}...
                    </p>
                  </div>
                )}
                
                <Button
                  onClick={handleViewReadings}
                  className="w-full mt-6 bg-liturgy-burgundy hover:bg-liturgy-burgundy/90 text-white"
                >
                  <BookOpenText className="mr-2 h-4 w-4" />
                  Ver Leituras Completas
                </Button>
              </div>
            ) : (
              <div className="text-gray-500">
                Selecione uma data no calendário para ver as leituras.
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Explore a riqueza das leituras diárias e aprofunde sua compreensão da Palavra de Deus.
          </p>
          <Button
            onClick={handleViewReadings}
            variant="outline"
            className="border-liturgy-gold/50 text-liturgy-burgundy hover:bg-liturgy-gold/10"
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            Explorar Calendário Litúrgico
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
