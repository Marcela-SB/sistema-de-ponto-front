'use client';

import { useState, useEffect } from 'react';

export default function Relogio() {
  const [hora, setHora] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      const agora = new Date();
      setHora(agora.toLocaleTimeString('pt-BR'));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
      <p className="text-8xl text-slate-800 mt-2 tabular-nums" 
        style={{
          fontFamily: '"Geist Mono", sans-serif',
        }}>
        {hora || '--:--:--'}
      </p>
  );
}