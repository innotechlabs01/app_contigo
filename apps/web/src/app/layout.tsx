import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://consentido.app'),
  title: 'ConSentido - Palabras con intención',
  description: 'Crea y envía mensajes personalizados para cada ocasión especial. Mensajes con significado, entregados por SMS.',
  keywords: ['mensajes', 'sms', 'ocasiones', 'cumpleaños', 'felicitaciones'],
  authors: [{ name: 'ConSentido' }],
  openGraph: {
    title: 'ConSentido - Palabras con intención',
    description: 'Crea y envía mensajes personalizados para cada ocasión especial.',
    type: 'website',
    locale: 'es_ES',
    siteName: 'ConSentido',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ConSentido - Palabras con intención',
    description: 'Crea y envía mensajes personalizados para cada ocasión especial.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <meta name="theme-color" content="#2269ED" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className="min-h-screen bg-surface-outer antialiased flex items-start justify-center py-10">
        <div className="w-full max-w-[1280px] bg-surface-page shadow-[0_12px_40px_rgba(0,0,0,0.25)] rounded-2xl overflow-hidden min-h-[600px]">
          {children}
        </div>
      </body>
    </html>
  );
}
