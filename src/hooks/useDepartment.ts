import { useQuery } from "@tanstack/react-query"
import { departmentService } from "../services/departmentService";

export const useDepartment = () => {
    return useQuery({
        queryKey: ['departments'],
        queryFn: () => departmentService.getAll(),
    });
}