'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { Check, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';

const plans = [
  {
    name: 'Básico',
    price: '0',
    period: '/mes',
    desc: 'Para empezar a explorar el servicio',
    popular: false,
    features: [
      'Perfil de Compañero básico',
      '1 sesión de prueba',
      'Chat con Compañeros',
      'Verificación estándar',
      'Soporte por email',
    ],
    cta: 'Comenzar gratis',
    href: '/onboarding',
  },
  {
    name: 'Profesional',
    price: '49',
    period: '/mes',
    desc: 'Para familias que buscan acompañamiento regular',
    popular: true,
    features: [
      'Perfil de Compañero destacado',
      'Sesiones ilimitadas',
      'Video-llamadas ilimitadas',
      'Verificación plus + antecedentes',
      'Monitoreo en tiempo real',
      'Soporte prioritario 24/7',
      'Reportes mensuales',
    ],
    cta: 'Elegir Profesional',
    href: '/onboarding?plan=pro',
  },
  {
    name: 'Empresarial',
    price: '99',
    period: '/mes',
    desc: 'Para instituciones y hogares geriátricos',
    popular: false,
    features: [
      'Gestión multi-Compañero',
      'Paneles de control',
      'API de integración',
      'Verificación premium',
      'Capacitación incluida',
      'Soporte dedicado',
      'Reportes personalizados',
      'Facturación electrónica',
    ],
    cta: 'Contactar ventas',
    href: '/contact',
  },
];

const comparisonFeatures = [
  { name: 'Perfil de Compañero', basic: true, pro: true, enterprise: true },
  { name: 'Sesiones mensuales', basic: '1', pro: 'Ilimitadas', enterprise: 'Ilimitadas' },
  { name: 'Video-llamadas', basic: false, pro: true, enterprise: true },
  { name: 'Verificación', basic: 'Estándar', pro: 'Plus', enterprise: 'Premium' },
  { name: 'Monitoreo en vivo', basic: false, pro: true, enterprise: true },
  { name: 'Soporte', basic: 'Email', pro: '24/7 Prioritario', enterprise: 'Dedicado' },
  { name: 'Reportes', basic: false, pro: 'Mensuales', enterprise: 'Personalizados' },
  { name: 'API / Integraciones', basic: false, pro: false, enterprise: true },
  { name: 'Multi-usuario', basic: false, pro: false, enterprise: true },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#F9F6F0]">
      {/* Nav */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#00668A] tracking-tight">contigo</Link>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="text-sm text-[#00668A] font-medium">Precios</Link>
            <Link href="/about" className="text-sm text-slate-400 hover:text-[#00668A]">Nosotros</Link>
            <Link href="/faq" className="text-sm text-slate-400 hover:text-[#00668A]">FAQ</Link>
            <Link href="/contact" className="text-sm text-slate-400 hover:text-[#00668A]">Contacto</Link>
            <Link href="/admin/login" className="text-sm text-slate-400 hover:text-[#00668A]">Acceder</Link>
            <Link href="/onboarding">
              <Button className="h-9 px-4 text-xs bg-[#00668A] text-white rounded-xl">Comenzar</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#87CEEB]/20 rounded-full text-[#00668A] text-sm mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Precios simples, sin sorpresas
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-[#00668A] mb-6 leading-tight">
              El plan perfecto para{' '}
              <span className="text-[#87CEEB]">cada familia</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Desde empezar gratis hasta soluciones empresariales completas.
              Cambia de plan cuando quieras.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Plans */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 100}>
                <div className={`relative bg-white rounded-[2.5rem] p-8 border-2 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${
                  plan.popular ? 'border-[#87CEEB] shadow-xl shadow-[#87CEEB]/10' : 'border-transparent shadow-soft'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00668A] text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                      Más popular
                    </div>
                  )}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-[#00668A] mb-2">{plan.name}</h3>
                    <p className="text-slate-400 text-sm mb-4">{plan.desc}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-[#00668A]">${plan.price}</span>
                      <span className="text-slate-400">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm text-slate-600">
                        <Check className="w-4 h-4 text-[#87CEEB] flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.href}>
                    <Button className={`w-full h-12 rounded-xl text-sm ${
                      plan.popular
                        ? 'bg-[#00668A] text-white hover:bg-[#00668A]/90'
                        : 'bg-[#F9F6F0] text-[#00668A] hover:bg-[#F0EBE0]'
                    }`}>
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#00668A] text-center mb-12">
              Compara todos los planes
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-4 pr-8 font-semibold text-[#00668A]">Característica</th>
                    <th className="text-center py-4 px-4 font-semibold text-[#00668A]">Básico</th>
                    <th className="text-center py-4 px-4 font-semibold text-[#87CEEB]">Profesional</th>
                    <th className="text-center py-4 pl-4 font-semibold text-[#00668A]">Empresarial</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((f) => (
                    <tr key={f.name} className="border-b border-slate-100">
                      <td className="py-4 pr-8 text-slate-600">{f.name}</td>
                      <td className="text-center py-4 px-4">
                        {typeof f.basic === 'boolean'
                          ? <Check className={`w-4 h-4 mx-auto ${f.basic ? 'text-[#87CEEB]' : 'text-slate-200'}`} />
                          : <span className="text-slate-500">{f.basic}</span>
                        }
                      </td>
                      <td className="text-center py-4 px-4">
                        {typeof f.pro === 'boolean'
                          ? <Check className={`w-4 h-4 mx-auto ${f.pro ? 'text-[#87CEEB]' : 'text-slate-200'}`} />
                          : <span className="text-slate-500">{f.pro}</span>
                        }
                      </td>
                      <td className="text-center py-4 pl-4">
                        {typeof f.enterprise === 'boolean'
                          ? <Check className={`w-4 h-4 mx-auto ${f.enterprise ? 'text-[#87CEEB]' : 'text-slate-200'}`} />
                          : <span className="text-slate-500">{f.enterprise}</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ teaser */}
      <section className="py-24 text-center bg-[#F9F6F0]">
        <Reveal>
          <div className="max-w-2xl mx-auto px-6">
            <HelpCircle className="w-10 h-10 text-[#87CEEB] mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-[#00668A] mb-4">¿Tienes dudas?</h2>
            <p className="text-slate-500 mb-8">Explora nuestras preguntas frecuentes o contáctanos directamente.</p>
            <div className="flex justify-center gap-4">
              <Link href="/faq">
                <Button variant="outline" className="rounded-xl">Ver FAQ</Button>
              </Link>
              <Link href="/contact">
                <Button className="bg-[#00668A] text-white rounded-xl">Contactar</Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="bg-[#00668A] py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-white/50 text-sm">&copy; 2025 Contigo. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
