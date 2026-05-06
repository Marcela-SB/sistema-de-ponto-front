import { Avatar, Divider, IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { useState, type ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Logout } from '@mui/icons-material';
import { ROLE_LABELS, ROLES } from '../types/perfils';
import { recordService } from '../services/recordService';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  children: ReactNode;
}

const Navbar = ({ children }: NavbarProps) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRecords = () => {
    navigate("/history", { state: null }); 
  };

  const handleLogout = () => {
    handleClose();
    signOut();
  };

  const getInitial = (name:string) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

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
        zIndex: 100
      }}>
        <div style={{ fontWeight: '600', fontSize: '1.5rem' }}>Ponto Certo</div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>
              {user ? user.name : '...'}
            </span>
            <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>
              {user ? ROLE_LABELS[user.role] : '...'}
            </span>
          </div>
          <IconButton
            onClick={handleClick}
            size="small"
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
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
              {user ? getInitial(user.name) : '?'}
            </Avatar>
          </IconButton>
        </div>

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            elevation: 3,
            sx: {
              mt: 1.5,
              minWidth: 150,
              '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1 },
            },
          }}
        >
          <MenuItem onClick={() => navigate("/home")}>
            Home
          </MenuItem>
          {/* <MenuItem onClick={handleClose}>
            Meu Perfil
          </MenuItem> */}

          {user?.role === ROLES.INTERN && (
            <MenuItem onClick={handleRecords}>
              Frequências
            </MenuItem>
          )}

          {[ROLES.SUPERVISOR, ROLES.ADMIN].includes(user?.role as any) && (
            <MenuItem onClick={() => navigate("/management")}>
              Meus bolsistas
            </MenuItem>
          )}
          {/* {[ROLES.SUPERVISOR, ROLES.ADMIN].includes(user?.role as any) && (
            <MenuItem onClick={handleClose}>
              Frequências de hoje
            </MenuItem>
          )}

          {user?.role === ROLES.ADMIN && (
            <MenuItem onClick={handleClose}>
              Gerenciar Usuários
            </MenuItem>
          )} */}

          <Divider />
          
          <MenuItem onClick={handleLogout} sx={{ color: '#d32f2f' }}>
            <ListItemIcon>
              <Logout fontSize="small" sx={{ color: '#d32f2f' }} />
            </ListItemIcon>
            Sair
          </MenuItem>
        </Menu>
      </nav>

      <main style={{ 
        padding: '2rem', 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%', 
        boxSizing: 'border-box', 
        overflow: 'hidden'
      }}>
        {children}
      </main>
    </div>
  );
};

export default Navbar;