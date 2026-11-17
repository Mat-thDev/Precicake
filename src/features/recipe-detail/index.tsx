import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { ArrowLeft, ChevronDown, Copy, Plus, Trash2 } from 'lucide-react';
import {
  Button,
  Collapse,
  CollapsibleSection,
  Field,
  Input,
  NotFound,
  NumericInput,
} from '../../components';
import useRouter from '../../hooks/useRouter';
import useRecipes from '../../hooks/useRecipes';
import useCatalog from '../../hooks/useCatalog';
import { showToast } from '../../hooks/useToast';
import { calculatePricing, ingredientCost } from '../../lib/pricing';
import { recipeShareText } from '../../lib/share';
import { copyText, formatCurrency, uuid } from '../../lib/utils';
import SummaryBar from './SummaryBar';

const UNITS: Recipe.Unit[] = ['g', 'kg', 'mL', 'L', 'un'];

type SectionId = 'ingredients' | 'costs';

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-2 text-sm">
    <span className="text-base-content/70">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

/**
 * Detalhe da receita — acordeão: uma seção aberta por vez
 * (padrão: Ingredientes), com resumo visível no header de cada uma.
 * Ingredientes em linhas colapsadas (um expandido por vez).
 * Auto-save com toast (debounce 800ms) + barra de resumo fixa.
 */
