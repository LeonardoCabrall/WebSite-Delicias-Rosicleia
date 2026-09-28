'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { FlowButton } from '@/components/ui/flow-button';
import { categorias } from '@/lib/site-data';
import { cn } from '@/lib/utils';

export function SiteHeader({
  paginaCardapio = false,
}: {
  paginaCardapio?: boolean;
}) {
  const [isSolid, setIsSolid] = useState(false);

  useEffect(() => {
    let frame = 0;

    const updateHeader = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setIsSolid(window.scrollY > Math.min(window.innerHeight * 0.58, 520));
      });
    };

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    window.addEventListener('resize', updateHeader);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateHeader);
      window.removeEventListener('resize', updateHeader);
    };
  }, []);

  return (
    <header
      className={cn(
        'site-header fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300',
        paginaCardapio || isSolid
          ? 'border-gold-light/55 bg-background/92 backdrop-blur-md'
          : 'border-gold-light/20 bg-background/45 backdrop-blur-[2px]',
      )}
    >
      <div className="mx-auto flex h-[4.75rem] w-[min(1180px,calc(100%-24px))] items-center justify-between gap-2 sm:w-[min(1180px,calc(100%-32px))] sm:gap-3">
        <Link
          href={paginaCardapio ? '/' : '#inicio'}
          aria-label="Delícias Rosicleia — voltar ao início"
          className="brand-lockup shrink-0 font-heading tracking-[-0.035em]"
        >
          <span className="brand-lockup__compact">
            <span>Delícias</span>
            <span>Rosicleia</span>
          </span>
          <span className="brand-lockup__wide">Delícias Rosicleia</span>
        </Link>

        <nav aria-label="Navegação principal" className="hidden md:block">
          <ul className="flex items-center gap-5 lg:gap-7">
            <li>
              <Link
                href="/cardapio"
                aria-current={paginaCardapio ? 'page' : undefined}
                className="header-nav-link"
              >
                Cardápio
              </Link>
            </li>
            {categorias.slice(1, 4).map((categoria) => (
              <li key={categoria} className="hidden max-w-32 xl:block">
                <Link
                  href={`/cardapio?categoria=${encodeURIComponent(categoria)}`}
                  title={categoria}
                  className="header-nav-link block truncate"
                >
                  {categoria}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={paginaCardapio ? '/#horarios' : '#horarios'}
                className="header-nav-link"
              >
                Horários
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/cardapio"
            aria-current={paginaCardapio ? 'page' : undefined}
            className="header-mobile-menu md:hidden"
          >
            Cardápio
          </Link>
          <FlowButton text="iFood" className="min-h-11 px-4 py-2.5 sm:px-6" />
        </div>
      </div>
    </header>
  );
}
