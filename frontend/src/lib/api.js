import axios from 'axios';

// TODO: En producción, esta URL debe apuntar al Load Balancer / API Gateway del backend
// No hardcodear URLs. Usar únicamente variables de entorno.
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Esto es clave: permite enviar y recibir cookies HttpOnly
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si recibimos un 401 y estamos en el navegador, emitiremos un evento custom o 
    // dejaremos que el AuthContext maneje la redirección al fallar la petición de me()
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Opcional: si falla algo distinto a la verificación inicial, podemos forzar recarga
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
