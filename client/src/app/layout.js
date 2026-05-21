import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata = {
  title: 'SK Constructions | Premium Construction Solutions',
  description:
    'SK Constructions — Comprehensive construction solutions for roads, bridges, real estate, industrial projects, solar EPC, and government buildings. 25+ years of excellence in infrastructure development.',
  keywords:
    'construction company, infrastructure, roads, highways, bridges, real estate, solar EPC, government projects, SK Constructions',
  openGraph: {
    title: 'SK Constructions | Premium Construction Solutions',
    description:
      'Comprehensive construction solutions for all. Building landmark infrastructure with 25+ years of expertise.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
