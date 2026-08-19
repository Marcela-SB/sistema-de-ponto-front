import { Dialog, DialogTitle, Typography, Stack, DialogContent, DialogActions, Tooltip, IconButton, TextField } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { OBS_LABELS, OBS_TYPE, type Observation, type ObservationType } from "../types/registers";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ROLES } from "../types/perfils";
import { Cancel, Close } from "@mui/icons-material";

interface ObsProps {
    open: boolean;
    onClose: () => void;
    recordExternalId: string;
    selectedObs: Observation;
    date: string;
    onSave: (externalId: string, type:ObservationType, newText: string) => void;
    onDelete: (id: string) => void;
}


export default function ObservationModal({ 
    open, onClose, recordExternalId, selectedObs, date, onSave, onDelete 
}:ObsProps) {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState("");

    useEffect(() => {
        if(selectedObs) {
            setEditText(selectedObs.text || "");
            setIsEditing(!selectedObs.externalId);
        }
    }, [selectedObs]);

    if (!selectedObs) return null;

    const canEdit = (
        (user?.role === ROLES.INTERN && selectedObs.type === OBS_TYPE.INTERN) ||
        (user?.role === ROLES.SUPERVISOR && selectedObs.type === OBS_TYPE.SUPERVISOR) ||
        (user?.role === ROLES.ADMIN && selectedObs.type === OBS_TYPE.SUPERVISOR)
    );

    const handleSave = () => {
        onSave?.(recordExternalId, selectedObs.type, editText);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditText(selectedObs.text);
        setIsEditing(false);
    };

    const handleDelete = () => {
        if(selectedObs.externalId){
            onDelete(selectedObs.externalId);
            onClose();
        }
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ bgcolor: '#f8f9fa', borderBottom: '1px solid #eee' }} component={"div"}>
                <Typography variant="h6"  fontWeight="bold" textAlign={'center'}>
                    Dia {date ? date : ''}
                </Typography>
                
                <IconButton onClick={onClose} sx={{ position:'absolute', right: 20, top: 10 }}>
                    <Close />
                </IconButton>

                <Stack 
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ width: '100%' }}
                >
                    <Typography variant="caption">
                        Autor: {selectedObs?.type ? OBS_LABELS[selectedObs.type] : ''}
                    </Typography>
                    {selectedObs?.lastUpdate && (
                        <Typography variant="caption" sx={{fontStyle: 'italic', textAlign:'right'}}>
                            Última modificação: {selectedObs.lastUpdate}
                        </Typography>
                    )}
                </Stack>
            </DialogTitle>

            <DialogContent sx={{ mt:2 }}>
                {isEditing ? (
                    <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        variant="outlined"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        autoFocus
                    />
                ) : (
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: 'text.primary' }}>
                        {selectedObs?.text}
                    </Typography>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 2, py: 0.5 }}>
                <Stack width={'100%'} flexDirection="row" spacing={1} justifyContent={'space-between'}>
                    {isEditing ? (
                        <>
                            {selectedObs.externalId && 
                                <Tooltip title="Cancelar">
                                    <IconButton color="inherit" onClick={handleCancel}>
                                        <Cancel />
                                    </IconButton>
                                </Tooltip>
                            }

                            <Tooltip title="Salvar">
                                <IconButton color="success" onClick={handleSave}>
                                    <SaveIcon />
                                </IconButton>
                            </Tooltip>
                        </>
                    ) : (
                        <>
                            {canEdit &&
                            <>
                                <Tooltip title="Excluir">
                                    <IconButton 
                                        color="error" 
                                        onClick={() => window.confirm("Excluir?") && handleDelete()}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Editar">
                                    <IconButton color="primary" onClick={() => setIsEditing(true)}>
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                            </>
                            }
                        </>
                    )}
                </Stack>
            </DialogActions>
        </Dialog>
    );
}