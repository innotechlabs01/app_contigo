'use client';

import { WizardProvider } from '@/context/wizard-context';
import { Header } from '@/components/layout/header';

export default function CrearLayout({ children }: { children: React.ReactNode }) {
  return (
    <WizardProvider>
      <Header />
      <main className="px-8 pb-16">{children}</main>
    </WizardProvider>
  );
}
