import './globals.css';

export const metadata = {
  title: 'Sistema POS',
  description: 'Punto de Venta para Pymes Chilenas',
};
//se importa el contexto de authcontext para que el usuario pueda iniciar sesion
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
