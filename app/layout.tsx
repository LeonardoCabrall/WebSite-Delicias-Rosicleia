import type { Metadata } from 'next';
import { Montserrat, Open_Sans, Roboto } from 'next/font/google';

import { ThemeProvider } from '@/components/theme-provider';

import './globals.css';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

const openSans = Open_Sans({
  variable: '--font-open-sans',
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
});

const roboto = Roboto({
  variable: '--font-roboto',
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  ),
  title: 'Delícias Rosicleia — comida caseira, direto no seu iFood',
  description:
    'Comida feita à moda da casa, com ingredientes selecionados. Veja o cardápio completo e peça pelo iFood.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Delícias Rosicleia',
    description:
      'Comida feita à moda da casa. Cardápio completo e pedido pelo iFood.',
    type: 'website',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Delícias Rosicleia — comida caseira, direto no seu iFood',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Delícias Rosicleia',
    description:
      'Comida feita à moda da casa. Cardápio completo e pedido pelo iFood.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${openSans.variable} ${montserrat.variable} ${roboto.variable}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
