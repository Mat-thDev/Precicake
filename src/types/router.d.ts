declare namespace Router {
  type Routes = 'Home' | 'Welcome' | 'Calculator' | 'Recipes' | 'Ingredients';

  interface RouteState {
    page: Routes;
    props?: undefined;
  }

  interface NavState {
    current: RouteState;
    stack: RouteState[];
  }
}
