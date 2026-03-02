import { Search } from "@mui/icons-material";
import { Box, Button, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import Tooltip from '@mui/material/Tooltip';
import type { Intern } from "../types/perfils";
import { useAuth } from "../contexts/AuthContext";
import { internService } from "../services/internService";

export default function Management(){
    const [searchText, setSearchText] = useState('');
    const [interns, setInterns] = useState<Intern[] | []>([]);
    const { user } = useAuth();

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Bolsista',
            flex: 2,
            minWidth: 200,
            valueFormatter: (_, row) => row.user.name
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            valueFormatter: (_, row) => row.user.email
        },
        {
            field: 'cpf',
            headerName: 'CPF',
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            valueFormatter: (_, row) => row.user.cpf || '000.000.000-00'
        },
        {
            field: 'enrollmentNumber',
            headerName: 'Matrícula',
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            valueFormatter: (value) => value ? value : ''
        },
        {
            field: 'actions',
            headerName: 'Ações',
            flex: 1,
            align: 'center', 
            headerAlign: 'center',
            sortable: false,
            renderCell: () => (
                <>
                    <Tooltip title="Deletar" arrow>
                        <IconButton color="error" size="small">
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Editar" arrow>
                        <IconButton color="info" size="small">
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                </>
            )
        },
    ];

    useEffect(() => {
            async function loadInterns() {
                if (user?.externalId) {
                    try {
                        const data = await internService.getMyInterns(user.externalId);
                        setInterns(data);
                    } catch (error) {
                        console.error("Erro ao carregar bolsistas:", error);
                    }
                }
            }
            loadInterns();
        }, [user?.externalId]);

    const filteredRows = useMemo(() => {
        return interns.filter((intern) =>
            intern.user?.name.toLowerCase().includes(searchText.toLowerCase())
        );
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
                    >
                        Novo Bolsista
                    </Button>
                </Box>



                <Box sx={{ height: 410, width: '100%' }}>
                    <DataGrid 
                        columns={columns}
                        rows={filteredRows}
                        getRowId={(row) => row.externalId}
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
        </div>
    );
}