import { eachDayOfInterval, parseISO } from 'date-fns';

// Gera todos os dias entre uma data início e fim
export const generateCalendarDays = (startStr: string, endStr: string) => {
  return eachDayOfInterval({
    start: parseISO(startStr),
    end: parseISO(endStr),
  });
};