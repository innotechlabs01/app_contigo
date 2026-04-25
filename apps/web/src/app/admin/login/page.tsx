'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@contigo.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (email === 'admin@contigo.com' && password === 'admin123') {
      localStorage.setItem('admin_authenticated', 'true');
      router.push('/admin/questionnaires');
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-soft p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Admin Contigo</h1>
            <p className="text-slate-500 mt-2">Acceso al panel de administración</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 rounded-full border-2 border-slate-200 focus:border-primary focus:outline-none"
                placeholder="admin@contigo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 rounded-full border-2 border-slate-200 focus:border-primary focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-12">
              Iniciar Sesión
            </Button>
          </form>

          <div className="mt-6 p-4 bg-slate-50 rounded-xl">
            <p className="text-xs text-slate-500 text-center">
              Datos de prueba:<br />
              Email: admin@contigo.com<br />
              Contraseña: admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
