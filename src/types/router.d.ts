declare namespace Router {
  type Routes = 'Home' | 'Welcome' | 'RecipeDetail' | 'Recipes' | 'Ingredients';

  interface RouteState {
    page: Routes;
    props?: { recipeId?: string };
  }

  interface NavState {
    current: RouteState;
    stack: RouteState[];
  }
}
