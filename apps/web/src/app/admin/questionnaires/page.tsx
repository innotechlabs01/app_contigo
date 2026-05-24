'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuestionnaireStore } from '@/infrastructure/store/questionnaire-store';
import { Button } from '@/components/ui/button';
import {
  Plus, Eye, Pencil, Trash2, Globe, Lock,
  FileText, AlertTriangle, CheckCircle2, Search
} from 'lucide-react';

export default function QuestionnairesPage() {
  const router = useRouter();
  const { questionnaires, fetchQuestionnaires, deleteQuestionnaire, publishQuestionnaire, isLoading } = useQuestionnaireStore();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    setMounted(true);
    fetchQuestionnaires();
  }, [fetchQuestionnaires]);

  const handleCreate = () => {
    router.push('/admin/questionnaires/new');
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/questionnaires/${id}`);
  };

  const handlePreview = (id: string) => {
    router.push(`/admin/questionnaires/${id}/preview`);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) {
      await deleteQuestionnaire(id);
    }
  };

  const filteredQuestionnaires = questionnaires.filter((q) => {
    const matchesSearch = q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' ? true : filter === 'published' ? q.isPublished : !q.isPublished;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: questionnaires.length,
    published: questionnaires.filter(q => q.isPublished).length,
    draft: questionnaires.filter(q => !q.isPublished).length,
  };

  if (!mounted) return null;

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Cuestionarios</h1>
          <p className="text-slate-500 text-sm mt-1">Gestiona los cuestionarios del sistema</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Cuestionario
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: stats.total, icon: FileText, color: 'text-[#00668A]', bg: 'bg-[#00668A]/5' },
          { label: 'Activos', value: stats.published, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Borradores', value: stats.draft, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-100 p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-800">{stat.value}</p>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar cuestionarios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 focus:border-[#00668A] focus:outline-none text-sm bg-white"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'published', 'draft'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-[#00668A] text-white shadow-lg shadow-[#00668A]/20'
                  : 'bg-white text-slate-500 hover:text-[#00668A] border border-slate-200'
              }`}
            >
              {f === 'all' ? 'Todas' : f === 'published' ? 'Activos' : 'Borradores'}
            </button>
          ))}
        </div>
      </div>

      {/* Loading / Empty / Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-3 border-[#00668A] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredQuestionnaires.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-50 flex items-center justify-center">
            <FileText className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-500 font-medium mb-1">
            {searchQuery ? 'Sin resultados' : 'No hay cuestionarios creados'}
          </p>
          <p className="text-sm text-slate-400 mb-4">
            {searchQuery ? 'Intenta con otra búsqueda' : 'Crea tu primer cuestionario para empezar'}
          </p>
          {!searchQuery && (
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Primer Cuestionario
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredQuestionnaires.map((q) => (
            <div
              key={q.id}
              className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      q.isPublished ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : 'bg-gradient-to-br from-slate-300 to-slate-500'
                    }`}>
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-800 truncate group-hover:text-[#00668A] transition-colors">
                        {q.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                          q.isPublished
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {q.isPublished ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                          {q.isPublished ? 'Activo' : 'Borrador'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 ml-[52px]">
                    {q.questions.length} preguntas · Step: {q.stepTarget} · Puntaje mínimo: {q.passingScore}%
                  </p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => handlePreview(q.id)}
                    className="p-2.5 rounded-xl text-slate-400 hover:text-[#00668A] hover:bg-[#00668A]/5 transition-all"
                    title="Vista previa"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(q.id)}
                    className="p-2.5 rounded-xl text-slate-400 hover:text-[#00668A] hover:bg-[#00668A]/5 transition-all"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  {!q.isPublished && (
                    <button
                      onClick={() => publishQuestionnaire(q.id)}
                      className="p-2.5 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                      title="Publicar"
                    >
                      <Globe className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(q.id, q.name)}
                    className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