const RecipeDetailPage = () => {
  const { currentProps, goBack } = useRouter();
  const { recipes, updateRecipe, removeRecipe } = useRecipes();
  const { ingredients: catalog } = useCatalog();
  const [selectedCatalogId, setSelectedCatalogId] = useState('');
  const [openSection, setOpenSection] = useState<SectionId>('ingredients');
  const [expandedIngredientId, setExpandedIngredientId] = useState<string | undefined>(undefined);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const recipe = recipes.find((item) => item.id === currentProps?.recipeId);

  // Auto-save: avisa após 800ms sem alterações (ignora mount e troca de receita)
  const lastSavedId = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!recipe) return;
    if (lastSavedId.current !== recipe.id) {
      lastSavedId.current = recipe.id;
      return;
    }

    const timer = setTimeout(() => showToast('Alterações salvas'), 800);
    return () => clearTimeout(timer);
  }, [recipe]);

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

  const addIngredient = () => {
    const id = uuid();
    setExpandedIngredientId(id);
    patch({
      ingredients: [
        ...recipe.ingredients,
        {
          id,
          name: '',
          unit: 'g',
          packagePrice: 0,
          packageQty: 0,
          usedQty: 0,
        },
      ],
    });
  };

  const removeIngredient = (id: string) => {
    setExpandedIngredientId((current) => (current === id ? undefined : current));
    patch({ ingredients: recipe.ingredients.filter((ingredient) => ingredient.id !== id) });
  };

  /** Copia os valores do catálogo para a linha da receita (cópia, não referência) */
  const addFromCatalog = () => {
    const item = catalog.find((entry) => entry.id === selectedCatalogId);
    if (!item) return;

    const id = uuid();
    setExpandedIngredientId(id);
    patch({
      ingredients: [
        ...recipe.ingredients,
        {
          id,
          catalogId: item.id,
          name: item.name,
          unit: item.unit,
          packagePrice: item.packagePrice,
          packageQty: item.packageQty,
          usedQty: 0,
        },
      ],
    });

    setSelectedCatalogId('');
  };

  const addAdditionalCost = () =>
    patch({
      additionalCosts: [...recipe.additionalCosts, { id: uuid(), name: '', value: 0 }],
    });

  const removeAdditionalCost = (id: string) =>
    patch({ additionalCosts: recipe.additionalCosts.filter((cost) => cost.id !== id) });

  const handleDelete = () => {
    removeRecipe(recipe.id);
    showToast('Receita excluída', 'info');
    goBack();
  };

  const handleCopy = () => {
    void copyText(recipeShareText(recipe)).then((ok) =>
      showToast(ok ? 'Receita copiada' : 'Não foi possível copiar', ok ? 'success' : 'error'),
    );
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="page-scroll min-h-0 flex-1 space-y-4 px-4 py-4">
        {/* Dados */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="btn-square"
              onClick={goBack}
              aria-label="Voltar"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="btn-square"
                onClick={handleCopy}
                aria-label="Copiar receita"
              >
                <Copy className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="btn-square text-error"
                onClick={() => setConfirmDelete(true)}
                aria-label="Excluir receita"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <Input
            value={recipe.name}
            placeholder="Nome da receita"
            className="font-semibold"
            aria-label="Nome da receita"
            onChange={(event) => patch({ name: event.target.value })}
          />
        </div>

        {/* ① Ingredientes */}
        <CollapsibleSection
          title="Ingredientes"
          description="Informe quanto custa cada embalagem e quanto entra na receita."
          summary={
            <span className="badge badge-ghost badge-sm">{recipe.ingredients.length} itens</span>
          }
          open={openSection === 'ingredients'}
          onToggle={() => setOpenSection('ingredients')}
        >
          <div className="flex gap-2">
            <select
              className="select select-sm min-w-0 flex-1"
              value={selectedCatalogId}
              aria-label="Adicionar ingrediente do catálogo"
              onChange={(event) => setSelectedCatalogId(event.target.value)}
            >
              <option value="">Adicionar do catálogo…</option>
              {catalog.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name.trim() || 'Sem nome'}
                </option>
              ))}
            </select>
            <Button
              variant="accent"
              size="sm"
              className="shrink-0"
              disabled={!selectedCatalogId}
              onClick={addFromCatalog}
            >
              Adicionar
            </Button>
          </div>

          {catalog.length === 0 && (
            <p className="mt-1.5 text-[0.7rem] text-base-content/50">
              Nenhum ingrediente no catálogo ainda — cadastre em Ingredientes.
            </p>
          )}

          <Button variant="outline" size="sm" block className="mt-2" onClick={addIngredient}>
            <Plus className="h-4 w-4" />
            Ingrediente manual
          </Button>

          <div className="mt-3 space-y-2">
            {recipe.ingredients.length === 0 && (
              <p className="rounded-xl border border-dashed border-base-300 p-4 text-center text-sm text-base-content/60">
                Nenhum ingrediente ainda.
              </p>
            )}

            {recipe.ingredients.map((ingredient) => {
              const expanded = expandedIngredientId === ingredient.id;

              return (
                <div
                  key={ingredient.id}
                  className="overflow-hidden rounded-xl border border-base-200"
                >
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-left"
                    aria-expanded={expanded}
                    onClick={() => setExpandedIngredientId(expanded ? undefined : ingredient.id)}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-sm font-medium">
                          {ingredient.name.trim() || 'Sem nome'}
                        </p>
                        {ingredient.catalogId && (
                          <span className="badge badge-ghost badge-xs shrink-0">catálogo</span>
                        )}
                      </div>
                      <p className="text-xs text-base-content/50">
                        {ingredient.usedQty} {ingredient.unit} usados
                      </p>
                    </div>

                    <span className="shrink-0 text-sm font-bold text-primary">
                      {formatCurrency(ingredientCost(ingredient))}
                    </span>
                    <ChevronDown
                      className={clsx(
                        'h-4 w-4 shrink-0 text-base-content/40 transition-transform',
                        expanded && 'rotate-180',
                      )}
                      aria-hidden
                    />
                  </button>

                  <Collapse open={expanded}>
                    <div className="space-y-2 border-t border-base-200 p-3">
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

                      <div className="grid grid-cols-3 gap-2">
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
                            onCommit={(value) =>
                              updateIngredient(ingredient.id, { usedQty: value ?? 0 })
                            }
                            size="sm"
                            className="text-right"
                            placeholder="0"
                            aria-label="Quantidade usada na receita"
                          />
                        </Field>
                      </div>
                    </div>
                  </Collapse>
                </div>
              );
            })}
          </div>

          <p className="mt-3 text-right text-[0.65rem] text-base-content/50">
            Valores em R$ e pela unidade da embalagem
          </p>
        </CollapsibleSection>

        {/* ② Custos — edição */}
        <CollapsibleSection
          title="Custos"
          description="Percentual sobre os ingredientes, custos fixos e rendimento."
          summary={
            <span className="text-xs font-medium text-base-content/60">
              {recipe.percentCost.toLocaleString('pt-BR')}% ·{' '}
              {formatCurrency(pricing.additionalCost)}
            </span>
          }
          open={openSection === 'costs'}
          onToggle={() => setOpenSection('costs')}
        >
          <div className="space-y-3">
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
              <SummaryRow
                label="Custos adicionais"
                value={formatCurrency(pricing.additionalCost)}
              />

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

            {/* Rendimento → preço por pedaço */}
            <div className="rounded-xl bg-primary/10 p-3">
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
          </div>
        </CollapsibleSection>
      </div>

      {/* Barra de resumo fixa */}
      <SummaryBar
        pricing={pricing}
        multiplier={recipe.multiplier}
        percentCost={recipe.percentCost}
        pricePerPiece={pricing.pricePerPiece}
        onMultiplierChange={(multiplier) => patch({ multiplier })}
      />

      {/* Confirmação de exclusão */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="Confirmar exclusão"
        >
          <div className="w-full max-w-sm rounded-2xl bg-base-100 p-4 shadow-xl">
            <h2 className="font-bold">Excluir receita?</h2>
            <p className="mt-2 text-sm text-base-content/70">
              “{recipe.name.trim() || 'Receita sem nome'}” e todos os ingredientes dela serão
              removidos. Essa ação não pode ser desfeita.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button variant="outline" size="sm" onClick={() => setConfirmDelete(false)}>
                Cancelar
              </Button>
              <button
                type="button"
                className="btn btn-error btn-sm select-none transition-transform active:scale-95"
                onClick={handleDelete}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetailPage;
