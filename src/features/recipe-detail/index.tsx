import { useState, type ReactNode } from 'react';
import clsx from 'clsx';
import { ArrowLeft, Copy, Plus, Trash2 } from 'lucide-react';
import { Button, Input, NotFound } from '../../components';
import useRouter from '../../hooks/useRouter';
import useRecipes from '../../hooks/useRecipes';
import { calculatePricing, ingredientCost } from '../../lib/pricing';
import { formatCurrency, parseDecimal } from '../../lib/utils';

const UNITS: Recipe.Unit[] = ['g', 'kg', 'mL', 'L', 'un'];

const toText = (value: number | undefined): string =>
  value === undefined ? '' : String(value).replace('.', ',');

interface NumericInputProps extends Omit<UI.InputProps, 'value' | 'onChange'> {
  value: number | undefined;
  onCommit: (value: number | undefined) => void;
  /** Permite limpar o campo (commita undefined) — usado no rendimento */
  allowEmpty?: boolean;
}

/** Input numérico com estado local: aceita vírgula pt-BR e só commita valores válidos */
const NumericInput = ({
  value,
  onCommit,
  allowEmpty = false,
  className,
  ...props
}: NumericInputProps) => {
  const [text, setText] = useState(toText(value));

  return (
    <Input
      {...props}
      inputMode="decimal"
      className={className}
      value={text}
      onChange={(event) => {
        const raw = event.target.value;
        setText(raw);

        if (raw.trim() === '') {
          if (allowEmpty) onCommit(undefined);
          return;
        }

        onCommit(parseDecimal(raw));
      }}
      onBlur={() => setText(toText(value))}
    />
  );
};

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="block">
    <span className="mb-1 block text-[0.65rem] font-medium uppercase tracking-wide text-base-content/50">
      {label}
    </span>
    {children}
  </label>
);

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-2 text-sm">
    <span className="text-base-content/70">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

/**
 * Detalhe da receita — tela única estilo projeto antigo:
 * dados + resumo de precificação + edição de ingredientes.
 */
