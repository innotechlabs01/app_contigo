'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuestionnaireStore } from '@/infrastructure/store/questionnaire-store';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Pencil, Trash2, Globe, Lock } from 'lucide-react';

export default function QuestionnairesPage() {
  const router = useRouter();
  const { questionnaires, fetchQuestionnaires, deleteQuestionnaire, publishQuestionnaire, isLoading } = useQuestionnaireStore();
  const [mounted, setMounted] = useState(false);

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

  if (!mounted) return null;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Cuestionarios</h1>
          <p className="text-slate-600 mt-1">Gestiona los cuestionarios del sistema</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Cuestionario
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Cargando...</div>
      ) : questionnaires.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl">
          <p className="text-slate-500 mb-4">No hay cuestionarios creados</p>
          <Button onClick={handleCreate}>Crear primer cuestionario</Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {questionnaires.map((q) => (
            <div
              key={q.id}
              className="bg-white p-6 rounded-2xl shadow-soft flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-slate-800">{q.name}</h3>
                  {q.isPublished ? (
                    <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      <Globe className="w-3 h-3" /> Activo
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full">
                      <Lock className="w-3 h-3" /> Borrador
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  {q.questions.length} preguntas · Step: {q.stepTarget} · Puntaje mínimo: {q.passingScore}%
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handlePreview(q.id)}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEdit(q.id)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                {!q.isPublished && (
                  <Button variant="outline" size="sm" onClick={() => publishQuestionnaire(q.id)}>
                    <Globe className="w-4 h-4" />
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => deleteQuestionnaire(q.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}