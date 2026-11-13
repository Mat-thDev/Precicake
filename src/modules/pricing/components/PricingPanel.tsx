import { useAtom, useAtomValue } from 'jotai';
import { Sparkles } from 'lucide-react';
import {
  multiplierAtom,
  pricingResultAtom,
  selectedCountAtom,
  yieldInputAtom,
} from '@/store/calculator';
import { MULTIPLICADORES } from '@/services/pricing';
import { formatBRL, parseNumericInput } from '@/services/format';

function Row({
  label,
  value,
  strong = false,
  muted = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span
        className={`text-sm ${muted ? 'text-base-content/50' : 'text-base-content/70'}`}
      >
        {label}
      </span>
      <span
        className={`tabular-nums ${
          strong ? 'font-semibold text-base-content' : 'text-base-content/90'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export function PricingPanel() {
  const result = useAtomValue(pricingResultAtom);
  const selectedCount = useAtomValue(selectedCountAtom);
  const [multiplier, setMultiplier] = useAtom(multiplierAtom);
  const [yieldInput, setYieldInput] = useAtom(yieldInputAtom);

  const rendimento = parseNumericInput(yieldInput);
  const temRendimento = rendimento > 0;
  const vazio = selectedCount === 0;

  return (
    <section className="flex flex-col gap-4 lg:sticky lg:top-6">
      <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
        <header className="border-b border-base-300 p-4">
          <h2 className="text-base font-semibold">Precificação</h2>
          <p className="text-xs text-base-content/60">
            Custos indiretos de 20% + multiplicador sobre o custo ajustado.
          </p>
        </header>

        <div className="flex flex-col gap-3 p-4">
          <Row
            label="Custo dos ingredientes"
            value={formatBRL(result.custoIngredientes)}
          />
          <Row label="Custos indiretos (20%)" value={formatBRL(result.custosIndiretos)} />

          <div className="divider my-1" />

          <Row label="Custo ajustado" value={formatBRL(result.custoAjustado)} strong />

          <div className="mt-1 flex items-center justify-between gap-3">
            <span className="text-sm text-base-content/70">Multiplicador</span>
            <div className="join">
              {MULTIPLICADORES.map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`btn btn-xs join-item transition-colors duration-150 ${
                    multiplier === m ? 'btn-primary' : 'btn-ghost'
                  }`}
                  onClick={() => setMultiplier(m)}
                >
                  {m}x
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-primary/10 p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
              <Sparkles className="size-4" />
              Preço de venda
            </span>
            <span
              className={`text-2xl font-bold tabular-nums text-primary transition-opacity duration-200 ${
                vazio ? 'opacity-40' : 'opacity-100'
              }`}
            >
              {formatBRL(result.precoVenda)}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-sm font-medium">Rendimento</span>
            <span className="text-xs text-base-content/50">
              Opcional — calcula custo e preço por unidade.
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              inputMode="decimal"
              placeholder="0"
              className="input input-sm input-bordered w-20 text-right tabular-nums"
              value={yieldInput}
              onChange={(e) => setYieldInput(e.target.value)}
            />
            <span className="text-xs text-base-content/50">un</span>
          </div>
        </div>

        <div
          className={`grid transition-all duration-200 ease-out ${
            temRendimento
              ? 'mt-3 grid-rows-[1fr] opacity-100'
              : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-3 border-t border-base-300 pt-3">
              <Row
                label="Custo por unidade"
                value={formatBRL(result.custoPorUnidade ?? 0)}
              />
              <Row
                label="Preço por unidade"
                value={formatBRL(result.precoPorUnidade ?? 0)}
                strong
              />
            </div>
          </div>
        </div>

        {vazio && (
          <p className="mt-3 text-center text-xs text-base-content/40">
            Selecione ingredientes para ver o cálculo.
          </p>
        )}
      </div>
    </section>
  );
}
