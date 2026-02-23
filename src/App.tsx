import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import './App.css'
import Login from './pages/Login';
import HomeIntern from './pages/HomeIntern'
import Navbar from './components/Navbar'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import ProtectedRoute from './guards/ProtectedRoute';

const LayoutWithNav = () => (
    <Navbar>
        <Outlet />
    </Navbar>
);

const AppRoutes = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute isAllowed={isAuthenticated} />}>
                <Route element={<LayoutWithNav />}>
                    <Route path="/home" element={<HomeIntern />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
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
