import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { ROLES, type Intern } from "../types/perfils";
import { useEffect, useState } from "react";
import { useDepartment } from "../hooks/useDepartment";
import { Close } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { internService, type InternCreateRequest } from "../services/internService";

interface InternModalProps {
    open: boolean;
    intern?: Intern | null;
    onClose: () => void;
    onSave: () => void;
}

export default function InternEditModal( { open, intern, onClose, onSave }:InternModalProps ) {
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [enrollmentNumber, setEnrollmentNumber] = useState('');
    const {data: avaliableDepartments} = useDepartment();
    const [departmentId, setDepartmentId] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const clearFields = () => {
        setName('');
        setCpf('');
        setEmail('');
        setEnrollmentNumber('');
        setDepartmentId('');
    }

    useEffect(() => {
        if(open && intern && avaliableDepartments) {
            setName(intern.user.name);
            setCpf(intern.user.cpf);
            setEmail(intern.user.email);
            setEnrollmentNumber(intern.enrollmentNumber);

            const foundDept = avaliableDepartments.find((d) => d.name === intern.user.department);

            setDepartmentId(foundDept ? foundDept.externalId : "");
        }
        else {
            clearFields();
        }
    }, [open, intern, avaliableDepartments])

    const handleUpsert = async () => {
        const upsertIntern: InternCreateRequest = {
            user: {
                name: name,
                cpf: cpf,
                email: email,
                role: ROLES.INTERN,
                departmentExternalId: departmentId,
            },
            enrollmentNumber: enrollmentNumber,
            supervisorExternalId: user!.externalId,
        };

        try {
            setIsLoading(true)
            if (intern) {
                await internService.update(intern.externalId,upsertIntern);
            }
            else {
                await internService.create(upsertIntern);
            }
            setIsLoading(false);
            onSave();
            onClose();
        } catch (error) {
            setIsLoading(false);
            const action = intern ? "editar" : "criar";
            alert("Não foi possível "+ action +" o bolsista")
        }
    }

    return(
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle display={'flex'} justifyContent={'space-between'}>
                {intern ? 'Editando' : 'Novo'} Bolsista

                <IconButton onClick={onClose}>
                    <Close />
                </IconButton>
            </DialogTitle>


            <DialogContent>
                <Stack display={'flex'} flexDirection={'column'} gap={3} mt={1}>
                    <TextField
                        label='Nome'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                    />
                    <TextField
                        label='Cpf'
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        type="text"
                    />
                    <TextField
                        label='E-mail'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                    />
                    <TextField
                        label='Matrícula'
                        value={enrollmentNumber}
                        onChange={(e) => setEnrollmentNumber(e.target.value)}
                        type="text"
                    />

                    <FormControl fullWidth>
                        <InputLabel id="dept-select-label">Departamento</InputLabel>
                        <Select
                            labelId="dept-select-label"
                            label="Departamento"
                            value={departmentId}
                            onChange={(e) => setDepartmentId(e.target.value)}
                        >
                            <MenuItem value="">
                                <em>Sem departamento</em>
                            </MenuItem>

                            <Divider sx={{ my: 1 }} />
                            
                            {[...(avaliableDepartments || [])]
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((dept) => (
                                    <MenuItem key={dept.externalId} value={dept.externalId}>
                                        {dept.name}
                                    </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
            </DialogContent>

            <DialogActions sx={{pb: 3, pr:3}}>
                <Button variant="contained" onClick={onClose} color="inherit">
                    Cancelar
                </Button>
                <Button variant="contained" onClick={handleUpsert}>
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    );
}