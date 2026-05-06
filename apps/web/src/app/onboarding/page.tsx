import type { Metadata } from 'next';
import { OnboardingContainer } from '@/components/onboarding';

export const metadata: Metadata = {
  title: 'Únete a Contigo | Acompañamiento y Cuidado',
  description: 'Regístrate como Compañero y únete a nuestra plataforma de salud y acompañamiento para adultos mayores y extranjeros.',
  keywords: ['registro', 'companero', 'cuidado', 'empleo', 'adultos mayores'],
  robots: 'index, follow',
};

export const dynamic = 'force-dynamic';

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-background py-4 sm:py-8">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-secondary">Únete a Contigo</h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2">Completa el proceso de registro para convertirte en Compañero</p>
        </div>
        <OnboardingContainer />
      </div>
    </main>
  );
}