import { BRAND } from '@/config';

interface PageShellProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

/**
 * Temporary page shell used during Phase 1 to show route skeleton pages.
 * Will be replaced by full page implementations in later phases.
 */
export default function PageShell({ title, subtitle, children }: PageShellProps) {
  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20">
      <h1 className="font-display text-display-md md:text-display-lg text-brand-black mb-4 text-center">
        {title}
      </h1>
      {subtitle && (
        <p className="font-body text-sm md:text-base text-brand-gray-500 max-w-md text-center mb-8">
          {subtitle}
        </p>
      )}
      {children || (
        <div className="border border-brand-gray-200 px-6 py-3">
          <p className="font-body text-xs uppercase tracking-widest text-brand-gray-400">
            {BRAND.name} · Coming Soon
          </p>
        </div>
      )}
    </section>
  );
}
