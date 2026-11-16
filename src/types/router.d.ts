declare namespace Router {
  type Routes =
    'Home' | 'Welcome' | 'RecipeDetail' | 'Recipes' | 'Ingredients' | 'IngredientDetail';

  interface RouteState {
    page: Routes;
    props?: { recipeId?: string; ingredientId?: string };
  }

  interface NavState {
    current: RouteState;
    stack: RouteState[];
  }
}
