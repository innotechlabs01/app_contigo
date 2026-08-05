import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

export function Header() {
  return (
    <header className="flex items-center justify-between px-8 h-[84px]">
      <Link href="/" className="flex items-baseline">
        <span className="font-bold text-2xl text-brand-blue">Con</span>
        <span className="font-bold text-2xl text-brand-blue-dark">Sentido</span>
      </Link>
      <Link
        href="/crear/ocasion"
        className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-blue-50 transition-colors text-text-secondary"
      >
        <ShoppingCart className="w-5 h-5" />
        <span className="font-medium text-sm">Crear mensaje</span>
      </Link>
    </header>
  );
}
