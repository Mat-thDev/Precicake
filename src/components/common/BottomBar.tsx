import clsx from 'clsx';
import { BookOpen, House, Plus, Wheat } from 'lucide-react';
import useRouter from '../../hooks/useRouter';
import useRecipes from '../../hooks/useRecipes';
import { showToast } from '../../hooks/useToast';

type Tab = {
  page: Router.Routes;
  /** Páginas que mantêm a tab destacada */
  match: Router.Routes[];
  label: string;
  icon: typeof House;
};

const TABS: Tab[] = [
  { page: 'Home', match: ['Home'], label: 'Home', icon: House },
  { page: 'Recipes', match: ['Recipes', 'RecipeDetail'], label: 'Receitas', icon: BookOpen },
  {
    page: 'Ingredients',
    match: ['Ingredients', 'IngredientDetail'],
    label: 'Ingredientes',
    icon: Wheat,
  },
];

/**
 * Barra inferior de navegação — substitui o header/topbar.
 * Abre receita nova pelo botão +. Escondida no Welcome.
 */
export function BottomBar() {
  const { currentPage, navigate } = useRouter();
  const { createRecipe } = useRecipes();

  if (currentPage === 'Welcome') return null;

  const handleNewRecipe = () => {
    const item = createRecipe();
    showToast('Receita criada');
    navigate('RecipeDetail', { recipeId: item.id });
  };

  return (
    <nav
      className="shrink-0 border-t border-base-200 bg-base-100 pb-safe"
      aria-label="Navegação principal"
    >
      <div className="flex items-stretch px-2 pt-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = tab.match.includes(currentPage);

          return (
            <button
              key={tab.page}
              type="button"
              aria-current={active ? 'page' : undefined}
              className={clsx(
                'flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 transition-colors',
                active ? 'text-primary' : 'text-base-content/50',
              )}
              onClick={() => navigate(tab.page)}
            >
              <Icon className="h-5 w-5" aria-hidden />
              <span className={clsx('text-[0.65rem]', active && 'font-semibold')}>{tab.label}</span>
            </button>
          );
        })}

        <button
          type="button"
          aria-label="Nova receita"
          className="flex flex-1 items-center justify-center"
          onClick={handleNewRecipe}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-content transition-transform active:scale-95">
            <Plus className="h-6 w-6" aria-hidden />
          </span>
        </button>
      </div>
    </nav>
  );
}

export default BottomBar;
