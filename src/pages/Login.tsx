import { AccessTime, Login, Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, Card, CardContent, CircularProgress, Container, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage(){
    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { signIn } = useAuth();
    const navigate = useNavigate(); 

    const formatCPF = (value: string) => {
        return value
            .replace(/\D/g, '') // Remove tudo que não é número
            .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto após os 3 primeiros números
            .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto após os 6 primeiros números
            .replace(/(\d{3})(\d{1,2})/, '$1-$2') // Coloca hífen após os 9 primeiros números
            .replace(/(-\d{2})\d+?$/, '$1'); // Limita em 11 números
    };

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, '');
        if (rawValue.length <= 11) {
            setCpf(rawValue); 
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            await signIn({ cpf, password });
            navigate('/home');
        } catch (error) {
            alert("Usuário ou senha inválidos!");
        } finally {
            setIsLoading(false);
        }
        
    };

    return(
        <Container maxWidth='sm' sx={{ height: '100vh', display: 'flex', alignItems: 'center', width:'525px'}}>
            <Stack spacing={4} width={'100%'} p={2}>
                <Box 
                    display='flex' 
                    flexDirection='column' 
                    gap={2}
                    alignItems={'center'}
                > 
                    <Box 
                        bgcolor='#003D7C' 
                        color='white' 
                        borderRadius={4}
                        p={2.5}
                        display='inline-flex'
                        alignItems='center'
                        justifyContent='center'
                        width='fit-content'
                    >
                        <AccessTime />
                    </Box>

                    <Box
                        display='flex'
                        flexDirection='column'
                        alignItems={'center'}
                    >
                        <Typography variant='h4' fontWeight='bold'>
                            Ponto Certo
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            Sistema de Controle de Frequência
                        </Typography>
                    </Box>
                    
                </Box>
                <Card sx={{ width: '100%', boxShadow: 3, borderRadius: 2, bgcolor:'#FBFCFE'}}>
                    <CardContent sx={{ p: 4 }}>
                        <Stack spacing={4}>
                            <Box>
                                <Typography variant='h5' fontWeight='bold' gutterBottom>
                                    Entrar
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Digite suas credenciais para acessar o sistema
                                </Typography>
                            </Box>


                            <Box component='form' onSubmit={handleSubmit}>
                                <Stack spacing={3}>
                                    <TextField
                                        required
                                        fullWidth
                                        label='CPF'
                                        variant='outlined'
                                        type='text'
                                        placeholder='000.000.000-00'
                                        value={formatCPF(cpf)}
                                        onChange={handleCpfChange}
                                    />

                                    <TextField
                                        required
                                        fullWidth
                                        label='Senha'
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        slotProps={{
                                                input: {
                                                    endAdornment: (
                                                        <InputAdornment position='end'>
                                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge='end'>
                                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                },
                                            }}
                                    />

                                    <Button
                                        type='submit'
                                        variant='contained'
                                        size='large'
                                        disabled={isLoading}
                                        sx={{
                                            backgroundColor: '#00337C',
                                            height: '50px',
                                            textTransform: 'none',
                                            fontSize: '1.1rem',
                                            '&:hover': { backgroundColor: '#00265e' }
                                        }}
                                    >
                                        {isLoading ? (
                                            <CircularProgress size={24} color='inherit' />
                                        ) : (
                                            <Stack direction='row' spacing={1} alignItems='center'>
                                                <Login />
                                                <span>Entrar</span>
                                            </Stack>
                                        )}
                                    </Button>
                                </Stack>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>
        </Container>
    );
}