const RecipeDetailPage = () => {
  const { currentProps, goBack } = useRouter();
  const { recipes, updateRecipe } = useRecipes();
  const recipe = recipes.find((item) => item.id === currentProps?.recipeId);

  if (!recipe) {
    return (
      <NotFound
        title="Receita não encontrada"
        description="Ela pode ter sido removida. Volte para a lista e tente novamente."
      />
    );
  }

  const pricing = calculatePricing(recipe);

  const patch = (partial: Partial<Recipe.Item>) => updateRecipe(recipe.id, partial);

  const updateIngredient = (id: string, partial: Partial<Recipe.Ingredient>) =>
    patch({
      ingredients: recipe.ingredients.map((ingredient) =>
        ingredient.id === id ? { ...ingredient, ...partial } : ingredient,
      ),
    });

  const addIngredient = () =>
    patch({
      ingredients: [
        ...recipe.ingredients,
        {
          id: crypto.randomUUID(),
          name: '',
          unit: 'g',
          packagePrice: 0,
          packageQty: 0,
          usedQty: 0,
        },
      ],
    });

  const removeIngredient = (id: string) =>
    patch({ ingredients: recipe.ingredients.filter((ingredient) => ingredient.id !== id) });

  const addAdditionalCost = () =>
    patch({
      additionalCosts: [...recipe.additionalCosts, { id: crypto.randomUUID(), name: '', value: 0 }],
    });

  const removeAdditionalCost = (id: string) =>
    patch({ additionalCosts: recipe.additionalCosts.filter((cost) => cost.id !== id) });

  const copyPrice = (value: number) => {
    void navigator.clipboard?.writeText(formatCurrency(value)).catch(() => {});
  };

  return (
    <div className="page-scroll h-full w-full space-y-4 px-4 py-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="btn-square shrink-0"
          onClick={goBack}
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Input
          value={recipe.name}
          placeholder="Nome da receita"
          className="font-semibold"
          aria-label="Nome da receita"
          onChange={(event) => patch({ name: event.target.value })}
        />
      </div>

      {/* Resumo da receita */}
      <section className="rounded-2xl border border-base-200 bg-base-100 p-4">
        <h2 className="font-bold">Resumo da receita</h2>
        <p className="text-xs text-base-content/60">Atualizado automaticamente a cada alteração.</p>

        <div className="mt-4 space-y-2.5">
          <SummaryRow
            label="Custo dos ingredientes"
            value={formatCurrency(pricing.ingredientCost)}
          />

          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="text-base-content/70">Custo percentual</span>
            <span className="flex items-center gap-1.5">
              <NumericInput
                value={recipe.percentCost}
                onCommit={(value) => patch({ percentCost: value ?? 0 })}
                size="sm"
                className="w-16 text-right"
                aria-label="Custo percentual"
              />
              <span className="text-base-content/60">%</span>
              <span className="w-24 text-right font-medium">
                {formatCurrency(pricing.percentValue)}
              </span>
            </span>
          </div>

          <div className="space-y-1.5">
            <SummaryRow label="Custos adicionais" value={formatCurrency(pricing.additionalCost)} />

            {recipe.additionalCosts.map((cost) => (
              <div key={cost.id} className="flex items-center gap-1.5">
                <Input
                  value={cost.name}
                  placeholder="Ex.: caixa, laço"
                  size="sm"
                  aria-label="Nome do custo adicional"
                  onChange={(event) =>
                    patch({
                      additionalCosts: recipe.additionalCosts.map((item) =>
                        item.id === cost.id ? { ...item, name: event.target.value } : item,
                      ),
                    })
                  }
                />
                <NumericInput
                  value={cost.value}
                  onCommit={(value) =>
                    patch({
                      additionalCosts: recipe.additionalCosts.map((item) =>
                        item.id === cost.id ? { ...item, value: value ?? 0 } : item,
                      ),
                    })
                  }
                  size="sm"
                  className="w-24 text-right"
                  aria-label="Valor do custo adicional"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="btn-square shrink-0"
                  onClick={() => removeAdditionalCost(cost.id)}
                  aria-label="Remover custo adicional"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button variant="ghost" size="sm" onClick={addAdditionalCost}>
              <Plus className="h-4 w-4" />
              Adicionar custo
            </Button>
          </div>
        </div>

        <div className="mt-4 border-t border-base-200 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
            Custo total estimado
          </p>
          <p className="mt-1 text-3xl font-bold">{formatCurrency(pricing.totalPrice)}</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {[2, 3].map((mult) => {
            const selected = recipe.multiplier === mult;
            const price = mult === 2 ? pricing.salePrices.x2 : pricing.salePrices.x3;

            return (
              <div
                key={mult}
                role="button"
                tabIndex={0}
                aria-pressed={selected}
                className={clsx(
                  'cursor-pointer rounded-2xl border p-3 text-left transition-colors',
                  selected
                    ? 'border-primary bg-primary/10'
                    : 'border-base-200 bg-base-100 hover:border-base-300',
                )}
                onClick={() => patch({ multiplier: mult as 2 | 3 })}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    patch({ multiplier: mult as 2 | 3 });
                  }
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-base-content/60">Venda ×{mult}</span>
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs btn-square"
                    aria-label={`Copiar preço de venda multiplicado por ${mult}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      copyPrice(price);
                    }}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p
                  className={clsx(
                    'mt-1 text-lg font-bold',
                    selected ? 'text-primary' : 'text-base-content',
                  )}
                >
                  {formatCurrency(price)}
                </p>
              </div>
            );
          })}
        </div>

        <p className="mt-2 text-[0.7rem] leading-snug text-base-content/50">
          Os preços são calculados pelo custo total multiplicado por 2 ou 3.
        </p>

        {/* Rendimento → preço por pedaço */}
        <div className="mt-3 rounded-xl bg-primary/10 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                Rendimento (porções)
              </p>
              <p className="text-[0.7rem] text-base-content/50">
                Opcional — divide o preço final por pedaço
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <NumericInput
                value={recipe.portions}
                onCommit={(value) => patch({ portions: value })}
                allowEmpty
                size="sm"
                className="w-16 text-right"
                placeholder="x"
                aria-label="Rendimento em porções"
              />
              {pricing.pricePerPiece !== undefined && (
                <>
                  <span className="text-xs text-base-content/50">→</span>
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(pricing.pricePerPiece)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-xl bg-base-200/50 p-3 text-[0.7rem] leading-snug text-base-content/70">
          <p>
            <span className="font-semibold text-base-content">Fórmula:</span> custo dos ingredientes
            + custo percentual + custos adicionais, × multiplicador.
          </p>
          <p className="mt-1.5">
            O percentual de {recipe.percentCost.toLocaleString('pt-BR')}% é editável. Confira se ele
            cobre os custos que deseja incluir.
          </p>
        </div>
      </section>

      {/* Ingredientes da receita */}
      <section className="rounded-2xl border border-base-200 bg-base-100 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-bold">Ingredientes da receita</h2>
            <p className="text-xs text-base-content/60">
              Informe quanto custa cada embalagem e quanto entra na receita.
            </p>
          </div>
          <span className="badge badge-ghost badge-sm shrink-0">
            {recipe.ingredients.length} itens
          </span>
        </div>

        <div className="mt-3 space-y-3">
          {recipe.ingredients.length === 0 && (
            <p className="rounded-xl border border-dashed border-base-300 p-4 text-center text-sm text-base-content/60">
              Nenhum ingrediente ainda.
            </p>
          )}

          {recipe.ingredients.map((ingredient) => (
            <div key={ingredient.id} className="rounded-xl border border-base-200 p-3">
              <div className="flex items-center gap-2">
                <Input
                  value={ingredient.name}
                  placeholder="Ingrediente"
                  size="sm"
                  className="min-w-0 flex-1"
                  aria-label="Nome do ingrediente"
                  onChange={(event) =>
                    updateIngredient(ingredient.id, { name: event.target.value })
                  }
                />
                <select
                  className="select select-sm w-20 shrink-0"
                  value={ingredient.unit}
                  aria-label="Unidade"
                  onChange={(event) =>
                    updateIngredient(ingredient.id, {
                      unit: event.target.value as Recipe.Unit,
                    })
                  }
                >
                  {UNITS.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
                <Button
                  variant="ghost"
                  size="sm"
                  className="btn-square shrink-0"
                  onClick={() => removeIngredient(ingredient.id)}
                  aria-label="Remover ingrediente"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-2 grid grid-cols-3 gap-2">
                <Field label="Preço embal.">
                  <NumericInput
                    value={ingredient.packagePrice}
                    onCommit={(value) =>
                      updateIngredient(ingredient.id, { packagePrice: value ?? 0 })
                    }
                    size="sm"
                    className="text-right"
                    placeholder="R$"
                    aria-label="Preço da embalagem"
                  />
                </Field>
                <Field label="Qtd. embal.">
                  <NumericInput
                    value={ingredient.packageQty}
                    onCommit={(value) =>
                      updateIngredient(ingredient.id, { packageQty: value ?? 0 })
                    }
                    size="sm"
                    className="text-right"
                    placeholder="0"
                    aria-label="Quantidade da embalagem"
                  />
                </Field>
                <Field label="Usado">
                  <NumericInput
                    value={ingredient.usedQty}
                    onCommit={(value) => updateIngredient(ingredient.id, { usedQty: value ?? 0 })}
                    size="sm"
                    className="text-right"
                    placeholder="0"
                    aria-label="Quantidade usada na receita"
                  />
                </Field>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-base-content/50">Custo usado</span>
                <span className="text-sm font-bold text-primary">
                  {formatCurrency(ingredientCost(ingredient))}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* TODO: "Adicionar do catálogo" — etapa Ingredients */}
        <Button variant="accent" size="sm" block className="mt-3" onClick={addIngredient}>
          <Plus className="h-4 w-4" />
          Adicionar ingrediente
        </Button>

        <p className="mt-3 text-right text-[0.65rem] text-base-content/50">
          Valores em R$ e pela unidade da embalagem
        </p>
      </section>
    </div>
  );
};

export default RecipeDetailPage;
