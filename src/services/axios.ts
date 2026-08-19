import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8080', 
    timeout: 10000, // tempo limite de 10 segundos
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('@App:token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


api.interceptors.response.use(
    (response) => {
        // Se a resposta vier OK (200, 201, etc), não faz nada, só entrega os dados
        return response;
    },
    (error) => {
        // Se o servidor responder com erro (401 ou 403), o token provavelmente expirou
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            
            console.warn("Sessão expirada ou inválida. Desconectando...");
            
            localStorage.removeItem('@App:token');
            localStorage.removeItem('@App:user');
            
            window.location.href = '/login'; 
        }

        return Promise.reject(error);
    }
);

export default api;