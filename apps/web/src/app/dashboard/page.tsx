'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import {
  Bell, Calendar, Clock, Heart, LogOut, MapPin, MessageSquare,
  Settings, Star, Users, ChevronRight, Activity, Award,
  User, ArrowRight, Home, Menu, X,
} from 'lucide-react';

const stats = [
  { icon: Calendar, label: 'Sesiones este mes', value: '12', color: 'text-[#00668A]', bg: 'bg-[#00668A]/10' },
  { icon: Heart, label: 'Compañeros activos', value: '3', color: 'text-[#E07A5F]', bg: 'bg-[#E07A5F]/10' },
  { icon: Star, label: 'Calificación promedio', value: '4.9', color: 'text-[#87CEEB]', bg: 'bg-[#87CEEB]/20' },
  { icon: Award, label: 'Horas completadas', value: '48', color: 'text-green-600', bg: 'bg-green-100' },
];

const upcomingSessions = [
  { date: 'Lun 15 Jun', time: '10:00 - 12:00', companion: 'María López', type: 'Acompañamiento médico', status: 'confirmada' },
  { date: 'Mié 17 Jun', time: '15:00 - 17:00', companion: 'Carlos Ruiz', type: 'Compañía social', status: 'pendiente' },
  { date: 'Vie 19 Jun', time: '09:00 - 11:00', companion: 'Ana Torres', type: 'Acompañamiento emocional', status: 'confirmada' },
];

const activities = [
  { icon: MessageSquare, text: 'María López confirmó la sesión del lunes', time: 'Hace 2 horas', color: 'text-[#00668A]' },
  { icon: Star, text: 'Recibiste una calificación de 5 estrellas', time: 'Hace 5 horas', color: 'text-[#87CEEB]' },
  { icon: Users, text: 'Nuevo Compañero disponible en tu zona', time: 'Hace 1 día', color: 'text-[#E07A5F]' },
  { icon: Bell, text: 'Recordatorio: sesión con Carlos mañana', time: 'Hace 1 día', color: 'text-amber-500' },
];

const sidebarLinks = [
  { icon: Home, label: 'Inicio', href: '/dashboard', active: true },
  { icon: Calendar, label: 'Sesiones', href: '#' },
  { icon: Users, label: 'Compañeros', href: '#' },
  { icon: MessageSquare, label: 'Mensajes', href: '#' },
  { icon: Activity, label: 'Actividad', href: '#' },
  { icon: Settings, label: 'Ajustes', href: '#' },
];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9F6F0] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-200">
          <Link href="/" className="text-xl font-bold text-[#00668A] tracking-tight">contigo</Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
                link.active ? 'bg-[#00668A] text-white' : 'text-slate-400 hover:text-[#00668A] hover:bg-[#00668A]/5'
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </a>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-200">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 md:ml-64 min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
          <div className="flex items-center justify-between px-6 h-16">
            <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5 text-slate-500" />
            </button>
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-xl hover:bg-[#F9F6F0] transition-colors">
                <Bell className="w-5 h-5 text-slate-400" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E07A5F] rounded-full" />
              </button>
              <div className="w-9 h-9 bg-gradient-to-br from-[#87CEEB] to-[#00668A] rounded-xl flex items-center justify-center text-white font-bold text-sm">
                MG
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 md:p-10 max-w-6xl mx-auto">
          {/* Welcome */}
          <Reveal>
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-[#00668A]">Bienvenida, María</h1>
              <p className="text-slate-400 mt-1">Aquí tienes un resumen de tu actividad</p>
            </div>
          </Reveal>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 80}>
                <div className="bg-white rounded-2xl p-5 shadow-soft hover:shadow-xl transition-shadow">
                  <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-slate-400 mt-1">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Two-column layout */}
          <div className="grid lg:grid-cols-2 gap-8 mb-10">
            {/* Upcoming Sessions */}
            <Reveal>
              <div className="bg-white rounded-[2rem] p-6 shadow-soft">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-[#00668A]">Próximas sesiones</h2>
                  <a href="#" className="text-sm text-[#87CEEB] hover:text-[#00668A] transition-colors flex items-center gap-1">
                    Ver todas <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
                <div className="space-y-4">
                  {upcomingSessions.map((s) => (
                    <div key={s.date + s.time} className="flex items-start gap-4 p-4 rounded-xl bg-[#F9F6F0] hover:bg-[#F0EBE0] transition-colors cursor-pointer group">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 text-[#00668A]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-[#00668A] truncate">{s.companion}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            s.status === 'confirmada' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {s.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{s.type}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{s.date}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{s.time}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#00668A] transition-colors mt-2 flex-shrink-0" />
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-6 bg-[#00668A] text-white rounded-xl h-11 text-sm">
                  Agendar nueva sesión <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Reveal>

            {/* Recent Activity */}
            <Reveal delay={100}>
              <div className="bg-white rounded-[2rem] p-6 shadow-soft">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-[#00668A]">Actividad reciente</h2>
                  <a href="#" className="text-sm text-[#87CEEB] hover:text-[#00668A] transition-colors flex items-center gap-1">
                    Ver todo <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
                <div className="space-y-4">
                  {activities.map((a) => (
                    <div key={a.text} className="flex items-start gap-4 p-3 rounded-xl hover:bg-[#F9F6F0] transition-colors">
                      <div className={`w-9 h-9 bg-[#F9F6F0] rounded-xl flex items-center justify-center flex-shrink-0 ${a.color}`}>
                        <a.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-600">{a.text}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Profile Card */}
          <Reveal delay={150}>
            <div className="bg-gradient-to-br from-[#00668A] to-[#00668A]/90 rounded-[2rem] p-8 shadow-soft text-white">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-[1.25rem] flex items-center justify-center text-2xl font-bold">
                  MG
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">María García</h3>
                  <p className="text-white/60 text-sm">Bogotá D.C. — Miembro desde 2025</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1 text-sm text-white/80">
                      <Star className="w-4 h-4 fill-[#87CEEB] text-[#87CEEB]" />
                      4.9
                    </div>
                    <div className="flex items-center gap-1 text-sm text-white/80">
                      <MapPin className="w-4 h-4 text-[#87CEEB]" />
                      Chapinero
                    </div>
                    <div className="flex items-center gap-1 text-sm text-white/80">
                      <Heart className="w-4 h-4 text-[#87CEEB]" />
                      12 sesiones
                    </div>
                  </div>
                </div>
                <Button className="bg-white text-[#00668A] hover:bg-white/90 rounded-xl">
                  <User className="w-4 h-4 mr-2" /> Ver perfil
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
