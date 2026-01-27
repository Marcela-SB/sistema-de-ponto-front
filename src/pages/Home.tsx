'use client'
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
    <div className="py-10 font-sans">
      <Box sx={{ textAlign: 'center' }}>
        <div className="flex flex-col items-center bg-white rounded-x">
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
            variant='contained'
            sx={{
              marginTop: '1.5rem',
              backgroundColor: '#00337C', // O azul da sua Navbar
              borderRadius: '50px',       // Deixa arredondado (pílula)
              padding: '12px 40px',       // Tamanho do botão
              fontWeight: 'bold',
              textTransform: 'none',      // Evita que o texto fique todo em maiúsculo
              fontSize: '1rem',
              border:'none',
              '&:hover': {
                backgroundColor: '#00265d',
              }
            }}
          >
            Registrar Ponto
          </Button>
        </div>
      </Box>
    </div>
  );
}