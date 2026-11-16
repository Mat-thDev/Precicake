declare namespace Router {
  type Routes = 'Home' | 'Welcome';

  interface RouteState {
    page: Routes;
    props?: undefined;
  }

  interface NavState {
    current: RouteState;
    stack: RouteState[];
  }
}
