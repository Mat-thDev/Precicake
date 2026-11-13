import { useAtom, useAtomValue } from 'jotai';
import { Check, Plus, Search } from 'lucide-react';
import {
  filteredIngredientsAtom,
  searchAtom,
  selectionAtom,
} from '@/store/calculator';
import { formatBRL, formatUnitCost } from '@/services/format';

function parseQuantity(raw: string): number {
  const n = Number.parseFloat(raw.replace(',', '.'));
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function IngredientTable() {
  const ingredients = useAtomValue(filteredIngredientsAtom);
  const [search, setSearch] = useAtom(searchAtom);
  const [selection, setSelection] = useAtom(selectionAtom);

  const toggle = (id: string) => {
    setSelection((prev) => {
      const next = { ...prev };
      if (id in next) delete next[id];
      else next[id] = '1';
      return next;
    });
  };

  const setQuantity = (id: string, value: string) => {
    setSelection((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
      <header className="flex flex-col gap-3 border-b border-base-300 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold">Ingredientes</h2>
          <p className="text-xs text-base-content/60">
            Selecione e informe a quantidade de cada ingrediente.
          </p>
        </div>
        <label className="input input-sm input-bordered flex w-full items-center gap-2 bg-base-200/50 sm:w-56">
          <Search className="size-3.5 opacity-50" />
          <input
            type="text"
            placeholder="Buscar ingrediente"
            className="grow bg-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </header>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr className="text-xs text-base-content/50">
              <th className="w-10" />
              <th>Ingrediente</th>
              <th className="hidden sm:table-cell">Embalagem</th>
              <th className="text-right">Custo/un.</th>
              <th className="text-right">Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ingredient) => {
              const selected = ingredient.id in selection;
              const quantidade = selection[ingredient.id] ?? '';
              const custo =
                selected ? ingredient.custoPorUnidade * parseQuantity(quantidade) : 0;

              return (
                <tr
                  key={ingredient.id}
                  onClick={() => toggle(ingredient.id)}
                  className={`cursor-pointer transition-colors duration-150 ${
                    selected ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-base-200/60'
                  }`}
                >
                  <td>
                    <span
                      className={`flex size-5 items-center justify-center rounded-md border transition-all duration-150 ${
                        selected
                          ? 'border-primary bg-primary text-primary-content'
                          : 'border-base-300 bg-base-100'
                      }`}
                    >
                      {selected && <Check className="size-3.5" strokeWidth={3} />}
                    </span>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span className="font-medium leading-tight">{ingredient.nome}</span>
                      <span className="text-xs text-base-content/50 sm:hidden">
                        {ingredient.quantidadeEmbalagem} {ingredient.unidadeMedida} ·{' '}
                        {formatBRL(ingredient.precoCompra)}
                      </span>
                      {selected && (
                        <span className="text-xs text-primary">
                          Subtotal: {formatBRL(custo)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="hidden text-sm text-base-content/70 sm:table-cell">
                    {ingredient.quantidadeEmbalagem} {ingredient.unidadeMedida} ·{' '}
                    {formatBRL(ingredient.precoCompra)}
                  </td>
                  <td className="whitespace-nowrap text-right text-sm tabular-nums text-base-content/70">
                    {formatUnitCost(ingredient.custoPorUnidade)}/
                    {ingredient.unidadeMedida}
                  </td>
                  <td className="text-right" onClick={(e) => e.stopPropagation()}>
                    {selected ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <input
                          type="text"
                          inputMode="decimal"
                          className="input input-xs input-bordered w-20 text-right tabular-nums"
                          value={quantidade}
                          placeholder="0"
                          autoFocus
                          onChange={(e) => setQuantity(ingredient.id, e.target.value)}
                        />
                        <span className="w-6 text-xs text-base-content/50">
                          {ingredient.unidadeMedida}
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs btn-circle"
                        aria-label={`Adicionar ${ingredient.nome}`}
                        onClick={() => toggle(ingredient.id)}
                      >
                        <Plus className="size-4" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {ingredients.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <Search className="size-6 opacity-30" />
            <p className="text-sm text-base-content/60">
              Nenhum ingrediente encontrado para “{search}”.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
