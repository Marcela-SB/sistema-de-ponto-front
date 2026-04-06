import { useQuery } from "@tanstack/react-query";
import { internService } from "../services/internService";

// Busca bolsistas do supervisor
export const useMyInterns = (supervisorId?: string) => {
  return useQuery({
    queryKey: ['myInterns', supervisorId],
    queryFn: () => internService.getMyInterns(supervisorId!),
    enabled: !!supervisorId,
  });
};