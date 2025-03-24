
import React, { useState, useEffect, useRef } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getCalendarDays } from '../../utils/dateUtils';
import CalendarDay from './CalendarDay';
import { LiturgicalData } from '../../services/liturgicalService';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';

interface LiturgicalCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  liturgicalData?: LiturgicalData | null;
}

const LiturgicalCalendar: React.FC<LiturgicalCalendarProps> = ({
  selectedDate,
  onDateSelect,
  liturgicalData
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const daysRef = useRef<HTMLDivElement>(null);
  
  // Days of the week
  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  
  // Get all days to display in current month view
  const calendarDays = getCalendarDays(currentMonth);
  
  // Navigate to next month
  const nextMonth = () => {
    animateMonthChange('next', () => {
      setCurrentMonth(prev => addMonths(prev, 1));
    });
  };
  
  // Navigate to previous month
  const prevMonth = () => {
    animateMonthChange('prev', () => {
      setCurrentMonth(prev => subMonths(prev, 1));
    });
  };
  
  // Animate month change with GSAP
  const animateMonthChange = (direction: 'next' | 'prev', callback: () => void) => {
    if (titleRef.current && daysRef.current) {
      // Set initial position for entering elements
      gsap.set(titleRef.current, { 
        x: direction === 'next' ? 50 : -50, 
        opacity: 0 
      });
      
      gsap.set(daysRef.current, { 
        y: direction === 'next' ? 20 : -20, 
        opacity: 0 
      });
      
      // Timeline for smooth animation
      const tl = gsap.timeline({
        onComplete: callback
      });
      
      // Animate out current elements
      tl.to(titleRef.current, { 
        x: direction === 'next' ? -50 : 50, 
        opacity: 0, 
        duration: 0.2 
      });
      
      tl.to(daysRef.current, { 
        y: direction === 'next' ? -20 : 20, 
        opacity: 0, 
        duration: 0.2 
      }, "<");
      
      // Execute callback to change month
      tl.call(() => {
        callback();
      });
      
      // Animate in new elements
      tl.to(titleRef.current, { 
        x: 0, 
        opacity: 1, 
        duration: 0.3 
      });
      
      tl.to(daysRef.current, { 
        y: 0, 
        opacity: 1, 
        duration: 0.3,
        stagger: {
          amount: 0.1,
          from: direction === 'next' ? "start" : "end",
          grid: "auto"
        }
      }, "<");
    } else {
      // Fallback if refs aren't available
      callback();
    }
  };
  
  // Initialize GSAP animations
  useEffect(() => {
    if (calendarRef.current) {
      gsap.from(calendarRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
      });
      
      if (titleRef.current) {
        gsap.from(titleRef.current, {
          y: -10,
          opacity: 0,
          duration: 0.4,
          delay: 0.2,
          ease: 'power2.out'
        });
      }
      
      if (daysRef.current) {
        gsap.from(daysRef.current.children, {
          y: 10,
          opacity: 0,
          duration: 0.3,
          stagger: 0.02,
          delay: 0.3,
          ease: 'power2.out'
        });
      }
    }
  }, []);
  
  return (
    <div 
      ref={calendarRef}
      className="bg-white rounded-2xl shadow-xl p-6 max-w-md mx-auto glass border-liturgy-gold/20 border"
    >
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={prevMonth} 
          className="rounded-full hover:bg-liturgy-gold/10"
        >
          <ChevronLeft className="h-6 w-6 text-liturgy-burgundy" />
        </Button>
        
        <div ref={titleRef} className="text-center">
          <h2 className="text-2xl font-serif text-liturgy-burgundy capitalize">
            {format(currentMonth, 'MMMM', { locale: ptBR })}
          </h2>
          <p className="text-sm text-gray-500">
            {format(currentMonth, 'yyyy', { locale: ptBR })}
          </p>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={nextMonth}
          className="rounded-full hover:bg-liturgy-gold/10"
        >
          <ChevronRight className="h-6 w-6 text-liturgy-burgundy" />
        </Button>
      </div>
      
      {/* Weekdays header */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar days */}
      <div ref={daysRef} className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
          const isSelected = day.getDate() === selectedDate.getDate() && 
                             day.getMonth() === selectedDate.getMonth() && 
                             day.getFullYear() === selectedDate.getFullYear();
          
          // Check if this day has liturgical data
          const hasLiturgy = isCurrentMonth; // Simplified, in reality would check if data exists
          
          return (
            <CalendarDay
              key={index}
              date={day}
              isCurrentMonth={isCurrentMonth}
              isSelected={isSelected}
              hasLiturgy={hasLiturgy}
              color={isSelected && liturgicalData ? liturgicalData.cor : undefined}
              onClick={onDateSelect}
            />
          );
        })}
      </div>
      
      {/* Current selection display */}
      {liturgicalData && (
        <div className="mt-6 p-3 border-t border-gray-100">
          <h3 className="text-sm text-gray-500">Selecionado</h3>
          <p className="font-serif text-liturgy-burgundy">{liturgicalData.liturgia}</p>
        </div>
      )}
    </div>
  );
};

export default LiturgicalCalendar;
