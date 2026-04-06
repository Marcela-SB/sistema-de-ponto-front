import { useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import TimeRecordTable from "../components/TimeRecordTable";
import { Box, Button, Typography, MenuItem, Select, CircularProgress } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { lastDayOfMonth, format } from "date-fns";
import { useAuth } from "../contexts/AuthContext";
import { recordService } from "../services/recordService";
import { useQuery } from '@tanstack/react-query';

export default function History() {
    const location = useLocation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);

    // 1. Prioridade para o ID que vem da navegação (SearchInterns)
    // Se não houver, usa o ID do próprio usuário logado (Bolsista)
    // Pegue o mês e ano que vêm do estado da navegação
    const { records: initialRecords, month: filteredMonth, year: filteredYear, internId: idFromState, internName } = location.state || {};

    const effectiveInternId = idFromState || user?.internExternalId;


    // 2. BUSCA AUTOMÁTICA
    // Se viemos do SearchInterns, o 'initialData' evita que o React Query faça um novo fetch imediato
    const { data: records = [], isLoading } = useQuery({
        queryKey: ['records', effectiveInternId, filteredMonth, filteredYear], // CHAVE COMPOSTA
        queryFn: () => {
            // Se temos um mês/ano específico vindo do filtro, usamos o serviço de período
            if (filteredMonth && filteredYear) {
                return recordService.getRecordsByPeriod(effectiveInternId!, filteredMonth, filteredYear);
            }
            // Caso contrário (bolsista vendo tudo), usa o método geral
            return recordService.getMyRecords(effectiveInternId!);
        },
        enabled: !!effectiveInternId,
        initialData: initialRecords,  // Usa os dados passados pelo navigate, se existirem
        staleTime: 1000 * 60 * 5,
    });

    // 3. LÓGICA DE AGRUPAMENTO (Mantida, mas garantindo segurança)
    const groupedData = useMemo(() => {
        const groups: Record<string, any> = {}; 

        records.forEach((rec: any) => {
            const parts = rec.recordDate.split('/');
            if (parts.length !== 3) return;

            const [d, m, y] = parts;
            const key = `${m}/${y}`;

            if (!groups[key]) {
                groups[key] = {
                    records: [],
                    startDate: `${y}-${m}-01`,
                    endDate: format(lastDayOfMonth(new Date(Number(y), Number(m) - 1)), 'yyyy-MM-dd')
                };
            }
            groups[key].records.push(rec);
        });

        return groups;
    }, [records]);

    const monthKeys = useMemo(() => {
        return Object.keys(groupedData).sort((a, b) => {
            const [m1, y1] = a.split('/').map(Number);
            const [m2, y2] = b.split('/').map(Number);
            return y2 !== y1 ? y2 - y1 : m2 - m1;
        });
    }, [groupedData]);

    // Efeito para resetar o tabValue caso o número de meses mude (ex: nova busca)
    useEffect(() => {
        setTabValue(0);
    }, [monthKeys.length]);

    const currentMonthKey = monthKeys[tabValue];
    const currentData = groupedData[currentMonthKey];

    if (isLoading && !records.length) {
        return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;
    }

    return (
        <Box sx={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}> 
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: '100%', my: 1, px: 2 }}>
                <Button 
                    onClick={() => navigate(-1)} // Volta para onde o usuário estava
                    sx={{ position: 'absolute', left: 16, textTransform: 'none', fontWeight: 'bold' }}
                    variant="contained"
                    startIcon={<ArrowBackIcon/>}
                >
                    Voltar
                </Button>

                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                        Histórico de Frequência - 
                        {monthKeys.length==1 ? 
                            ` ${currentMonthKey}`
                        :
                            <Select
                                value={monthKeys[tabValue]} 
                                onChange={(e) => {
                                    const newIndex = monthKeys.indexOf(e.target.value);
                                    setTabValue(newIndex);
                                }}
                                size="small"
                                sx={{ 
                                    fontWeight: 'bold',
                                    mx:1,
                                    fontSize: 'large'
                                }}
                            >
                                {monthKeys.map((key) => (
                                    <MenuItem key={key} value={key}>
                                        {key}
                                    </MenuItem>
                                ))}
                            </Select>
                        }
                    </Typography>
                
            </Box>
           
            {internName && (
                <Box textAlign={'center'}>  
                    <Typography sx={{ mb: 2, mt:-1 }}>
                        <span style={{ fontWeight: 'bold'}}>Bolsista: </span> {internName}
                    </Typography>
                </Box>
            )}

            {currentData ? (
                <TimeRecordTable 
                    records={currentData.records} 
                    startDate={currentData.startDate} 
                    endDate={currentData.endDate}
                />
            ) : (
                <Typography sx={{ textAlign: 'center', mt: 4 }}>Nenhum registro encontrado.</Typography>
            )}
        </Box>
    );
}