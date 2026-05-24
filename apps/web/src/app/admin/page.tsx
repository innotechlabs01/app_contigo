'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users, FileText, Clock, CheckCircle2, XCircle, ArrowRight,
  TrendingUp, AlertTriangle, Plus, Eye
} from 'lucide-react';

interface Request {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  location: string;
  service_type: string;
  status: string;
  application_date: string;
}

interface Questionnaire {
  id: string;
  name: string;
  isPublished: boolean;
  questions?: { length: number };
  passingScore?: number;
  stepTarget?: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [requests, setRequests] = useState<Request[]>([]);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/requests').then(r => r.json()),
      fetch('/api/questionnaires').then(r => r.json()),
    ]).then(([requestsData, questionnairesData]) => {
      setRequests(requestsData.slice(0, 5));
      setQuestionnaires((questionnairesData.questionnaires || questionnairesData).slice(0, 4));
      setStats({
        total: requestsData.length,
        pending: requestsData.filter((r: Request) => r.status === 'pending' || r.status === 'in_review').length,
        approved: requestsData.filter((r: Request) => r.status === 'approved').length,
        rejected: requestsData.filter((r: Request) => r.status === 'rejected').length,
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: 'Total Solicitudes',
      value: stats.total,
      icon: Users,
      gradient: 'from-[#00668A] to-[#87CEEB]',
      shadow: 'shadow-[#00668A]/20',
      bg: 'bg-[#00668A]/5',
      textColor: 'text-[#00668A]',
    },
    {
      label: 'Pendientes',
      value: stats.pending,
      icon: Clock,
      gradient: 'from-amber-500 to-orange-400',
      shadow: 'shadow-amber-500/20',
      bg: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      label: 'Aprobadas',
      value: stats.approved,
      icon: CheckCircle2,
      gradient: 'from-emerald-500 to-green-400',
      shadow: 'shadow-emerald-500/20',
      bg: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      label: 'Rechazadas',
      value: stats.rejected,
      icon: XCircle,
      gradient: 'from-red-500 to-rose-400',
      shadow: 'shadow-red-500/20',
      bg: 'bg-red-50',
      textColor: 'text-red-600',
    },
  ];

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-[#00668A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Panel de Administración</h1>
        <p className="text-slate-500 text-sm mt-1">Resumen general del sistema contigo</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                  <Icon className={`w-5 h-5 ${stat.textColor}`} />
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${stat.bg} ${stat.textColor}`}>
                  {stat.label === 'Total Solicitudes' ? 'Total' : stat.label}
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${stat.gradient}`}
                  style={{ width: `${stats.total > 0 ? (stat.value / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Requests */}
        <div className="bg-white rounded-2xl border border-slate-100">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#00668A]/5">
                <Users className="w-4 h-4 text-[#00668A]" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-800">Solicitudes Recientes</h2>
                <p className="text-xs text-slate-400">Últimas 5 solicitudes</p>
              </div>
            </div>
            <Link
              href="/admin/requests"
              className="text-xs font-medium text-[#00668A] hover:text-[#005577] flex items-center gap-1"
            >
              Ver todas <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {requests.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">No hay solicitudes aún</div>
            ) : (
              requests.map((req) => (
                <div key={req.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#87CEEB] to-[#00668A] flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {req.first_name[0]}{req.last_name[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">
                          {req.first_name} {req.last_name}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{req.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        req.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                        req.status === 'rejected' ? 'bg-red-50 text-red-600' :
                        req.status === 'in_review' ? 'bg-blue-50 text-blue-600' :
                        'bg-amber-50 text-amber-600'
                      }`}>
                        {req.status === 'approved' ? 'Aprobada' :
                         req.status === 'rejected' ? 'Rechazada' :
                         req.status === 'in_review' ? 'En Revisión' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Questionnaires */}
        <div className="bg-white rounded-2xl border border-slate-100">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-50">
                <FileText className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-800">Cuestionarios</h2>
                <p className="text-xs text-slate-400">Resumen rápido</p>
              </div>
            </div>
            <Link
              href="/admin/questionnaires"
              className="text-xs font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {questionnaires.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">No hay cuestionarios creados</div>
            ) : (
              questionnaires.map((q) => (
                <div key={q.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-700 truncate">{q.name}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          q.isPublished ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {q.isPublished ? 'Activo' : 'Borrador'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {q.questions?.length || 0} preguntas · Puntaje mínimo: {q.passingScore || 0}%
                      </p>
                    </div>
                    <button
                      onClick={() => router.push(`/admin/questionnaires/${q.id}`)}
                      className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <Eye className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-[#00668A]/5">
            <TrendingUp className="w-4 h-4 text-[#00668A]" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800">Acciones Rápidas</h2>
            <p className="text-xs text-slate-400">Atajos para tareas frecuentes</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => router.push('/admin/questionnaires/new')}
            className="p-4 rounded-xl bg-[#00668A]/5 hover:bg-[#00668A]/10 border border-[#00668A]/10 transition-colors text-left group"
          >
            <Plus className="w-5 h-5 text-[#00668A] mb-2" />
            <p className="text-sm font-medium text-slate-700 group-hover:text-[#00668A] transition-colors">Nuevo Cuestionario</p>
            <p className="text-xs text-slate-400 mt-0.5">Crear desde cero</p>
          </button>
          <button
            onClick={() => router.push('/admin/requests')}
            className="p-4 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-100 transition-colors text-left group"
          >
            <AlertTriangle className="w-5 h-5 text-amber-600 mb-2" />
            <p className="text-sm font-medium text-slate-700 group-hover:text-amber-700 transition-colors">Revisar Solicitudes</p>
            <p className="text-xs text-amber-600/70 mt-0.5">{stats.pending} pendientes</p>
          </button>
          <button
            onClick={() => router.push('/admin/questionnaires')}
            className="p-4 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-100 transition-colors text-left group"
          >
            <FileText className="w-5 h-5 text-purple-600 mb-2" />
            <p className="text-sm font-medium text-slate-700 group-hover:text-purple-700 transition-colors">Gestionar Cuestionarios</p>
            <p className="text-xs text-purple-600/70 mt-0.5">{questionnaires.length} creados</p>
          </button>
          <Link
            href="/"
            className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors text-left group block"
          >
            <Eye className="w-5 h-5 text-slate-500 mb-2" />
            <p className="text-sm font-medium text-slate-700 group-hover:text-slate-800 transition-colors">Ver Sitio Web</p>
            <p className="text-xs text-slate-400 mt-0.5">Página principal</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
