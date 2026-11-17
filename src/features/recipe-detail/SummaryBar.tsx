import { useState } from 'react';
import clsx from 'clsx';
import { ChevronUp, Copy } from 'lucide-react';
import { showToast } from '../../hooks/useToast';
import type { PricingResult } from '../../lib/pricing';
import { formatCurrency } from '../../lib/utils';

interface SummaryBarProps {
  pricing: PricingResult;
  multiplier: 2 | 3;
  /** Percentual de custo (%) — para o painel expandido */
  percentCost: number;
  onMultiplierChange: (multiplier: 2 | 3) => void;
  /** Exibe a linha de preço por peça quando definido */
  pricePerPiece?: number;
}

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-2 text-sm">
    <span className="text-base-content/70">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

/**
 * Barra de resumo fixa no rodapé da página da receita (acima da bottom bar).
 * Sempre visível: total + ×2/×3 tocáveis; painel expansível com o detalhe.
 */
export function SummaryBar({
  pricing,
  multiplier,
  percentCost,
  onMultiplierChange,
  pricePerPiece,
}: SummaryBarProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="shrink-0 border-t border-base-200 bg-base-100/95 backdrop-blur">
      {expanded && (
        <div className="space-y-2 px-4 pt-3">
          <SummaryRow
            label="Custo ingredientes (CI)"
            value={formatCurrency(pricing.ingredientCost)}
          />
          <SummaryRow
            label={`Custo percentual (${percentCost.toLocaleString('pt-BR')}%)`}
            value={formatCurrency(pricing.percentValue)}
          />
          <SummaryRow label="Custos adicionais" value={formatCurrency(pricing.additionalCost)} />
          <SummaryRow label="Custo total" value={formatCurrency(pricing.totalPrice)} />
          {pricePerPiece !== undefined && (
            <SummaryRow label="Preço por peça" value={formatCurrency(pricePerPiece)} />
          )}
        </div>
      )}

      <div className="flex items-center gap-2 px-4 py-2.5">
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          <div className="min-w-0">
            <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-base-content/50">
              {expanded ? 'Resumo da receita' : 'Custo total'}
            </p>
            <p className="truncate text-lg font-bold leading-tight">
              {formatCurrency(pricing.totalPrice)}
            </p>
          </div>
          <ChevronUp
            className={clsx(
              'h-4 w-4 shrink-0 text-base-content/50 transition-transform',
              expanded && 'rotate-180',
            )}
            aria-hidden
          />
        </button>

        <div className="flex shrink-0 gap-1.5">
          {[2, 3].map((mult) => {
            const selected = multiplier === mult;
            const price = mult === 2 ? pricing.salePrices.x2 : pricing.salePrices.x3;

            return (
              <div
                key={mult}
                role="button"
                tabIndex={0}
                aria-pressed={selected}
                className={clsx(
                  'cursor-pointer rounded-xl border px-2.5 py-1.5 text-right transition-colors active:scale-95',
                  selected
                    ? 'border-primary bg-primary/10'
                    : 'border-base-200 bg-base-100 hover:border-base-300',
                )}
                onClick={() => onMultiplierChange(mult as 2 | 3)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onMultiplierChange(mult as 2 | 3);
                  }
                }}
              >
                <div className="flex items-center gap-1">
                  <span
                    className={clsx(
                      'text-[0.6rem] font-semibold',
                      selected ? 'text-primary' : 'text-base-content/50',
                    )}
                  >
                    Venda ×{mult}
                  </span>
                  <button
                    type="button"
                    className="text-base-content/40 transition-colors hover:text-base-content"
                    aria-label={`Copiar preço de venda multiplicado por ${mult}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      void navigator.clipboard
                        ?.writeText(formatCurrency(price))
                        .then(() => showToast('Preço copiado'))
                        .catch(() => {});
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
                <span
                  className={clsx(
                    'block text-sm font-bold leading-tight',
                    selected ? 'text-primary' : 'text-base-content',
                  )}
                >
                  {formatCurrency(price)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SummaryBar;
