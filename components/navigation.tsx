'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, BrainCircuit, ChartBar, Info, MessageCircle, type LucideIcon } from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();

  const navItems: { href: string; label: string; icon: LucideIcon }[] = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/predict', label: 'Predict', icon: BrainCircuit },
    { href: '/results', label: 'Results', icon: ChartBar },
    { href: '/model-info', label: 'Model Info', icon: Info },
    { href: '/assistant', label: 'AI Assistant', icon: MessageCircle },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">
            Dear_Bits
          </h1>
          <div className="flex items-center gap-4 sm:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5 sm:hidden" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
