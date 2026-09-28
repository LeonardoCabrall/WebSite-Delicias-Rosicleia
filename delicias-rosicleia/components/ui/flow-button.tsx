'use client';

import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { IFOOD_LINK } from '@/lib/site-data';

export function FlowButton({
  text = 'Peça no iFood',
  className,
}: {
  text?: string;
  className?: string;
}) {
  return (
    <a
      href={IFOOD_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${text} — abre em uma nova aba`}
      className={cn(
        'group relative inline-flex min-h-11 cursor-pointer items-center gap-1 overflow-hidden rounded-[100px] border-[1.5px] border-gold-dark bg-transparent px-8 py-3 text-sm font-semibold text-gold-ink transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:rounded-[12px] hover:border-transparent hover:text-[#2b2216] active:scale-[0.95] motion-reduce:transition-none',
        className,
      )}
    >
      <ArrowRight
        aria-hidden="true"
        className="absolute left-[-25%] z-[9] size-4 fill-none stroke-current transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:left-4 motion-reduce:transition-none"
      />
      <span className="relative z-[1] -translate-x-3 transition-all duration-[800ms] ease-out group-hover:translate-x-3 motion-reduce:transition-none">
        {text}
      </span>
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-gold opacity-0 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:size-[220px] group-hover:opacity-100 motion-reduce:transition-none"
      />
      <ArrowRight
        aria-hidden="true"
        className="absolute right-4 z-[9] size-4 fill-none stroke-current transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:right-[-25%] motion-reduce:transition-none"
      />
    </a>
  );
}
