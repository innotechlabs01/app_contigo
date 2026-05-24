'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { ChevronDown, Search, Sparkles, ArrowRight } from 'lucide-react';

const faqs = [
  {
    category: 'General',
    items: [
      { q: '¿Qué es Contigo?', a: 'Contigo es una plataforma colombiana que conecta adultos mayores y extranjeros con Compañeros verificados para brindar acompañamiento médico, emocional y social.' },
      { q: '¿En qué ciudades están disponibles?', a: 'Operamos en los 32 departamentos de Colombia, incluyendo Bogotá D.C., Medellín, Cali, Barranquilla y más de 200 municipios.' },
      { q: '¿Cómo garantizan la seguridad?', a: 'Todos los Compañeros pasan por un proceso exhaustivo de verificación que incluye antecedentes penales, entrevistas presenciales y pruebas psicológicas.' },
    ],
  },
  {
    category: 'Para Compañeros',
    items: [
      { q: '¿Cómo me registro como Compañero?', a: 'Completa el formulario de registro en nuestra plataforma, pasa el proceso de verificación y comienza a recibir solicitudes de acompañamiento.' },
      { q: '¿Qué requisitos necesito?', a: 'Ser mayor de edad, tener disponibilidad de tiempo, aprobar el proceso de verificación y contar con habilidades de comunicación y empatía.' },
      { q: '¿Cuánto puedo ganar?', a: 'Las tarifas varían según el tipo de servicio y la ubicación. En promedio, nuestros Compañeros ganan entre $30,000 y $80,000 COP por hora.' },
      { q: '¿Recibo capacitación?', a: 'Sí, todos los Compañeros reciben capacitación inicial en atención al adulto mayor, primeros auxilios y manejo de emergencias.' },
    ],
  },
  {
    category: 'Para Familias',
    items: [
      { q: '¿Cómo elijo un Compañero?', a: 'Completa el cuestionario de necesidades y te recomendaremos Compañeros compatibles. Puedes ver sus perfiles, calificaciones y reseñas.' },
      { q: '¿Puedo cambiar de Compañero?', a: 'Sí, en cualquier momento. Si no sientes una buena conexión, podemos asignarte un nuevo Compañero sin costo adicional.' },
      { q: '¿Hay un compromiso mínimo?', a: 'No. Puedes contratar sesiones individuales o paquetes mensuales. Cancela cuando quieras sin penalización.' },
      { q: '¿Cómo se realizan los pagos?', a: 'Los pagos se procesan de forma segura a través de nuestra plataforma con tarjeta de crédito, débito o transferencia bancaria.' },
    ],
  },
  {
    category: 'Facturación',
    items: [
      { q: '¿Ofrecen factura electrónica?', a: 'Sí, todos nuestros planes empresariales incluyen facturación electrónica. Los planes profesionales pueden solicitarla.' },
      { q: '¿Puedo cambiar de plan?', a: 'Sí, puedes cambiar de plan en cualquier momento. El cambio se refleja al inicio del siguiente ciclo de facturación.' },
    ],
  },
];

function Accordion({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
      >
        <span className="font-medium text-[#00668A] text-sm group-hover:text-[#87CEEB] transition-colors">{q}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 pb-5' : 'max-h-0'}`}>
        <p className="text-slate-500 text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [search, setSearch] = useState('');

  const filtered = faqs.map(cat => ({
    ...cat,
    items: cat.items.filter(
      item => item.q.toLowerCase().includes(search.toLowerCase()) ||
              item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.items.length > 0);

  return (
    <main className="min-h-screen bg-[#F9F6F0]">
      {/* Nav */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#00668A] tracking-tight">contigo</Link>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="text-sm text-slate-400 hover:text-[#00668A]">Precios</Link>
            <Link href="/about" className="text-sm text-slate-400 hover:text-[#00668A]">Nosotros</Link>
            <Link href="/faq" className="text-sm text-[#00668A] font-medium">FAQ</Link>
            <Link href="/contact" className="text-sm text-slate-400 hover:text-[#00668A]">Contacto</Link>
            <Link href="/admin/login" className="text-sm text-slate-400 hover:text-[#00668A]">Acceder</Link>
            <Link href="/onboarding">
              <Button className="h-9 px-4 text-xs bg-[#00668A] text-white rounded-xl">Comenzar</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-24 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#87CEEB]/20 rounded-full text-[#00668A] text-sm mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Respuestas rápidas
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-[#00668A] mb-6 leading-tight">
              Preguntas{' '}
              <span className="text-[#87CEEB]">Frecuentes</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-xl mx-auto">
              Todo lo que necesitas saber sobre Contigo en un solo lugar.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Search */}
      <section className="pb-8">
        <div className="max-w-xl mx-auto px-6">
          <Reveal>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar en FAQ..."
                className="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-slate-200 focus:border-[#00668A] focus:outline-none bg-white text-sm"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-6">
          {filtered.map((cat, i) => (
            <Reveal key={cat.category} delay={i * 100}>
              <div className="bg-white rounded-[2.5rem] p-8 md:p-10 mb-6 shadow-soft">
                <h2 className="text-xl font-bold text-[#00668A] mb-2">{cat.category}</h2>
                <div className="divide-y divide-slate-100">
                  {cat.items.map((item) => (
                    <Accordion key={item.q} q={item.q} a={item.a} />
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 text-center">
        <Reveal>
          <div className="max-w-xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-[#00668A] mb-3">¿No encuentras lo que buscas?</h2>
            <p className="text-slate-500 mb-6">Estamos aquí para ayudarte personalmente.</p>
            <Link href="/contact">
              <Button className="bg-[#00668A] text-white rounded-xl h-12 px-8">
                Contáctanos <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
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
