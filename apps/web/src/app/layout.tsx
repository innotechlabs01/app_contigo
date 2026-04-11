import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://contigo.app'),
  title: 'Contigo - Acompañamiento y Cuidado',
  description: 'Plataforma de salud y acompañamiento para adultos mayores y extranjeros. Servicios verificados y monitoreo en tiempo real.',
  keywords: ['salud', 'acompañamiento', 'adultos mayores', 'cuidado', 'companeros'],
  authors: [{ name: 'Contigo' }],
  openGraph: {
    title: 'Contigo - Acompañamiento y Cuidado',
    description: 'Plataforma de salud y acompañamiento para adultos mayores',
    type: 'website',
    locale: 'es_ES',
    siteName: 'Contigo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contigo - Acompañamiento y Cuidado',
    description: 'Plataforma de salud y acompañamiento para adultos mayores',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <meta name="theme-color" content="#00668A" />
      </head>
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  );
}