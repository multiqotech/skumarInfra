import { Poppins } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata = {
  title: 'S Kumar Infracons (India) Private Limiteds | Premium Construction Solutions',
  description:
    'S Kumar Infracons (India) Private Limiteds — Comprehensive construction solutions for roads, bridges, real estate, industrial projects, solar EPC, and government buildings. 25+ years of excellence in infrastructure development.',
  keywords:
    'construction company, infrastructure, roads, highways, bridges, real estate, solar EPC, government projects, S Kumar Infracons (India) Private Limiteds',
  openGraph: {
    title: 'S Kumar Infracons (India) Private Limiteds | Premium Construction Solutions',
    description:
      'Comprehensive construction solutions for all. Building landmark infrastructure with 25+ years of expertise.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable}`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
