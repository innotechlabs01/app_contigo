'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { Mail, Phone, MapPin, MessageSquare, Send, Check, Sparkles } from 'lucide-react';

const contactMethods = [
  { icon: Mail, title: 'Email', value: 'hola@contigo.app', desc: 'Respuesta en 24 horas' },
  { icon: Phone, title: 'Teléfono', value: '+57 1 234 5678', desc: 'Lun-Vie 8am-6pm' },
  { icon: MapPin, title: 'Oficina', value: 'Bogotá D.C., Colombia', desc: 'Calle 100 #15-45' },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main className="min-h-screen bg-[#F9F6F0]">
      {/* Nav */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#00668A] tracking-tight">contigo</Link>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="text-sm text-slate-400 hover:text-[#00668A]">Precios</Link>
            <Link href="/about" className="text-sm text-slate-400 hover:text-[#00668A]">Nosotros</Link>
            <Link href="/faq" className="text-sm text-slate-400 hover:text-[#00668A]">FAQ</Link>
            <Link href="/contact" className="text-sm text-[#00668A] font-medium">Contacto</Link>
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
              <MessageSquare className="w-3.5 h-3.5" />
              Estamos para ayudarte
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-[#00668A] mb-6 leading-tight">
              Hablemos
            </h1>
            <p className="text-xl text-slate-500 max-w-xl mx-auto">
              ¿Tienes preguntas, sugerencias o quieres ser parte de Contigo?
              Cuéntanos, estamos aquí para escucharte.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Contact Methods + Form */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-8">
            {/* Left - Methods */}
            <Reveal className="md:col-span-2 space-y-4">
              {contactMethods.map((method) => (
                <div key={method.title} className="bg-white rounded-2xl p-6 flex items-start gap-4 shadow-soft">
                  <div className="w-12 h-12 bg-[#00668A]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <method.icon className="w-5 h-5 text-[#00668A]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#00668A] text-sm">{method.title}</h3>
                    <p className="text-slate-700 font-medium">{method.value}</p>
                    <p className="text-slate-400 text-xs mt-1">{method.desc}</p>
                  </div>
                </div>
              ))}
            </Reveal>

            {/* Right - Form */}
            <Reveal delay={100} className="md:col-span-3">
              {sent ? (
                <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-soft">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#00668A] mb-3">¡Mensaje enviado!</h3>
                  <p className="text-slate-500 mb-6">Te responderemos en las próximas 24 horas.</p>
                  <Button onClick={() => setSent(false)} variant="outline" className="rounded-xl">
                    Enviar otro mensaje
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-10 shadow-soft space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#00668A] mb-2">Nombre completo</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-[#00668A] focus:outline-none bg-[#F9F6F0]"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#00668A] mb-2">Correo electrónico</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-[#00668A] focus:outline-none bg-[#F9F6F0]"
                        placeholder="correo@ejemplo.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#00668A] mb-2">Teléfono (opcional)</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-[#00668A] focus:outline-none bg-[#F9F6F0]"
                      placeholder="+57 300 123 4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#00668A] mb-2">Mensaje</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#00668A] focus:outline-none bg-[#F9F6F0] resize-none"
                      placeholder="Cuéntanos en qué podemos ayudarte..."
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 bg-[#00668A] text-white rounded-xl text-sm">
                    <Send className="w-4 h-4 mr-2" />
                    Enviar mensaje
                  </Button>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="bg-[#00668A] rounded-[2.5rem] h-64 md:h-80 flex items-center justify-center text-white/30 overflow-hidden relative">
              <div className="absolute inset-0 bg-[#00668A]">
                <div className="w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, #87CEEB 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
              </div>
              <div className="relative z-10 text-center">
                <MapPin className="w-8 h-8 mx-auto mb-3 text-[#87CEEB]" />
                <p className="text-white/60">Bogotá D.C., Colombia — Oficina principal</p>
              </div>
            </div>
          </Reveal>
        </div>
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
