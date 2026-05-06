import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import './App.css'
import Login from './pages/Login';
import HomeIntern from './pages/HomeIntern'
import Navbar from './components/Navbar'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import ProtectedRoute from './guards/ProtectedRoute';
import RoleRoute from './guards/RoleRoute';
import SearchInterns from './pages/SearchInterns';
import History from './pages/History';
import Management from './pages/Management';
import QueryContext from './contexts/QueryContext';
import { ROLES } from './types/perfils';
import { CircularProgress } from '@mui/material';

const LayoutWithNav = () => (
    <Navbar>
        <Outlet />
    </Navbar>
);

const HomeDispatcher = () => {
  const { user} = useAuth();
  
  if (!user?.role) return <CircularProgress />;

  const isAdminOrSupervisor = user?.role === ROLES.SUPERVISOR || user?.role === ROLES.ADMIN;
  
  return isAdminOrSupervisor ? <SearchInterns /> : <HomeIntern />;
};

const AppRoutes = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        <QueryContext>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route element={<ProtectedRoute isAllowed={isAuthenticated} />}>
                    <Route element={<LayoutWithNav />}>
                        <Route path="/home" element={<HomeDispatcher />} />
                        
                        <Route path='/history' element={<History/>} />
                        
                        <Route element={<RoleRoute user={user} requiredRoles={[ROLES.SUPERVISOR, ROLES.ADMIN]} />}>
                            <Route path="/management" element={<Management />} />
                        </Route>
                            
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </QueryContext>
    );
};


function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes /> 
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App
