import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Shield, MapPin, Clock, Star, Users } from "lucide-react";

export const metadata = {
  title: "Contigo - Acompañamiento y Cuidado",
  description:
    "Plataforma de salud y acompañamiento para adultos mayores y extranjeros. Servicios verificados y monitoreo en tiempo real.",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Video Background Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-primary/10 to-background">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1920')] bg-cover bg-center opacity-20" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-secondary mb-6 leading-tight">
              Cuidado y Acompañamiento con Confianza
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Conectamos adultos mayores y extranjeras con Compañeros verificados
              para brindarle seguridad, empatía y compañía.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/onboarding">
                <Button size="lg" className="text-lg px-10 py-7">
                  Quiero ser Compañero
                </Button>
              </Link>
              <Link href="/admin/login">
                <Button variant="outline" size="lg" className="text-lg px-10 py-7">
                  Iniciar sesión
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-secondary text-center mb-4">
            ¿Por qué elegir Contigo?
          </h2>
          <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
            Nuestra plataforma garantiza acompañantes verificados y servicios
            personalizados para cada necesidad.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Compañeros Verificados"
              description="Todos nuestros accompagnantes pasan por un riguroso proceso de verificación incluyendo antecedentes y entrevistas."
            />
            <FeatureCard
              icon={<MapPin className="w-8 h-8" />}
              title="Monitoreo en Tiempo Real"
              description="Comparte tu ubicación con contactos de emergencia y recibe seguimiento personalizado las 24 horas."
            />
            <FeatureCard
              icon={<Heart className="w-8 h-8" />}
              title="Acompañamiento Personalizado"
              description="Servicios adaptados a tus necesidades específicas: médico, emocional, social o acompañamiento diario."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard
              icon={<Users className="w-8 h-8" />}
              value="500+"
              label="Compañeros"
            />
            <StatCard
              icon={<Heart className="w-8 h-8" />}
              value="2000+"
              label="Familias"
            />
            <StatCard
              icon={<Star className="w-8 h-8" />}
              value="4.9"
              label="Calificación"
            />
            <StatCard
              icon={<Clock className="w-8 h-8" />}
              value="24/7"
              label="Soporte"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-secondary text-center mb-4">
            Cómo Funciona
          </h2>
          <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
            Tres simples pasos para encontrar tu compañero ideal
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <StepCard
              number="1"
              title="Evalúa tus necesidades"
              description="Responde un breve cuestionario sobre el tipo de acompañamiento que buscas."
            />
            <StepCard
              number="2"
              title="Conecta con Compañeros"
              description="Explora perfiles de acompañantes verificados y elige el que mejor se adapte."
            />
            <StepCard
              number="3"
              title="Comienza el acompañamiento"
              description="Coordina sesiones y disfruta de compañía segura y confiable."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para comenzar?
          </h2>
          <p className="text-white/80 text-xl mb-8 max-w-2xl mx-auto">
            Únete a nuestra comunidad de Compañeros y ayuda a hacer la diferencia
            en la vida de otros.
          </p>
          <Link href="/onboarding">
            <Button
              size="lg"
              variant="default"
              className="bg-white text-secondary hover:bg-white/90 text-lg px-10 py-7"
            >
              Registrarme como Compañero
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Contigo</h3>
              <p className="text-white/70">
                Plataforma de acompañamiento y cuidado para adultos mayores y
                extranjeros.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-white/70">
                <li>Acompañamiento médico</li>
                <li>Acompañamiento emocional</li>
                <li>Compañía social</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Compañero</h4>
              <ul className="space-y-2 text-white/70">
                <li>Ser Compañero</li>
                <li>Verificación</li>
                <li>Recursos</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-white/70">
                <li>info@contigo.com</li>
                <li>+1 234 567 890</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-white/50">
            <p>&copy; 2025 Contigo. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-surface rounded-2xl p-8 shadow-soft hover:shadow-lg transition-shadow">
      <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center text-secondary mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-secondary mb-3">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white mx-auto mb-4">
        {icon}
      </div>
      <div className="text-3xl font-bold text-secondary mb-1">{value}</div>
      <div className="text-slate-600">{label}</div>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-secondary mb-3">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}