'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
      aria-pressed={isDark}
      title={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
      className="grid size-11 shrink-0 place-items-center rounded-full border border-gold-dark/65 text-gold-ink transition-colors hover:bg-gold-light/45"
    >
      <Sun aria-hidden="true" className="size-[18px] dark:hidden" />
      <Moon aria-hidden="true" className="hidden size-[18px] dark:block" />
    </button>
  );
}
