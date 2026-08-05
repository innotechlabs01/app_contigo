'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import { useWizard } from '@/context/wizard-context';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import type { Occasion } from '@/lib/types';

export default function OccasionStep() {
  const router = useRouter();
  const { setOccasion } = useWizard();
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSupabase()
      .from('occasions')
      .select('*')
      .order('sort_order')
      .then(({ data, error }) => {
        if (data) setOccasions(data);
        setLoading(false);
      });
  }, []);

  const handleSelect = (occasion: Occasion) => {
    setOccasion(occasion);
    router.push('/crear/mensajes');
  };

  return (
    <div className="max-w-4xl mx-auto pt-8">
      <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Paso 1 / 4' }]} />

      <h1 className="text-3xl font-bold text-text-primary mb-2">¿Cuál es la ocasión?</h1>
      <p className="text-text-secondary mb-10">Selecciona el tipo de mensaje que quieres enviar.</p>

      {loading ? (
        <div className="grid grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[185px] rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {occasions.map((occ) => (
            <button
              key={occ.id}
              onClick={() => handleSelect(occ)}
              className="card-hover bg-white p-8 text-left"
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: `${occ.icon_color}1A` }}
                dangerouslySetInnerHTML={{ __html: occ.icon_svg }}
              />
              <h3 className="font-semibold text-lg text-text-primary mb-1">{occ.name}</h3>
              <p className="text-sm text-text-muted">{occ.description}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
