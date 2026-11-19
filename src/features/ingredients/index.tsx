import { useState } from 'react';
import { Search, Wheat, X } from 'lucide-react';
import { Button } from '../../components';
import useRouter from '../../hooks/useRouter';
import useCatalog from '../../hooks/useCatalog';
import { formatCurrency, normalizeSearch } from '../../lib/utils';

const unitPriceFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

const getUnitPrice = (item: Catalog.Item): string => {
  if (item.packageQty <= 0) return '—';
  const unitPrice = item.packagePrice / item.packageQty;
  return `R$ ${unitPriceFormatter.format(unitPrice)}/${item.unit}`;
};

const IngredientsPage = () => {
  const { navigate } = useRouter();
  const { ingredients } = useCatalog();
  const [query, setQuery] = useState('');

  const normalizedQuery = normalizeSearch(query);
  const filtered = normalizedQuery
    ? ingredients.filter((item) => normalizeSearch(item.name).includes(normalizedQuery))
    : ingredients;

  return (
    <div className="page-scroll h-full w-full px-4 py-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg font-bold">Ingredientes</h1>
          <p className="text-xs text-base-content/60">
            {ingredients.length} {ingredients.length === 1 ? 'ingrediente' : 'ingredientes'} no
            catálogo
          </p>
        </div>

        <Button variant="accent" size="sm" onClick={() => navigate('IngredientDetail')}>
          + Novo
        </Button>
      </div>

      {ingredients.length > 0 && (
        <div className="relative mb-4">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-base-content/40"
            aria-hidden
          />
          <input
            type="search"
            className="input input-sm w-full rounded-full pr-9 pl-9"
            placeholder="Buscar ingrediente…"
            aria-label="Buscar ingrediente"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <button
              type="button"
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1 text-base-content/40 active:scale-90"
              aria-label="Limpar busca"
              onClick={() => setQuery('')}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {ingredients.length === 0 ? (
        <div className="flex flex-col items-center px-6 pt-16 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Wheat className="h-10 w-10" aria-hidden />
          </div>

          <h2 className="mt-6 text-base font-bold">Nenhum ingrediente ainda</h2>

          <p className="mt-2 max-w-xs text-sm text-base-content/60">
            Cadastre ingredientes com o preço e a quantidade da embalagem para usar nas receitas.
          </p>

          <Button variant="accent" className="mt-6" onClick={() => navigate('IngredientDetail')}>
            Cadastrar primeiro ingrediente
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center px-6 pt-16 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Search className="h-10 w-10" aria-hidden />
          </div>

          <h2 className="mt-6 text-base font-bold">Nenhum ingrediente encontrado</h2>

          <p className="mt-2 max-w-xs text-sm text-base-content/60">
            Nada corresponde a “{query.trim()}”. Tente outro nome.
          </p>

          <Button variant="outline" size="sm" className="mt-4" onClick={() => setQuery('')}>
            Limpar busca
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className="w-full rounded-2xl border border-base-200 bg-base-100 p-4 text-left transition-transform active:scale-[0.99]"
                onClick={() => navigate('IngredientDetail', { ingredientId: item.id })}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold">{item.name.trim() || 'Sem nome'}</h3>
                    <p className="mt-1 text-xs text-base-content/60">
                      {formatCurrency(item.packagePrice)} ·{' '}
                      {item.packageQty.toLocaleString('pt-BR')} {item.unit}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-[0.65rem] uppercase tracking-wide text-base-content/50">
                      custo unitário
                    </p>
                    <p className="font-bold text-primary">{getUnitPrice(item)}</p>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default IngredientsPage;
