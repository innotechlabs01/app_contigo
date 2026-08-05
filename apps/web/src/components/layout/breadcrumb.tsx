import Link from 'next/link';

interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-slate-300">›</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-brand-blue transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-text-secondary">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
