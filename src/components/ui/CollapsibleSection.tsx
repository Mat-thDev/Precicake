import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import Collapse from './Collapse';

/**
 * Seção colapsável de formulário — header sempre visível
 * (título + resumo à direita + chevron) e corpo animado.
 * O estado open/onToggle fica no pai (padrão acordeão).
 */
export function CollapsibleSection({
  title,
  description,
  summary,
  open,
  onToggle,
  children,
}: UI.CollapsibleSectionProps) {
  return (
    <section className="rounded-2xl border border-base-200 bg-base-100">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span className="font-bold">{title}</span>

        <span className="flex shrink-0 items-center gap-2">
          {summary}
          <ChevronDown
            className={clsx(
              'h-4 w-4 shrink-0 text-base-content/50 transition-transform',
              open && 'rotate-180',
            )}
            aria-hidden
          />
        </span>
      </button>

      <Collapse open={open}>
        <div className="border-t border-base-200 px-4 pb-4 pt-3">
          {description && <p className="mb-3 text-xs text-base-content/60">{description}</p>}
          {children}
        </div>
      </Collapse>
    </section>
  );
}

export default CollapsibleSection;
