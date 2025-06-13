import './globals.css';
import { Inter } from 'next/font/google';
import ClientProviders from '../components/providers/ClientProviders';
import { ToastContainer } from 'react-toastify';


const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ClientProviders>
          {children}
          <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </ClientProviders>
      </body>
    </html>
  );
}