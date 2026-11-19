import clsx from 'clsx';
import { BookOpen, ChevronRight, Moon, Sun, Wheat } from 'lucide-react';
import { Button } from '../../components';
import useRouter from '../../hooks/useRouter';
import useProfile from '../../hooks/useProfile';
import useRecipes from '../../hooks/useRecipes';
import useCatalog from '../../hooks/useCatalog';
import useTheme from '../../hooks/useTheme';
import { calculatePricing } from '../../lib/pricing';
import { formatCurrency } from '../../lib/utils';

const Home = () => {
  const { navigate } = useRouter();
  const { user } = useProfile();
  const { recipes } = useRecipes();
  const { ingredients: catalog } = useCatalog();
  const { theme, toggleTheme } = useTheme();

  const recent = recipes.slice(0, 3);
  const averageSale =
    recipes.length > 0
      ? recipes.reduce((sum, recipe) => sum + calculatePricing(recipe).salePrice, 0) /
        recipes.length
      : 0;

  const stats: { label: string; value: string; accent?: boolean }[] = [
    { label: 'Receitas', value: String(recipes.length) },
    { label: 'Ingredientes', value: String(catalog.length) },
    { label: 'Preço médio', value: formatCurrency(averageSale), accent: true },
  ];

  return (
    <div className="page-scroll h-full w-full space-y-4 px-4 py-4">
      {/* Saudação */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg font-bold">{user.username ? `Olá, ${user.username}!` : 'Olá!'}</h1>
          <p className="text-xs text-base-content/60">Gerencie suas receitas e precificação</p>
        </div>

        <button
          type="button"
          className="btn btn-ghost btn-square btn-sm shrink-0"
          aria-label={theme === 'chocolate' ? 'Usar tema claro' : 'Usar tema escuro'}
          onClick={toggleTheme}
        >
          {theme === 'chocolate' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-3 gap-2">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-base-200 bg-base-100 p-3">
            <p className="text-[0.65rem] font-medium uppercase tracking-wide text-base-content/50">
              {stat.label}
            </p>
            <p
              className={clsx(
                'mt-1 truncate text-lg font-bold',
                stat.accent ? 'text-primary' : 'text-base-content',
              )}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Receitas recentes */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-bold">Receitas recentes</h2>
          {recipes.length > 3 && (
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              onClick={() => navigate('Recipes')}
            >
              Ver todas
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </button>
          )}
        </div>

        {recent.length === 0 ? (
          <p className="rounded-xl border border-dashed border-base-300 p-4 text-center text-sm text-base-content/60">
            Nenhuma receita ainda.
          </p>
        ) : (
          <ul className="space-y-2">
            {recent.map((recipe) => {
              const pricing = calculatePricing(recipe);

              return (
                <li key={recipe.id}>
                  <button
                    type="button"
                    className="w-full rounded-2xl border border-base-200 bg-base-100 p-3 text-left transition-transform active:scale-[0.99]"
                    onClick={() => navigate('RecipeDetail', { recipeId: recipe.id })}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {recipe.name.trim() || 'Receita sem nome'}
                        </p>
                        <p className="mt-0.5 text-xs text-base-content/60">
                          {recipe.portions
                            ? `${recipe.portions} ${recipe.portions === 1 ? 'porção' : 'porções'}`
                            : 'sem rendimento'}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-[0.65rem] uppercase tracking-wide text-base-content/50">
                          venda ×{recipe.multiplier}
                        </p>
                        <p className="text-sm font-bold text-primary">
                          {formatCurrency(pricing.salePrice)}
                        </p>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Navegação */}
      <div className="space-y-3">
        <Button
          variant="outline"
          size="lg"
          block
          className="justify-between"
          onClick={() => navigate('Recipes')}
        >
          <span className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" aria-hidden />
            Minhas receitas
          </span>
          <ChevronRight className="h-5 w-5" aria-hidden />
        </Button>

        <Button
          variant="outline"
          size="lg"
          block
          className="justify-between"
          onClick={() => navigate('Ingredients')}
        >
          <span className="flex items-center gap-2">
            <Wheat className="h-5 w-5" aria-hidden />
            Ingredientes
          </span>
          <ChevronRight className="h-5 w-5" aria-hidden />
        </Button>
      </div>
    </div>
  );
};

export default Home;
