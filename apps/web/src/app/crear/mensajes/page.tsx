'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import { useWizard } from '@/context/wizard-context';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import type { Message } from '@/lib/types';

export default function MessagesStep() {
  const router = useRouter();
  const { occasion, setSelectedMessage } = useWizard();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [seed, setSeed] = useState(0);

  const fetchMessages = useCallback(() => {
    if (!occasion) return;
    setLoading(true);
    getSupabase()
      .from('messages')
      .select('*')
      .eq('occasion_id', occasion.id)
      .limit(5)
      .then(({ data }) => {
        if (data) {
          const shuffled = [...data].sort(() => 0.5 - Math.random()).slice(0, 5);
          setMessages(shuffled);
        }
        setLoading(false);
      });
  }, [occasion]);

  useEffect(() => {
    if (!occasion) {
      router.push('/crear/ocasion');
      return;
    }
    fetchMessages();
  }, [occasion, seed, fetchMessages, router]);

  const handleSelect = (message: Message) => {
    setSelectedMessage(message);
    router.push('/crear/confirmar');
  };

  if (!occasion) return null;

  return (
    <div className="max-w-4xl mx-auto pt-8">
      <Breadcrumb
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Ocasión', href: '/crear/ocasion' },
          { label: 'Paso 2 / 4' },
        ]}
      />

      <h1 className="text-3xl font-bold text-text-primary mb-2">
        Mensajes para {occasion.name.toLowerCase()}
      </h1>
      <p className="text-text-secondary mb-10">
        Elige el que más resuene contigo. Si ninguno te convence, genera cinco nuevos.
      </p>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <button
              key={msg.id}
              onClick={() => handleSelect(msg)}
              className="card-hover bg-white p-6 text-left w-full flex items-start gap-5"
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 text-text-secondary flex items-center justify-center text-sm font-semibold">
                {i + 1}
              </span>
              <p className="text-text-secondary leading-relaxed">{msg.text}</p>
            </button>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={() => setSeed((s) => s + 1)}
          disabled={loading}
          className="btn-secondary px-6 py-2.5 text-sm inline-flex"
        >
          Generar más mensajes
        </button>
      </div>
    </div>
  );
}
