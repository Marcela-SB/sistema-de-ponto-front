import { Search } from "@mui/icons-material";
import { Box, Button, Chip, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useMemo, useState } from "react";

export default function Management(){
    const [searchText, setSearchText] = useState('');

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Bolsista',
            flex: 2,
            minWidth: 200
        },
        {
            field: 'status',
            headerName: 'Status Hoje',
            flex: 1,
            minWidth: 120,
            align: 'center',   
            headerAlign: 'center',
            renderCell: (params) => {
                const status = (params.row.inTime && params.row.outTime) ? 'Presente' :
                    (params.row.inTime) ? 'Pendente' : 'Ausente';

                const colors: Record<string, "success" | "warning" | "error" | "default"> = {
                    'Presente': 'success',
                    'Pendente': 'warning',
                    'Ausente': 'error'
                };

                return <Chip variant="outlined" label={status} color={colors[status]} />;
            }
        },
        {
            field: 'inTime',
            headerName: 'Entrada',
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            valueFormatter: (value) => value ? value : '--:--:--'
        },
        {
            field: 'outTime',
            headerName: 'Saída',
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            valueFormatter: (value) => value ? value : '--:--:--'
        },
        {
            field: 'actions',
            headerName: 'Ações',
            flex: 1.5,
            align: 'center', 
            headerAlign: 'center',
            renderCell: () => (
                <Button sx={{ textTransform: 'none' }}>
                    Ver Frequência
                </Button>
            )
        },
    ];

    const rows = [
  { 
    id: 1, 
    name: 'Ana Silva de Medeiros', 
    inTime: '08:00:00', 
    outTime: '12:00:00' 
  }, // Status: Presente (Tem ambos)

  { 
    id: 2, 
    name: 'Maria Eduarda Santos Melo', 
    inTime: '07:32:00', 
    outTime: '11:39:00' 
  },
  
  { 
    id: 3, 
    name: 'Bruno Costa de Lima', 
    inTime: '09:15:00', 
    outTime: null 
  }, // Status: Pendente (Entrou, mas não saiu)
  
  { 
    id: 4, 
    name: 'Carla Dias Feijão', 
    inTime: null, 
    outTime: null 
  }, // Status: Ausente (Não tem horários)
  
  { 
    id: 5, 
    name: 'João Felipe da Silva', 
    inTime: null, 
    outTime: null 
  }, // Status: Ausente (Não tem horários)
    ];

    const filteredRows = useMemo(() => {
        return rows.filter((row) =>
            row.name.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [searchText, rows]);

    return(
        <div className="w-screen px-10">
            <Stack spacing={3}>
                <Box>
                    <Typography variant="h5" fontWeight={'bold'}>
                        Frequências
                    </Typography>

                    <Typography variant="body1" color="text.secondary">
                        Visualize e gerencie as frequências dos bolsistas
                    </Typography>
                </Box>

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


                <Box sx={{ height: 420, width: '100%' }}>
                    <DataGrid 
                        columns={columns}
                        rows={filteredRows}
                        autoHeight={false}
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