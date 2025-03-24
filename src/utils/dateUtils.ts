
import { format, addDays, subDays, parseISO, isToday, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Format date to "dd/MM/yyyy"
export const formatDateToBrazilian = (date: Date): string => {
  return format(date, 'dd/MM/yyyy', { locale: ptBR });
};

// Format date to "dd"
export const formatDay = (date: Date): string => {
  return format(date, 'dd', { locale: ptBR });
};

// Format date to "MMM"
export const formatMonth = (date: Date): string => {
  return format(date, 'MMM', { locale: ptBR });
};

// Format date to "yyyy"
export const formatYear = (date: Date): string => {
  return format(date, 'yyyy', { locale: ptBR });
};

// Format date to long format
export const formatDateLong = (date: Date): string => {
  return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
};

// Get the next day
export const getNextDay = (date: Date): Date => {
  return addDays(date, 1);
};

// Get the previous day
export const getPreviousDay = (date: Date): Date => {
  return subDays(date, 1);
};

// Check if a date is today
export const isDateToday = (date: Date): boolean => {
  return isToday(date);
};

// Check if two dates are the same day
export const isSameDayCheck = (date1: Date, date2: Date): boolean => {
  return isSameDay(date1, date2);
};

// Parse a string to a Date object
export const parseISODate = (dateString: string): Date => {
  return parseISO(dateString);
};

// Get array of dates for the current month calendar view
export const getCalendarDays = (currentDate: Date): Date[] => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  // Calculate the first day of the calendar (can be from the previous month)
  const firstDayOfCalendar = new Date(firstDayOfMonth);
  const dayOfWeek = firstDayOfMonth.getDay();
  firstDayOfCalendar.setDate(firstDayOfMonth.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  
  // Total days to show (6 weeks)
  const totalDays = 42;
  
  const days: Date[] = [];
  for (let i = 0; i < totalDays; i++) {
    const day = new Date(firstDayOfCalendar);
    day.setDate(firstDayOfCalendar.getDate() + i);
    days.push(day);
    
    // Stop when we've gone past the last day of the month and completed the week
    if (day > lastDayOfMonth && day.getDay() === 0) {
      break;
    }
  }
  
  return days;
};
