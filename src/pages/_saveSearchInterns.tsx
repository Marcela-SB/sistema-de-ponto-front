import { Box, Button, Checkbox, Chip, FormControlLabel, FormGroup, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useState } from "react";

export default function SearchInterns(){
    const currentYear = new Date().getFullYear();

    const [month, setMonth] = useState(1);
    const [year, setYear] = useState(currentYear)

    const months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const years = [2026, 2024, 2025, 2023];

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Bolsista',
            flex: 2,
            minWidth: 200
        },
        // {
        //     field: 'status',
        //     headerName: '',
        //     flex: 1,
        //     minWidth: 120,
        //     align: 'right',   
        //     headerAlign: 'center',
        //     renderCell: (params) => {
        //         const status = (params.row.active === true) ? 'Ativo' :
        //             'Inativado';

        //         const colors: Record<string, "success" | "warning" | "error" | "default"> = {
        //             'Ativo': 'success',
        //             'Inativado': 'error'
        //         };

        //         return <Chip variant="outlined" label={status} color={colors[status]} />;
        //     }
        // },
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
            active: true
        },

        { 
            id: 2, 
            name: 'Maria Eduarda Santos Melo', 
            active: false
        },
        
        { 
            id: 3, 
            name: 'Bruno Costa de Lima', 
            active: true
        },
        
        { 
            id: 4, 
            name: 'Carla Dias Feijão', 
            active: false
        },
        
        { 
            id: 5, 
            name: 'João Felipe da Silva', 
            active: true
        },
    ];

    return(
        <Box className="flex flex-col w-screen px-12">
            <Typography variant="h4">
                Consultar Bolsista
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
                Veja o resumo de frequência por período
            </Typography>

            <Stack alignItems="center" spacing={2}>
                <Box p={3} border={2} borderColor={'divider'} borderRadius={1} mb={4} width={'600px'}>
                    <Stack spacing={2} alignItems="flex-start">
                        
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body1" fontWeight={'bold'}>
                                Período de referência:*
                            </Typography>

                            <Select 
                                value={month}
                                onChange={(e) => setMonth(Number(e.target.value))}
                                sx={{
                                    height: '1.8rem',
                                    width:'8rem',
                                    fontSize: '0.9rem',
                                    '& .MuiSelect-select': {
                                        py: 0.5,
                                        display: 'flex',
                                        alignItems: 'center'
                                    }
                                }}
                            >
                                {months.map((m, index) => (
                                    <MenuItem key={index} value={index + 1}>{m}</MenuItem>
                                ))}
                            </Select>

                            <Typography variant="h6">/</Typography>

                            <Select 
                                value={year}
                                onChange={(e) => setYear(Number(e.target.value))}
                                sx={{
                                    height: '1.8rem', // Mesma altura compacta
                                    width:'6rem',
                                    fontSize: '0.9rem',
                                    '& .MuiSelect-select': {
                                        py: 0.5,
                                        display: 'flex',
                                        alignItems: 'center'
                                    }
                                }}
                            >
                                {years.map((y) => (
                                    <MenuItem key={y} value={y}>{y}</MenuItem>
                                ))}
                            </Select>
                        </Box>

                        <Box sx={{ mt:"-0.01rem !important", ml:"-0.4rem !important" }}> 
                            <FormControlLabel 
                                control={
                                    <Checkbox
                                        size="small" 
                                        sx={{ 
                                            padding: '4px',
                                            color: 'text.secondary' 
                                        }} 
                                    />
                                } 
                                label="Incluir usuários Inativados" 
                                slotProps={{ 
                                    typography: { 
                                        variant:'caption',
                                        sx: { 
                                            color: 'text.secondary',
                                            userSelect: 'none' 
                                        } 
                                    } 
                                }}
                                sx={{
                                    opacity: 0.7, 
                                    '&:hover': { opacity: 1 },
                                    ml: 0 // Garante que alinhe perfeitamente à esquerda
                                }}
                            />
                        </Box>

                        <Box width="100%" display="flex" justifyContent="center">
                            <Button
                                variant="contained"
                                sx={{
                                    width: '400px',
                                    textTransform: 'none',
                                    py: 1
                                }}
                            >
                                Buscar
                            </Button>
                        </Box>
                    </Stack>
                </Box>

                <Box sx={{ height: 325, width: 600 }}>
                    <DataGrid 
                        columns={columns}
                        rows={rows}
                        autoHeight={false}
                        disableRowSelectionOnClick
                        sx={{
                            padding:'5px'
                        }}
                    />
                </Box>
            </Stack>
        </Box>
    );
}