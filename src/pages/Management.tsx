import { Search } from "@mui/icons-material";
import { Box, Button, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import type { Intern } from "../types/perfils";
import { useAuth } from "../contexts/AuthContext";
import InternEditModal from "../components/InternEditModal";
import { useMyInterns } from "../hooks/useInterns";
import { useQueryClient } from "@tanstack/react-query";
import { userService } from "../services/userService";

export default function Management(){
    const queryClient = useQueryClient();
    const [searchText, setSearchText] = useState('');
    const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useAuth();

    const { data: interns = [], isLoading } = useMyInterns(user?.externalId);

    const refreshInterns = () => {
        queryClient.invalidateQueries({ queryKey: ['myInterns', user?.externalId] });
    };

    const handleAdd = () => {
        setSelectedIntern(null);
        setIsModalOpen(true);
    };

    const handleEdit = (intern: Intern) => {
        setSelectedIntern(intern);
        setIsModalOpen(true);
    }

    const handleSave = () =>{
        refreshInterns();
    }

    const handleDelete = async (userExternalId: string) => {
        if (confirm("Deseja realmente desativar este bolsista?")) {
            try {
                await userService.delete(userExternalId);
                refreshInterns(); 
            } catch (error) {
                alert("Não foi possível desativar o bolsista.");
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Bolsista',
            flex: 2,
            minWidth: 200,
            valueGetter: (_, row) => row.user?.name || '',
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            valueGetter: (_, row) => row.user.email
        },
        {
            field: 'cpf',
            headerName: 'CPF',
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            valueGetter: (_, row) => row.user.cpf || '000.000.000-00'
        },
        {
            field: 'enrollmentNumber',
            headerName: 'Matrícula',
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            valueGetter: (value) => value ? value : ''
        },
        {
            field: 'actions',
            headerName: 'Ações',
            flex: 1,
            align: 'center', 
            headerAlign: 'center',
            sortable: false,
            renderCell: (params) => (
                <>
                    <IconButton color="error" size="small" aria-label="deletar bolsista" onClick={() => handleDelete(params.row.user.externalId)}>
                        <DeleteIcon />
                    </IconButton>

                    <IconButton color="info" size="small" aria-label="editar bolsista" onClick={() => handleEdit(params.row)}>
                        <EditIcon />
                    </IconButton>
                </>
            )
        },
    ];

    const filteredRows = useMemo(() => {
        return interns.filter((intern) => {
            // Verifica se o nome coincide com a busca
            const matchesSearch = intern.user?.name.toLowerCase().includes(searchText.toLowerCase());
            
            // Verifica se o bolsista está ativo
            const isActive = intern.user?.active === true;

            return matchesSearch && isActive;
        });
    }, [searchText, interns]);

    return(
        <div className="w-screen px-10">
            <Stack spacing={3}>
                <Box>
                    <Typography variant="h5" fontWeight={'bold'}>
                        Meus Bolsistas
                    </Typography>

                    <Typography variant="body1" color="text.secondary">
                        Visualize e gerencie os bolsistas
                    </Typography>
                </Box>

                <Box display={'flex'} justifyContent={'space-between'}>
                    <TextField 
                        variant="outlined"
                        type="text"
                        placeholder="Buscar bolsistas..."
                        size="small"
                        value={searchText}
                        onChange={(e)=> setSearchText(e.target.value)}
                        slotProps={{
                            input:{
                                startAdornment:(
                                    <InputAdornment position='start'>
                                        <Search />
                                    </InputAdornment>
                                )
                            }
                        }}
                        sx={{
                            width: '100%',
                            maxWidth: 400,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '10px', 
                                paddingLeft: '15px',
                            },
                        }}
                    />

                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<AddIcon />}
                        onClick={handleAdd}
                    >
                        Novo Bolsista
                    </Button>
                </Box>



                <Box sx={{ height: 410, width: '100%' }}>
                    <DataGrid 
                        columns={columns}
                        rows={filteredRows}
                        getRowId={(row) => row.externalId}
                        loading={isLoading}
                        autoHeight={false}
                        disableColumnMenu
                        hideFooter
                        disableRowSelectionOnClick
                        sx={{
                            padding:'5px'
                        }}
                    />
                </Box>
            </Stack>

            <InternEditModal 
                open={isModalOpen}
                intern={selectedIntern} 
                onClose={handleCloseModal}
                onSave={handleSave} />
        </div>
    );
}