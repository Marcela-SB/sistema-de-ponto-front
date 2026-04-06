import { useQuery } from '@tanstack/react-query';
import { recordService } from '../services/recordService';

export const useRecords = (internId?: string) => {
  return useQuery({
    queryKey: ['records', internId],
    queryFn: () => recordService.getMyRecords(internId!),
    enabled: !!internId, // Só busca se o ID existir
    staleTime: 1000 * 60 * 5, // 5 minutos sem precisar de novo fetch
  });
};

// Busca anos disponíveis
export const useAvailableYears = () => {
  return useQuery({
    queryKey: ['availableYears'],
    queryFn: () => recordService.getAvaliableYears(),
    staleTime: 1000 * 60 * 60, // Anos mudam pouco, cache de 1 hora
  });
};

