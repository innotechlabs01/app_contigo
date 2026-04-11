import type { Metadata } from 'next';
import { OnboardingContainer } from '@/components/onboarding';

export const metadata: Metadata = {
  title: 'Únete a Contigo | Acompañamiento y Cuidado',
  description: 'Regístrate como Compañero y únete a nuestra plataforma de salud y acompañamiento para adultos mayores y extranjeros.',
  keywords: ['registro', 'companero', 'cuidado', 'empleo', 'adultos mayores'],
  robots: 'index, follow',
};

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Únete a Contigo</h1>
          <p className="text-slate-600 mt-2">Completa el proceso de registro para convertirte en Compañero</p>
        </div>
        <OnboardingContainer />
      </div>
    </main>
  );
}