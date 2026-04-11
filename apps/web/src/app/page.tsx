import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Contigo - Acompañamiento y Cuidado',
  description: 'Plataforma de salud y acompañamiento para adultos mayores y extranjeros. Servicios verificados y monitoreo en tiempo real.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-6">
            Cuidado y Acompañamiento con Confianza
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Conectamos adultos mayores y extranjeras con Compañeros verificados para brindarle seguridad, empatía y compañía.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/onboarding">
              <Button size="lg">Quiero ser Compañero</Button>
            </Link>
            <Button variant="outline" size="lg">Conocer más</Button>
          </div>
        </div>
      </div>
    </main>
  );
}