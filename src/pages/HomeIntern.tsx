'use client'
import { Add, Visibility } from '@mui/icons-material';
import Relogio from '../components/Relogio';
import { Box, Button, CircularProgress, IconButton, Stack, TextareaAutosize, TextField, Tooltip } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import CommentIcon from '@mui/icons-material/Comment';
import AddCommentIcon from '@mui/icons-material/AddComment';
import { useEffect, useState } from "react";
import { useAuth } from '../contexts/AuthContext';
import { createEmptyObservation, OBS_TYPE, type Observation, type ObservationType, type TimeRecord } from '../types/registers';
import { recordService } from '../services/recordService';
import { ROLES } from '../types/perfils';
import ObservationModal from '../components/ObservationModal';
import { observationService } from '../services/observationService';
import { useTodayRecord } from '../hooks/useRecords';
import { useQueryClient } from '@tanstack/react-query';

export default function HomeIntern() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { data: record, isLoading: queryLoading } = useTodayRecord(user?.internExternalId);
    const [dataHoje, setDataHoje] = useState<Date | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const loading = queryLoading || actionLoading;
    const isWeekend = dataHoje ? (dataHoje.getDay() === 0 || dataHoje.getDay() === 6) : false;

    useEffect(() => {
        setDataHoje(new Date());
    }, []);

    async function handlePunch(e: React.MouseEvent<HTMLButtonElement>) {
        const internExternalId = user?.internExternalId;
        if (!internExternalId) return;
        
        e.currentTarget.blur();

        if (!navigator.geolocation) {
            alert("Geolocalização não suportada pelo seu navegador.");
            return;
        }

        setActionLoading(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    await recordService.punchClock(internExternalId, latitude, longitude);
                    queryClient.invalidateQueries({ queryKey: ['todayRecord'] });
                } catch (error: any) {
                    const message = error.response.data.message || "Erro ao registrar ponto.";
                    alert(message);
                } finally {
                    setActionLoading(false);
                }
            },
            (error) => {
                setActionLoading(false);
                alert("Você precisa permitir a localização para bater o ponto.");
            },
            { enableHighAccuracy: true }
        );
    }

    const formatarDataManual = (data: Date) => {
        const dia = data.getDate().toString().padStart(2, '0');
        const mesBruto = data.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');

        const mesFormatado = mesBruto.charAt(0).toUpperCase() + mesBruto.slice(1).toLowerCase();

        const ano = data.getFullYear();
        return `${dia} de ${mesFormatado}, ${ano}`;
    };

    const [modalOpen, setModalOpen] = useState(false);
    const [activeData, setActiveData] = useState<{recordExternalId: string,  obs: Observation, date: string } | null>(null);

    const handleOpenObs = (recordExternalId: string, obs: Observation, date: string) => {
        setActiveData({ recordExternalId,  obs, date });
        setModalOpen(true);
    };

    const handleSaveObs = async (recordExternalId: string, type: ObservationType, text: string) => {
        try {
            const updatedObs = await observationService.upsertObs(recordExternalId, type, text);
            queryClient.invalidateQueries({ queryKey: ['todayRecord'] });
            setActiveData(prev => prev ? { ...prev, obs: updatedObs } : null);
        } catch (error) {
            alert("Erro ao salvar observação");
        }
    }

    const handleDeleteObs = async (externalId: string) => {
        try {
            await observationService.delete(externalId);
            queryClient.invalidateQueries({ queryKey: ['todayRecord'] });
            handleClose();
        } catch (error) {
            alert("Erro ao deletar observação");
        }
    }

    const handleClose = () => {
        setModalOpen(false);
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
                    
                    {record &&
                    <>
                        {/* <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" paddingTop={2} sx={{ height: '100%' }}>
                            <Tooltip title="Obs. Bolsista" arrow>
                                <span>
                                    <IconButton
                                        size="small"
                                        disabled={!record.internObservation && user?.role !== ROLES.INTERN}
                                        onClick={() => handleOpenObs(
                                            record.externalId,
                                            record.internObservation ||
                                            createEmptyObservation( 
                                                record.externalId, 
                                                OBS_TYPE.INTERN
                                            ),
                                            record.recordDate
                                        )}
                                    >
                                        {record.internObservation ? 
                                            <CommentIcon color="primary" /> 
                                        : 
                                            <AddCommentIcon sx={{ 
                                                color: user?.role === ROLES.INTERN ? '#ccc' : 'transparent' 
                                            }} />
                                        }
                                    </IconButton>
                                </span>
                            </Tooltip>

                            <span> | </span>

                            <Tooltip title="Obs. Supervisor" disableHoverListener={!record.supervisorObservation} arrow>
                                <span>
                                    <IconButton
                                        size="small"
                                        disabled={!record.supervisorObservation && (user?.role !== ROLES.SUPERVISOR && user?.role !== ROLES.ADMIN)}
                                        onClick={() => handleOpenObs(
                                            record.externalId,
                                            record.supervisorObservation ||
                                            createEmptyObservation( 
                                                record.externalId, 
                                                OBS_TYPE.SUPERVISOR
                                            ),
                                            record.recordDate
                                        )}
                                    >
                                        {record.supervisorObservation ? 
                                            <CommentIcon color="secondary" /> 
                                        : 
                                            <AddCommentIcon sx={{ 
                                                color: (user?.role === ROLES.SUPERVISOR || user?.role === ROLES.ADMIN) ? '#ccc' : 'transparent' 
                                            }} />
                                        }
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Stack> */
                        //<TextField aria-readonly value={record.internObservation?.text} draggable={false}/>
                        }
                        <Button
                            variant='text'
                            startIcon={record.internObservation ?<Visibility /> : <Add />}
                            sx={{
                                pt: 2,
                                ":hover": {
                                    bgcolor: 'transparent'
                                }
                            }}
                            onClick={() => handleOpenObs(
                                record.externalId,
                                record.internObservation ||
                                createEmptyObservation( 
                                    record.externalId, 
                                    OBS_TYPE.INTERN
                                ),
                                record.recordDate
                            )}
                        >
                            {record.internObservation ? "Visualizar" : "Adicionar"} observação
                        </Button>
                    </>}

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


                    <ObservationModal 
                        open={modalOpen}
                        onClose={handleClose}
                        recordExternalId={activeData?.recordExternalId as string}  
                        selectedObs={activeData?.obs as Observation}
                        date={activeData?.date || ''}
                        onSave={handleSaveObs}
                        onDelete={handleDeleteObs}
                    />

                </div>
            </Box>
        </div>
    );
    
}