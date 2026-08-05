import { Header } from '@/components/layout/header';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative px-8 pt-16 pb-12">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-text-primary leading-tight mb-4">
              Palabras con <br />
              <span className="text-brand-blue">intención</span>
            </h1>
            <p className="text-lg text-text-secondary mb-10 max-w-lg">
              Crea mensajes únicos para cada ocasión especial. Elige, personaliza y envía por SMS
              en minutos.
            </p>
            <Link
              href="/crear/ocasion"
              className="btn-primary inline-flex px-8 py-3.5 text-base rounded-full"
            >
              Crear nuevo mensaje
            </Link>
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] opacity-10 pointer-events-none">
            <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="200" cy="200" r="150" stroke="#2269ED" strokeWidth="2" />
              <circle cx="200" cy="200" r="100" stroke="#2269ED" strokeWidth="2" />
              <circle cx="200" cy="200" r="50" stroke="#2269ED" strokeWidth="2" />
            </svg>
          </div>
        </section>

        {/* How it works */}
        <section className="px-8 py-16 border-t border-slate-100">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-12">
            ¿Cómo funciona?
          </h2>
          <div className="grid grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { step: '1', title: 'Elige la ocasión', desc: 'Cumpleaños, aniversario, graduación...' },
              { step: '2', title: 'Selecciona un mensaje', desc: 'Elige entre mensajes pensados para inspirar.' },
              { step: '3', title: 'Personaliza el envío', desc: 'Añade los datos del destinatario y programa la fecha.' },
              { step: '4', title: 'Paga y envía', desc: 'Completa el pago y tu mensaje se enviará por SMS.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-brand-blue text-white flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-text-primary mb-2">{item.title}</h3>
                <p className="text-sm text-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="px-8 py-6 border-t border-slate-100 text-center text-sm text-text-muted">
        &copy; 2026 ConSentido &mdash; Palabras con intención
      </footer>
    </>
  );
}
