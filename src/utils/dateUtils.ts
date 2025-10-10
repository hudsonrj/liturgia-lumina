import { format, addDays, subDays, parseISO, isToday, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Função auxiliar para validar data
const validateDate = (date: Date): Date => {
  return date instanceof Date && !isNaN(date.getTime()) ? date : new Date();
};

// Format date to "dd/MM/yyyy"
export const formatDateToBrazilian = (date: Date): string => {
  const validDate = validateDate(date);
  return format(validDate, 'dd/MM/yyyy', { locale: ptBR });
};

// Format date to "dd"
export const formatDay = (date: Date): string => {
  const validDate = validateDate(date);
  return format(validDate, 'dd', { locale: ptBR });
};

// Format date to "MMM"
export const formatMonth = (date: Date): string => {
  const validDate = validateDate(date);
  return format(validDate, 'MMM', { locale: ptBR });
};

// Format date to "yyyy"
export const formatYear = (date: Date): string => {
  const validDate = validateDate(date);
  return format(validDate, 'yyyy', { locale: ptBR });
};

// Format date to long format
export const formatDateLong = (date: Date): string => {
  const validDate = validateDate(date);
  return format(validDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
};

// Get the next day
export const getNextDay = (date: Date): Date => {
  const validDate = validateDate(date);
  return addDays(validDate, 1);
};

// Get the previous day
export const getPreviousDay = (date: Date): Date => {
  const validDate = validateDate(date);
  return subDays(validDate, 1);
};

// Check if a date is today
export const isDateToday = (date: Date): boolean => {
  const validDate = validateDate(date);
  return isToday(validDate);
};

// Check if two dates are the same day
export const isSameDayCheck = (date1: Date, date2: Date): boolean => {
  const validDate1 = validateDate(date1);
  const validDate2 = validateDate(date2);
  return isSameDay(validDate1, validDate2);
};

// Parse a string to a Date object
export const parseISODate = (dateString: string): Date => {
  try {
    const parsedDate = parseISO(dateString);
    return validateDate(parsedDate);
  } catch (e) {
    console.error('Erro ao fazer parse da data:', e);
    return new Date();
  }
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
