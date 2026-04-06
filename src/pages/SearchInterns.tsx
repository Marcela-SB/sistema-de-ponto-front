import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, MenuItem, Select, Stack, Typography } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import type { Intern } from "../types/perfils";
import { internService } from "../services/internService";
import { recordService } from "../services/recordService";
import { useAvailableYears } from "../hooks/useRecords";
import { useMyInterns } from "../hooks/useInterns";


const MONTHS = [
    { value: 1, label: "Janeiro" },
    { value: 2, label: "Fevereiro" },
    { value: 3, label: "Março" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Maio" },
    { value: 6, label: "Junho" },
    { value: 7, label: "Julho" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Setembro" },
    { value: 10, label: "Outubro" },
    { value: 11, label: "Novembro" },
    { value: 12, label: "Dezembro" }
];

export default function SearchInterns(){
    const navigate = useNavigate();
    const {user} = useAuth();

    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [internId, setInternId] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const { data: availableYears = [new Date().getFullYear()], isLoading: loadingYears } = useAvailableYears();
    const { data: interns = [], isLoading: loadingInterns } = useMyInterns(user?.externalId);

    const handleSearch = async () => {
        if (!internId) {
            alert("Selecione um bolsista!");
            return;
        }

        const selectedIntern = interns.find(i => i.externalId === internId);
        const internName = selectedIntern?.user.name || "Bolsista";

        try {
            setIsSearching(true);
            const data = await recordService.getRecordsByPeriod(internId, month, year);

            if (data && data.length > 0) {
                navigate("/history", { 
                    state: { 
                        records: data, 
                        internId, 
                        internName,
                        month, 
                        year
                    } 
                });
            } else {
                alert("Não há registros desse bolsista nesse período.");
            }
        } catch (error) {
            console.error("Erro ao buscar registros:", error);
            alert("Erro ao consultar registros.");
        } finally {
            setIsSearching(false);
        }
    };

    const isInitialLoading = loadingYears || loadingInterns;

    return (
        <Box className="flex flex-col w-screen px-12">
            <Typography variant="h4">Consultar Bolsista</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
                Veja o resumo de frequência por período
            </Typography>

            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Box p={3} border={2} borderColor={'divider'} borderRadius={1} mb={4} width={'600px'}>
                    {isInitialLoading ? (
                        <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
                    ) : (
                        <Stack spacing={2} alignItems="flex-start">
                            {/* Seleção de Bolsista */}
                            <Box display="flex" alignItems="center" gap={1}>
                                <Typography variant="body1" fontWeight={'bold'}>Bolsista:*</Typography>
                                <Select 
                                    value={internId}
                                    onChange={(e) => setInternId(e.target.value)}
                                    sx={{ height: '1.8rem', width:'21.6rem', fontSize: '0.9rem' }}
                                >
                                    {interns
                                        .filter((i) => i.user.active === true)
                                        .map((i) => (
                                            <MenuItem key={i.externalId} value={i.externalId}>
                                                {i.user.name}
                                            </MenuItem>
                                        ))
                                    }
                                </Select>
                            </Box>

                            {/* Seleção de Período */}
                            <Box display="flex" alignItems="center" gap={1}>
                                <Typography variant="body1" fontWeight={'bold'}>Período de referência:*</Typography>
                                <Select 
                                    value={month}
                                    onChange={(e) => setMonth(Number(e.target.value))}
                                    sx={{ height: '1.8rem', width:'8rem', fontSize: '0.9rem' }}
                                >
                                    {MONTHS.map((m) => (
                                        <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                                    ))}
                                </Select>

                                <Typography variant="h6">/</Typography>

                                <Select 
                                    value={year}
                                    onChange={(e) => setYear(Number(e.target.value))}
                                    sx={{ height: '1.8rem', width:'6rem', fontSize: '0.9rem' }}
                                >
                                    {availableYears.map((y) => (
                                        <MenuItem key={y} value={y}>{y}</MenuItem>
                                    ))}
                                </Select>
                            </Box>

                            <Box width="100%" display="flex" justifyContent="center">
                                <Button
                                    variant="contained"
                                    disabled={isSearching}
                                    onClick={handleSearch}
                                    sx={{ width: '400px', textTransform: 'none', py: 1 }}
                                >
                                    {isSearching ? 'Buscando...' : 'Buscar'}
                                </Button>
                            </Box>
                        </Stack>
                    )}
                </Box>
            </Box>
        </Box>
    );
}