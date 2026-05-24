'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { Heart, Target, Eye, Quote, ArrowRight, Sparkles, Users, Award } from 'lucide-react';

const values = [
  { icon: Heart, title: 'Empatía', desc: 'Ponernos en el lugar del otro es el centro de todo lo que hacemos.' },
  { icon: Target, title: 'Compromiso', desc: 'Cada acompañamiento es una promesa de calidad y dedicación.' },
  { icon: Eye, title: 'Transparencia', desc: 'Procesos claros, verificación rigurosa y comunicación honesta.' },
  { icon: Users, title: 'Comunidad', desc: 'Construimos redes de apoyo que fortalecen el tejido social.' },
];

const team = [
  { initials: 'AG', name: 'Ana García', role: 'Fundadora & CEO', color: 'from-[#00668A] to-[#00668A]/70' },
  { initials: 'CM', name: 'Carlos Martínez', role: 'Director de Operaciones', color: 'from-[#87CEEB] to-[#87CEEB]/70' },
  { initials: 'LR', name: 'Laura Rodríguez', role: 'Head de Verificación', color: 'from-[#E07A5F] to-[#E07A5F]/70' },
  { initials: 'JP', name: 'José Pérez', role: 'Director de Tecnología', color: 'from-[#00668A] to-[#87CEEB]' },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F9F6F0]">
      {/* Nav */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#00668A] tracking-tight">contigo</Link>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="text-sm text-slate-400 hover:text-[#00668A]">Precios</Link>
            <Link href="/about" className="text-sm text-[#00668A] font-medium">Nosotros</Link>
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
      <section className="relative py-32 bg-[#00668A] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#87CEEB]/15 rounded-full animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-white/5 rounded-full animate-blob-delayed" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
              Transformamos la manera de{' '}
              <span className="text-[#87CEEB]">cuidar</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Nacimos en Colombia con una convicción: nadie debería estar solo.
              Creamos Contigo para conectar personas que necesitan acompañamiento
              con quienes están listos para brindarlo.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal>
            <span className="text-sm text-[#87CEEB] font-semibold uppercase tracking-[0.15em]">Nuestra historia</span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#00668A] mt-4 mb-8 leading-tight">
              Cómo empezó todo
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Reveal delay={100}>
              <div className="space-y-6 text-slate-500 leading-relaxed">
                <p>
                  Contigo nació en 2023 cuando Ana García, enfermera de profesión, notó
                  que muchos adultos mayores en su comunidad carecían de redes de apoyo.
                  La distancia familiar y el ritmo de vida moderno dejaban a estas personas
                  en una soledad que afectaba su salud física y emocional.
                </p>
                <p>
                  Junto a un equipo multidisciplinario, creó una plataforma que no solo
                  conecta personas, sino que garantiza acompañamiento de calidad mediante
                  un riguroso proceso de verificación y monitoreo constante.
                </p>
                <p>
                  Hoy, Contigo opera en más de 30 departamentos de Colombia, con cientos
                  de Compañeros verificados y miles de familias beneficiadas.
                </p>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="bg-[#F9F6F0] rounded-[2.5rem] p-10">
                <Quote className="w-8 h-8 text-[#87CEEB] mb-6" />
                <blockquote className="text-xl text-[#00668A] font-medium leading-relaxed mb-6">
                  &ldquo;El acompañamiento no es un lujo, es una necesidad humana. En
                  Contigo trabajamos cada día para hacerlo accesible a todos.&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#87CEEB] to-[#00668A] rounded-full flex items-center justify-center text-white font-bold">
                    AG
                  </div>
                  <div>
                    <div className="font-semibold text-[#00668A]">Ana García</div>
                    <div className="text-sm text-slate-400">Fundadora & CEO</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-[#F9F6F0]">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-sm text-[#87CEEB] font-semibold uppercase tracking-[0.15em]">Valores</span>
              <h2 className="text-4xl sm:text-5xl font-bold text-[#00668A] mt-4">Lo que nos guía</h2>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 100}>
                <div className="bg-white rounded-[2rem] p-8 text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                  <div className="w-14 h-14 bg-[#00668A]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <v.icon className="w-6 h-6 text-[#00668A]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#00668A] mb-3">{v.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-sm text-[#87CEEB] font-semibold uppercase tracking-[0.15em]">Equipo</span>
              <h2 className="text-4xl sm:text-5xl font-bold text-[#00668A] mt-4">Quienes hacen Contigo posible</h2>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {team.map((m, i) => (
              <Reveal key={m.name} delay={i * 100}>
                <div className="text-center group">
                  <div className={`w-24 h-24 bg-gradient-to-br ${m.color} rounded-[1.5rem] flex items-center justify-center mx-auto mb-5 text-2xl font-bold text-white group-hover:scale-110 transition-transform duration-500`}>
                    {m.initials}
                  </div>
                  <h3 className="font-semibold text-[#00668A]">{m.name}</h3>
                  <p className="text-sm text-slate-400">{m.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#00668A] relative overflow-hidden text-center">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#87CEEB]/10 rounded-full animate-blob" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <Reveal>
            <h2 className="text-4xl font-bold text-white mb-6">¿Quieres ser parte del cambio?</h2>
            <p className="text-white/60 mb-8">Únete a nuestra comunidad de Compañeros y transforma vidas.</p>
            <Link href="/onboarding">
              <Button className="bg-white text-[#00668A] hover:bg-white/90 h-14 px-10 rounded-2xl text-base font-semibold">
                Comienza ahora <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F9F6F0] py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-400 text-sm">&copy; 2025 Contigo. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
