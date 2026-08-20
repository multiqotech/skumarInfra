import { Poppins } from 'next/font/google';
import './globals.css';
import HashScroller from '@/components/HashScroller';

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const siteUrl = 'https://www.skumarinfracons.com';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default:
      'S Kumar Infracons (India) Private Limited | Infrastructure & Construction',
    template: '%s | S Kumar Infracons',
  },

  description:
    'S Kumar Infracons (India) Private Limited delivers infrastructure and construction solutions across roads, bridges, real estate, industrial projects, solar EPC, and government buildings.',

  keywords: [
    'S Kumar Infracons',
    'construction company in India',
    'infrastructure company',
    'road construction',
    'bridge construction',
    'industrial construction',
    'solar EPC',
    'government building construction',
    'landmark infrastructure projects',
  ],

  alternates: {
    canonical: '/',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'S Kumar Infracons (India) Private Limited',
    title:
      'S Kumar Infracons (India) Private Limited | Infrastructure & Construction',
    description:
      'Explore S Kumar Infracons’ infrastructure expertise, landmark projects, leadership, and construction solutions.',
    locale: 'en_IN',
  },

  twitter: {
    card: 'summary',
    title:
      'S Kumar Infracons (India) Private Limited | Infrastructure & Construction',
    description:
      'Infrastructure and construction solutions across roads, bridges, industrial projects, solar EPC, and more.',
  },

  icons: {
    icon: '/favicon.ico',
  },

  category: 'Construction and Infrastructure',
};

export default function RootLayout({ children }) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'S Kumar Infracons (India) Private Limited',
    url: siteUrl,
    logo: `${siteUrl}/favicon.ico`,
    description:
      'Infrastructure and construction company delivering roads, bridges, industrial projects, real estate, solar EPC, and government buildings.',
  };

  return (
    <html lang="en" className={poppins.variable}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <HashScroller />
        {children}
      </body>
    </html>
  );
}
