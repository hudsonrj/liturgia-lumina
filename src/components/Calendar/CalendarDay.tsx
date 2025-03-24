
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { isDateToday, isSameDayCheck } from '../../utils/dateUtils';
import { LiturgyColor, getLiturgyColorClass } from '../../services/liturgicalService';

interface CalendarDayProps {
  date: Date;
  isCurrentMonth: boolean;
  isSelected: boolean;
  hasLiturgy: boolean;
  color?: LiturgyColor;
  onClick: (date: Date) => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  isCurrentMonth,
  isSelected,
  hasLiturgy,
  color,
  onClick
}) => {
  const isToday = isDateToday(date);
  const dayNumber = format(date, 'd', { locale: ptBR });
  
  // Determine the style based on the state
  let dayClasses = "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 relative ";
  
  if (isSelected) {
    dayClasses += color 
      ? `${getLiturgyColorClass(color)} font-bold scale-110 shadow-md ` 
      : "bg-liturgy-gold text-white font-bold scale-110 shadow-md ";
  } else if (isToday) {
    dayClasses += "border-2 border-liturgy-gold font-bold ";
  } else if (!isCurrentMonth) {
    dayClasses += "text-gray-400 ";
  }
  
  if (hasLiturgy && !isSelected) {
    dayClasses += "before:content-[''] before:absolute before:bottom-1 before:w-1.5 before:h-1.5 before:rounded-full before:bg-liturgy-gold ";
  }
  
  return (
    <div 
      className={`calendar-day-wrapper p-1 ${isCurrentMonth ? 'cursor-pointer hover:scale-110' : 'opacity-50'}`}
      onClick={() => isCurrentMonth && onClick(date)}
    >
      <div className={dayClasses}>
        {dayNumber}
      </div>
    </div>
  );
};

export default CalendarDay;
