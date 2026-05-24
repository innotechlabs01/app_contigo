'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, FileText, MessageSquare, LogOut,
  ChevronDown, Bell, Menu, X, Users, Settings,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const [checking, setChecking] = useState(!isLoginPage);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isLoginPage) return;

    fetch('/api/admin/me')
      .then((res) => {
        if (!res.ok) router.push('/admin/login');
      })
      .catch(() => router.push('/admin/login'))
      .finally(() => setChecking(false));
  }, [router, isLoginPage]);

  const handleLogout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/admin/login');
  };

  if (isLoginPage) return <>{children}</>;

  if (checking) {
    return (
      <div className="min-h-screen bg-[#F9F6F0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-[#00668A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Cuestionarios', href: '/admin/questionnaires', icon: FileText },
    { name: 'Solicitudes', href: '/admin/requests', icon: MessageSquare },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname?.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0] flex">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Brand */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#87CEEB] to-[#00668A] rounded-xl flex items-center justify-center shadow-lg shadow-[#00668A]/20">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <Link href="/admin" className="font-bold text-[#00668A] tracking-tight">contigo</Link>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          <p className="px-3 text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-2 mt-1">Menú</p>
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                  active
                    ? 'bg-[#00668A] text-white shadow-lg shadow-[#00668A]/20'
                    : 'text-slate-500 hover:text-[#00668A] hover:bg-[#00668A]/5'
                }`}
              >
                <item.icon className={`w-4 h-4 ${active ? 'text-[#87CEEB]' : ''}`} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <div className="flex items-center gap-4">
              <button className="lg:hidden p-2 -ml-2" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-5 h-5 text-slate-500" />
              </button>
              <div>
                <h2 className="text-sm font-semibold text-slate-700">
                  {navigation.find(n => isActive(n.href))?.name || 'Admin'}
                </h2>
                <p className="text-xs text-slate-400">Panel de administración</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-xl hover:bg-[#F9F6F0] transition-colors">
                <Bell className="w-4 h-4 text-slate-400" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E07A5F] rounded-full" />
              </button>
              <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                <div className="w-8 h-8 bg-gradient-to-br from-[#87CEEB] to-[#00668A] rounded-lg flex items-center justify-center text-white font-bold text-xs">
                  A
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-medium text-slate-700">Admin</p>
                  <p className="text-[10px] text-slate-400">Super Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
