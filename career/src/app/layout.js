import { Poppins } from 'next/font/google';
import './globals.css';
import Providers from '../components/Providers';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AuthProvider } from '@/context/AuthContext';

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata = {
  title: 'S Kumar Infracons (India) Private Limiteds Careers | Build Your Future',
  description: 'Join S Kumar Infracons (India) Private Limiteds and build landmark infrastructure with us. Browse open positions and apply today.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <Providers>
            <Navbar />
            <main className="pt-24 min-h-screen">
              {children}
            </main>
            <Footer />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
