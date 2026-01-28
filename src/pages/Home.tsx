'use client'
import { Add } from '@mui/icons-material';
import Relogio from '../components/Relogio';
import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";

export default function Home() {
  const [dataHoje, setDataHoje] = useState<Date | null>(null);

  useEffect(() => {
    setDataHoje(new Date());
  }, []);

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
              ":hover":{
                bgcolor: 'transparent'
              }
            }}
          >
            Adicionar observação
          </Button>
              
          <Button
            variant='contained'
            sx={{
              marginTop: '1.5rem',
              backgroundColor: '#00337C',
              borderRadius: '50px',
              padding: '12px 40px',
              fontWeight: 'bold',
              textTransform: 'none',
              fontSize: '1rem',
              border:'none',
              '&:hover': {
                backgroundColor: '#00265d',
              }
            }}
          >
            Registrar Ponto
          </Button>

          <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-sm">
            <div className="flex flex-col items-center p-4 bg-green-100 rounded-2xl border border-green-100 shadow-sm">
              <span className="text-green-700 text-xs uppercase tracking-wider font-bold mb-1">Entrada</span>
              <span className="text-zinc-800 text-xl font-mono font-semibold tracking-tight">07:12:39</span>
            </div>

            <div className="flex flex-col items-center p-4 bg-zinc-50 rounded-2xl border border-zinc-200 shadow-sm">
              <span className="text-zinc-500 text-xs uppercase tracking-wider font-bold mb-1">Saída</span>
              <span className="text-zinc-400 text-xl font-mono font-semibold tracking-tight">--:--:--</span>
            </div>
          </div>

        </div>
      </Box>
    </div>
  );
}