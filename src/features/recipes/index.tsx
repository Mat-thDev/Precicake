import { ChefHat, Plus } from 'lucide-react';
import { Button } from '../../components';
import useRouter from '../../hooks/useRouter';
import useRecipes from '../../hooks/useRecipes';
import { showToast } from '../../hooks/useToast';
import { calculatePricing } from '../../lib/pricing';
import { formatCurrency } from '../../lib/utils';

const RecipesPage = () => {
  const { navigate } = useRouter();
  const { recipes, createRecipe } = useRecipes();

  const handleCreate = () => {
    const item = createRecipe();
    showToast('Receita criada');
    navigate('RecipeDetail', { recipeId: item.id });
  };

  return (
    <div className="page-scroll h-full w-full px-4 py-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg font-bold">Minhas receitas</h1>
          <p className="text-xs text-base-content/60">
            {recipes.length} {recipes.length === 1 ? 'receita' : 'receitas'}
          </p>
        </div>

        <Button variant="accent" size="sm" onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          Nova receita
        </Button>
      </div>

      {recipes.length === 0 ? (
        <div className="flex flex-col items-center px-6 pt-16 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ChefHat className="h-10 w-10" aria-hidden />
          </div>

          <h2 className="mt-6 text-base font-bold">Nenhuma receita ainda</h2>

          <p className="mt-2 max-w-xs text-sm text-base-content/60">
            Cadastre sua primeira receita para calcular o custo e o preço de venda.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {recipes.map((recipe) => {
            const pricing = calculatePricing(recipe);

            return (
              <li key={recipe.id}>
                <button
                  type="button"
                  className="w-full rounded-2xl border border-base-200 bg-base-100 p-4 text-left transition-transform active:scale-[0.99]"
                  onClick={() => navigate('RecipeDetail', { recipeId: recipe.id })}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">
                        {recipe.name.trim() || 'Receita sem nome'}
                      </h3>
                      <p className="mt-1 text-xs text-base-content/60">
                        {recipe.portions
                          ? `${recipe.portions} ${recipe.portions === 1 ? 'porção' : 'porções'}`
                          : 'sem rendimento'}
                        {recipe.prepTimeMin ? ` · ${recipe.prepTimeMin} min` : ''}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-[0.65rem] uppercase tracking-wide text-base-content/50">
                        venda ×{recipe.multiplier}
                      </p>
                      <p className="font-bold text-primary">{formatCurrency(pricing.salePrice)}</p>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default RecipesPage;
