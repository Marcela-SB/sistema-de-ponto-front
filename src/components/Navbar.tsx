// NavbarLayout.jsx
import { Avatar } from '@mui/material';
import React from 'react';

const NavbarLayout = ({ children }) => {
  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        background: '#00337C',
        color: '#F4F7FA', 
        width: '100%',
        padding: '0.8rem 3rem',
        boxSizing: 'border-box',
      }}>
        <div style={{ fontWeight: '600', fontSize: '1.5rem' }}>Ponto Certo</div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>Nome Usuário</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>0123456789</span>
          </div>
          <Avatar 
            sx={{ 
              bgcolor: '#F4F7FA', 
              color: '#00337C', 
              width: 40, 
              height: 40,
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}
          >
            N
          </Avatar>
        </div>
      </nav>

      <main style={{ 
        padding: '2rem', 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {children}
      </main>
    </div>
  );
};

export default NavbarLayout;