import { AccessTime, Login, Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, Card, CardContent, CircularProgress, Container, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';

export default function LoginPage(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Lógica de login
        
        console.log({ email, password });
        setIsLoading(false);
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
                                        label='E-mail'
                                        variant='outlined'
                                        type='email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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