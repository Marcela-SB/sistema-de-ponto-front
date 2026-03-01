'use client'
import { Add } from '@mui/icons-material';
import Relogio from '../components/Relogio';
import { Box, Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from '../contexts/AuthContext';
import type { TimeRecord } from '../types/registers';
import { recordService } from '../services/recordService';

export default function HomeIntern() {
    const [dataHoje, setDataHoje] = useState<Date | null>(null);
    const { user } = useAuth();
    const [record, setRecord] = useState<TimeRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const isWeekend = dataHoje ? (dataHoje.getDay() === 0 || dataHoje.getDay() === 6) : false;

    useEffect(() => {
        setDataHoje(new Date());
    }, []);

    useEffect(() => {
        async function fetchRecord() {
            if (user?.internExternalId) {
                try {
                    const data = await recordService.getMyToday(user.internExternalId);
                    setRecord(data);
                } catch (error) {
                    console.error("Erro ao buscar ponto:", error);
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchRecord();
    }, [user]);

    async function handlePunch(e: React.MouseEvent<HTMLButtonElement>) {
        if (!user?.internExternalId) return;
        
        e.currentTarget.blur();

        try {
            setLoading(true);
            const updatedRecord = await recordService.punchClock(user.internExternalId);
            setRecord(updatedRecord);
        } catch (error) {
            console.error("Erro ao registrar ponto:", error);
            alert("Houve um erro ao registrar o ponto.");
        } finally {
            setLoading(false);
        }
    }

    const formatarDataManual = (data: Date) => {
        const dia = data.getDate().toString().padStart(2, '0');
        const mesBruto = data.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');

        const mesFormatado = mesBruto.charAt(0).toUpperCase() + mesBruto.slice(1).toLowerCase();

        const ano = data.getFullYear();
        return `${dia} de ${mesFormatado}, ${ano}`;
    };

    return (
        <div className="flex flex-1 py-10 font-sans items-center">
            <Box sx={{ textAlign: 'center' }}>
                <div className="flex flex-col items-center rounded-x">
                    <p
                        className="text-zinc-600 text-4xl mb-2 font-medium"
                        style={{
                            fontFamily: 'sans-serif',
                        }}
                    >
                        {dataHoje ? formatarDataManual(dataHoje) : '...'}
                    </p>
                    <Relogio />

                    <Button
                        variant='text'
                        startIcon={<Add />}
                        sx={{
                            ":hover": {
                                bgcolor: 'transparent'
                            }
                        }}
                    >
                        Adicionar observação
                    </Button>

                    <Button
                        variant='contained'
                        onClick={(e) => handlePunch(e)}
                        disabled={ loading || isWeekend || (record?.clockIn !== '--:--' && record?.clockOut !== '--:--' && record !== null) }
                        sx={{
                            marginTop: '1.5rem',
                            backgroundColor: '#00337C',
                            borderRadius: '50px',
                            padding: '12px 40px',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            fontSize: '1rem',
                            border: 'none',
                            '&:hover': {
                                backgroundColor: '#00265d',
                            },
                            '&.Mui-disabled': {
                                backgroundColor: '#D6D9DC',
                                color: '#9FA1A3',
                            }
                        }}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : isWeekend ? (
                            'Fim de Semana'
                        ) : record?.clockIn === '--:--' || record === null ? (
                            'Registrar Entrada'
                        ) : record?.clockOut === '--:--' ? (
                            'Registrar Saída'
                        ) : (
                            'Jornada Concluída'
                        )}
                    </Button>

                    <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-sm">
                        {/* Bloco de Entrada */}
                        <div className={`flex flex-col items-center p-4 rounded-2xl border shadow-sm transition-colors ${record?.clockIn !== '--:--' && record !== null ? 'bg-green-100 border-green-200' : 'bg-zinc-50 border-zinc-200'}`}>
                            <span className={`text-xs uppercase tracking-wider font-bold mb-1 ${record?.clockIn !== '--:--' && record !== null ? 'text-green-700' : 'text-zinc-500'}`}>Entrada</span>
                            <span className={`text-xl font-mono font-semibold tracking-tight ${record?.clockIn !== '--:--' && record !== null ? 'text-zinc-800' : 'text-zinc-400'}`}>
                                {record?.clockIn || '--:--'}
                            </span>
                        </div>

                        {/* Bloco de Saída */}
                        <div className={`flex flex-col items-center p-4 rounded-2xl border shadow-sm transition-colors ${record?.clockOut !== '--:--' && record !== null ? 'bg-green-100 border-green-200' : 'bg-zinc-50 border-zinc-200'}`}>
                            <span className={`text-xs uppercase tracking-wider font-bold mb-1 ${record?.clockOut !== '--:--' && record !== null ? 'text-green-700' : 'text-zinc-500'}`}>Saída</span>
                            <span className={`text-xl font-mono font-semibold tracking-tight ${record?.clockOut !== '--:--' && record !== null ? 'text-zinc-800' : 'text-zinc-400'}`}>
                                {record?.clockOut || '--:--'}
                            </span>
                        </div>
                    </div>

                </div>
            </Box>
        </div>
    );
}