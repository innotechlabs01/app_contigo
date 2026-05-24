'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import {
  Heart, Shield, MapPin, Star, Users,
  ArrowRight, Quote, Sparkles,
  Target, Sun, ArrowUpRight, Play, Phone, Mail,
} from 'lucide-react';

function useCountUp(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return { count, ref };
}

export default function HomePage() {
  const companions = useCountUp(500);
  const families = useCountUp(2000);
  const rating = useCountUp(49);
  const cities = useCountUp(32);

  const features = [
    {
      icon: Shield,
      title: 'Verificación rigurosa',
      desc: 'Todos los Compañeros pasan por un proceso exhaustivo de verificación de antecedentes, entrevistas y pruebas psicológicas.',
      color: 'from-[#00668A] to-[#00668A]/80',
    },
    {
      icon: MapPin,
      title: 'Monitoreo en vivo',
      desc: 'Comparte ubicación con familiares y recibe seguimiento 24/7 con respuesta inmediata ante cualquier eventualidad.',
      color: 'from-[#87CEEB] to-[#87CEEB]/60',
    },
    {
      icon: Heart,
      title: 'Acompañamiento a medida',
      desc: 'Servicios personalizados: médico, emocional, social o acompañamiento diario. Tú eliges lo que necesitas.',
      color: 'from-[#E07A5F] to-[#E07A5F]/70',
    },
  ];

  const steps = [
    {
      number: '01',
      icon: Target,
      title: 'Evalúa',
      desc: 'Responde un breve cuestionario sobre tus necesidades y preferencias de acompañamiento.',
    },
    {
      number: '02',
      icon: Users,
      title: 'Conecta',
      desc: 'Explora perfiles verificados y elige al Compañero que mejor se adapte a tu estilo de vida.',
    },
    {
      number: '03',
      icon: Sun,
      title: 'Disfruta',
      desc: 'Coordina sesiones y comienza a recibir acompañamiento seguro, cálido y confiable.',
    },
  ];

  return (
    <main className="min-h-screen bg-[#F9F6F0] overflow-hidden">
      {/* === NAV === */}
      <nav className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <span className="text-2xl font-bold text-white tracking-tight">contigo</span>
          <div className="flex items-center gap-8">
            <Link href="/admin/login" className="text-sm text-white/80 hover:text-white transition-colors">
              Acceder
            </Link>
            <Link href="/onboarding">
              <Button className="h-10 px-5 text-sm bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 rounded-xl">
                Comenzar
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* === HERO === */}
      <section className="relative min-h-screen flex items-center bg-[#00668A] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#87CEEB]/20 rounded-full animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[#87CEEB]/10 rounded-full animate-blob-delayed" />
          <div className="absolute top-1/3 left-1/2 w-[300px] h-[300px] bg-white/5 rounded-full animate-float" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-white/80 text-sm mb-8 animate-fade-up">
              <Sparkles className="w-3.5 h-3.5 text-[#87CEEB]" />
              Plataforma de acompañamiento y cuidado
            </div>

            <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Cuidado que{' '}
              <span className="text-[#87CEEB] underline decoration-[#87CEEB]/30 decoration-4 underline-offset-8">
                trasciende
              </span>
              <br />
              la distancia
            </h1>

            <p className="text-xl sm:text-2xl text-white/80 max-w-2xl leading-relaxed mb-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              Conectamos adultos mayores y extranjeros con{' '}
              <span className="text-white font-semibold">Compañeros verificados</span> para
              brindar seguridad, empatía y una vida más plena.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <Link href="/onboarding">
                <Button className="h-14 px-8 text-base bg-white text-[#00668A] hover:bg-white/90 rounded-2xl font-semibold shadow-2xl shadow-black/10 transition-all hover:scale-105 active:scale-95">
                  Quiero ser Compañero
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" className="h-14 px-8 text-base bg-transparent text-white border-white/30 hover:bg-white/10 rounded-2xl">
                  Cómo funciona
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F9F6F0] to-transparent" />
      </section>

      {/* === TRUST BAR === */}
      <section className="py-16 bg-[#F9F6F0]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm text-slate-400 uppercase tracking-[0.2em] font-medium mb-10">
            Confianza de miles de familias colombianas
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-60">
            {['Confianza', 'Seguridad', 'Empatía', 'Profesionalismo', 'Calidez'].map((word) => (
              <span key={word} className="text-lg md:text-xl font-light text-[#00668A] tracking-wide">
                {word}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* === FEATURES === */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="max-w-2xl mb-20">
              <span className="text-sm text-[#87CEEB] font-semibold uppercase tracking-[0.15em]">Servicios</span>
              <h2 className="text-4xl sm:text-5xl font-bold text-[#00668A] mt-4 leading-tight">
                Todo lo que necesitas para un cuidado excepcional
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Reveal key={feature.title} delay={i * 100}>
                <div className="group relative bg-[#F9F6F0] rounded-[2.5rem] p-10 hover:shadow-2xl hover:shadow-[#00668A]/5 transition-all duration-500 hover:-translate-y-1">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#00668A] mb-4">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* === STATS === */}
      <section className="py-24 bg-[#00668A] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#87CEEB]/10 rounded-full animate-blob" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 rounded-full animate-blob-delayed" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Números que hablan</h2>
              <p className="text-white/60 text-lg max-w-xl mx-auto">El impacto de nuestra comunidad crece día a día</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem count={companions.count} elementRef={companions.ref} suffix="+" label="Compañeros" icon={Users} />
            <StatItem count={families.count} elementRef={families.ref} suffix="+" label="Familias" icon={Heart} />
            <StatItem count={rating.count / 10} elementRef={rating.ref} suffix="" label="Calificación" icon={Star} decimals={1} />
            <StatItem count={cities.count} elementRef={cities.ref} suffix="" label="Departamentos" icon={MapPin} />
          </div>
        </div>
      </section>

      {/* === HOW IT WORKS === */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-20">
              <span className="text-sm text-[#87CEEB] font-semibold uppercase tracking-[0.15em]">Proceso</span>
              <h2 className="text-4xl sm:text-5xl font-bold text-[#00668A] mt-4">Tres pasos para empezar</h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-16 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-transparent via-[#87CEEB]/50 to-transparent" />

            {steps.map((step, i) => (
              <Reveal key={step.number} delay={i * 150}>
                <div className="text-center group">
                  <div className="relative inline-flex mb-8">
                    <div className="w-20 h-20 bg-[#F9F6F0] rounded-[1.5rem] flex items-center justify-center mx-auto group-hover:bg-[#00668A] transition-colors duration-500">
                      <step.icon className="w-8 h-8 text-[#00668A] group-hover:text-white transition-colors duration-500" />
                    </div>
                    <span className="absolute -top-3 -right-3 w-10 h-10 bg-[#87CEEB] rounded-full flex items-center justify-center text-sm font-bold text-[#00668A] shadow-lg">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#00668A] mb-4">{step.title}</h3>
                  <p className="text-slate-500 leading-relaxed max-w-sm mx-auto">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* === TESTIMONIAL === */}
      <section className="py-24 bg-[#F9F6F0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <Reveal>
              <div className="relative bg-white rounded-[3rem] p-12 md:p-16 shadow-soft">
                <div className="mb-8">
                  <Quote className="w-12 h-12 text-[#87CEEB]/30" />
                </div>
                <blockquote className="text-2xl md:text-3xl text-[#00668A] leading-relaxed font-medium mb-10">
                  &ldquo;Desde que mi mamá tiene un Compañero de Contigo, su calidad de vida
                  mejoró notablemente. Saber que alguien verificado la acompaña me da una
                  tranquilidad invaluable.&rdquo;
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#87CEEB] to-[#00668A] rounded-full flex items-center justify-center text-white font-bold text-lg">
                    M
                  </div>
                  <div>
                    <div className="font-semibold text-[#00668A]">María García</div>
                    <div className="text-sm text-slate-400">Hija de beneficiaria, Bogotá</div>
                  </div>
                  <div className="ml-auto flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#87CEEB] text-[#87CEEB]" />
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* === CTA === */}
      <section className="py-32 bg-[#00668A] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#87CEEB]/10 rounded-full animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-white/5 rounded-full animate-blob-delayed" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight mb-8">
              ¿Listo para
              <br />
              <span className="text-[#87CEEB]">marcar la diferencia?</span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12">
              Únete a nuestra comunidad de Compañeros y transforma la vida de quienes
              más lo necesitan.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/onboarding">
                <Button className="h-16 px-10 text-lg bg-white text-[#00668A] hover:bg-white/90 rounded-2xl font-semibold shadow-2xl shadow-black/10 transition-all hover:scale-105 active:scale-95">
                  Comienza ahora
                  <ArrowUpRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" className="h-16 px-10 text-lg bg-transparent text-white border-white/30 hover:bg-white/10 rounded-2xl">
                  <Play className="w-5 h-5 mr-2" />
                  Ver video
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F9F6F0] to-transparent" />
      </section>

      {/* === FOOTER === */}
      <footer className="bg-[#F9F6F0] pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <span className="text-2xl font-bold text-[#00668A] tracking-tight">contigo</span>
              <p className="text-slate-400 mt-4 leading-relaxed text-sm">
                Plataforma de acompañamiento y cuidado para adultos mayores y extranjeros en Colombia.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[#00668A] mb-6">Servicios</h4>
              <ul className="space-y-3">
                {['Acompañamiento médico', 'Acompañamiento emocional', 'Compañía social', 'Cuidado diario'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-slate-400 hover:text-[#00668A] transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#00668A] mb-6">Compañero</h4>
              <ul className="space-y-3">
                {['Ser Compañero', 'Proceso de verificación', 'Recursos', 'Preguntas frecuentes'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-slate-400 hover:text-[#00668A] transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#00668A] mb-6">Contacto</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <Mail className="w-4 h-4" /> hola@contigo.app
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <Phone className="w-4 h-4" /> +57 1 234 5678
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <MapPin className="w-4 h-4" /> Bogotá, Colombia
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">
              &copy; 2025 Contigo. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-[#00668A] transition-colors">Términos</a>
              <a href="#" className="hover:text-[#00668A] transition-colors">Privacidad</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function StatItem({
  count,
  elementRef,
  suffix,
  label,
  icon: Icon,
  decimals = 0,
}: {
  count: number;
  elementRef: React.RefObject<HTMLDivElement | null>;
  suffix: string;
  label: string;
  icon: React.ElementType;
  decimals?: number;
}) {
  return (
    <div ref={elementRef as React.RefObject<HTMLDivElement>} className="text-center">
      <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-5">
        <Icon className="w-7 h-7 text-[#87CEEB]" />
      </div>
      <div className="text-4xl sm:text-5xl font-bold text-white mb-2 tracking-tight">
        {count.toFixed(decimals)}{suffix}
      </div>
      <div className="text-white/50 text-sm uppercase tracking-widest font-medium">
        {label}
      </div>
    </div>
  );
}
