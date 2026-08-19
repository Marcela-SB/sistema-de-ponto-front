import React, { useMemo, useState, useEffect } from 'react'; // ALTERADO: import useEffect
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Box, Typography, Stack, Chip, Tooltip, IconButton } from "@mui/material";
import { format, isSaturday, isSunday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { createEmptyObservation, OBS_TYPE, type Observation, type ObservationType, type TimeRecord } from "../types/registers";
import { generateCalendarDays } from '../utils/generateCalendarDays';
import CommentIcon from '@mui/icons-material/Comment';
import AddCommentIcon from '@mui/icons-material/AddComment';
import ObservationModal from './ObservationModal';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../types/perfils';
import { observationService } from '../services/observationService';
import { capitalize } from '../utils/captalize';

interface Props {
    records: TimeRecord[];
    startDate: string;
    endDate: string;
}

const TimeRecordTable: React.FC<Props> = ({ records, startDate, endDate}) => {
    const { user } = useAuth();
    const today = format(new Date(), 'yyyy-MM-dd');

    // ALTERADO: Criado estado local para que o React "perceba" a mudança dos dados
    const [localRecords, setLocalRecords] = useState<TimeRecord[]>(records);

    // ALTERADO: Sincroniza o estado local quando a prop 'records' mudar (ex: filtros)
    useEffect(() => {
        setLocalRecords(records);
    }, [records]);

    const [modalOpen, setModalOpen] = useState(false);
    const [activeData, setActiveData] = useState<{recordExternalId: string,  obs: Observation, date: string } | null>(null);

    const handleOpenObs = (recordExternalId: string, obs: Observation, date: string) => {
        setActiveData({ recordExternalId,  obs, date });
        setModalOpen(true);
    };

    const handleSaveObs = async (recordExternalId: string, type: ObservationType, text: string) => {
        try {
            const updatedObs = await observationService.upsertObs(recordExternalId, type, text);

            // ALTERADO: Atualiza o registro específico dentro do estado local
            setLocalRecords(prev => prev.map(record => {
                if (record.externalId === recordExternalId) {
                    return {
                        ...record,
                        [type === OBS_TYPE.INTERN ? 'internObservation' : 'supervisorObservation']: updatedObs
                    };
                }
                return record;
            }));

            setActiveData(prev => prev ? { ...prev, obs: updatedObs } : null);

        } catch (error) {
            alert("Erro ao salvar observação");
        }
    }

    const handleDeleteObs = async (externalId: string) => {
        try {
            await observationService.delete(externalId);

            setLocalRecords(prev => prev.map(record => {
                if (record.internObservation?.externalId === externalId) {
                    return { ...record, internObservation: null };
                }
                if (record.supervisorObservation?.externalId === externalId) {
                    return { ...record, supervisorObservation: null };
                }
                return record;
            }));
            
            handleClose();
        } catch (error) {
            alert("Erro ao deletar observação");
        }
    }

    const handleClose = () => {
        setModalOpen(false);
    };

    const rows = useMemo(() => {
        const allDays = generateCalendarDays(startDate, endDate);
        return allDays.map((day) => {
            const dateStrISO = format(day, 'yyyy-MM-dd');
            const dateStrBR = format(day, 'dd/MM/yyyy');
            
            // ALTERADO: Agora busca os dados do estado reativo 'localRecords'
            const record = localRecords.find(r => r.recordDate === dateStrBR);

            return {
                id: dateStrISO,
                externalId: record?.externalId,
                recordDate: dateStrBR, 
                clockIn: record?.clockIn || null,
                clockOut: record?.clockOut || null,
                totalHours: record?.totalHours || null,
                internObservation: record?.internObservation || null,
                supervisorObservation: record?.supervisorObservation || null,
                isWeekend: isSaturday(day) || isSunday(day),
                dayOfWeek: format(day, 'EEEE', { locale: ptBR })
            };
        });
    }, [localRecords, startDate, endDate]); // ALTERADO: Dependência mudou para localRecords

    const columns: GridColDef[] = [
        {
            field: 'recordDate',
            headerName: 'Data',
            flex: 1.2,
            align: 'center',
            headerAlign: 'center',
            sortable: true,
            renderCell: (params) => <>{params.value}</>
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            renderCell: (params) => {
                if (params.row.isWeekend) {
                    return <Typography variant="caption" color="text.disabled">
                        {capitalize(params.row.dayOfWeek)}
                    </Typography>;
                }

                const { id, clockIn, clockOut } = params.row;

                if (clockIn && clockOut && clockIn !== "--:--" && clockOut !== "--:--") {
                    return <Chip size="small" label="Presente" color="success" variant="outlined" />;
                }
                if (clockIn && clockIn !== "--:--") {
                    return <Chip size="small" label="Pendente" color="warning" variant="outlined" />;
                }
                if (id > today) {
                    return <Typography variant="caption">-</Typography>;
                }
                return <Chip size="small" label="Falta" color="error" variant="outlined" />;
            }
        },
        { 
            field: 'clockIn', 
            headerName: 'Entrada', 
            flex: 1, align: 'center', 
            headerAlign: 'center', 
            sortable: false, 
            renderCell: (p) => p.value || '--:--' 
        },
        { 
            field: 'clockOut', 
            headerName: 'Saída', 
            flex: 1, align: 'center', 
            headerAlign: 'center', 
            sortable: false, 
            renderCell: (p) => p.value || '--:--' 
        },
        { 
            field: 'totalHours', 
            headerName: 'Horas totais', 
            flex: 1, align: 'center', 
            headerAlign: 'center', 
            sortable: false, 
            renderCell: (p) => p.value ? <strong>{p.value}</strong> : <strong>--:--</strong>
        },
        {
            field: 'observations',
            headerName: 'Observações',
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            renderCell: (params) => {
            const { clockIn, isWeekend, internObservation, supervisorObservation, externalId, recordDate } = params.row;
        
            const hasRecord = !!clockIn && clockIn !== "--:--";
                return (
                    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
                        {!hasRecord || isWeekend ? '|' : 
                            <>
                                <Tooltip title="Obs. Bolsista" disableHoverListener={!internObservation} arrow>
                                    <span>
                                        <IconButton
                                            size="small"
                                            disabled={!internObservation && user?.role !== ROLES.INTERN}
                                            onClick={() => handleOpenObs(
                                                externalId,
                                                internObservation ||
                                                createEmptyObservation( 
                                                    externalId, 
                                                    OBS_TYPE.INTERN
                                                ),
                                                recordDate
                                            )}
                                        >
                                            {internObservation ? 
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

                                <Tooltip title="Obs. Supervisor" disableHoverListener={!supervisorObservation} arrow>
                                    <span>
                                        <IconButton
                                            size="small"
                                            disabled={!supervisorObservation && (user?.role !== ROLES.SUPERVISOR && user?.role !== ROLES.ADMIN)}
                                            onClick={() => handleOpenObs(
                                                externalId,
                                                supervisorObservation ||
                                                createEmptyObservation( 
                                                    externalId, 
                                                    OBS_TYPE.SUPERVISOR
                                                ),
                                                recordDate
                                            )}
                                        >
                                            {supervisorObservation ? 
                                                <CommentIcon color="secondary" /> 
                                            : 
                                                <AddCommentIcon sx={{ 
                                                    color: (user?.role === ROLES.SUPERVISOR || user?.role === ROLES.ADMIN) ? '#ccc' : 'transparent' 
                                                }} />
                                            }
                                        </IconButton>
                                    </span>
                                </Tooltip>
                            </>
                        }
                    </Stack>
                );
            }
        },
    ];

    return (
        <Box sx={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column'}}>
            <DataGrid
                rows={rows}
                columns={columns}
                disableRowSelectionOnClick
                disableColumnMenu
                hideFooter
                getRowClassName={(params) => {
                    const classes = [];
                    if (params.row.isWeekend) classes.push('weekend-row');
                    if (params.id === format(new Date(), 'yyyy-MM-dd')) {
                        classes.push('today-row');
                    }
                    return classes.join(' ');
                }}
                sx={{
                    '& .weekend-row': { backgroundColor: '#fafafa', color: '#9e9e9e' },
                    '& .today-row': { 
                        backgroundColor: '#e3f2fd',
                        fontWeight: '500',
                        '&:hover': {
                            backgroundColor: '#bbdefb',
                        },
                    },
                    border: '1px solid #eee'
                }}
            />

            <ObservationModal 
                open={modalOpen}
                onClose={handleClose}
                recordExternalId={activeData?.recordExternalId as string}  
                selectedObs={activeData?.obs as Observation}
                date={activeData?.date || ''}
                onSave={handleSaveObs}
                onDelete={handleDeleteObs}
            />
        </Box>
    );
};

export default TimeRecordTable;