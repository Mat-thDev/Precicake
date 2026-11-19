declare namespace App {
  type Theme = 'default' | 'chocolate';

  interface AppState {
    appName: string;
    initialize: boolean;
    version: string;
    theme: Theme;
  }
}
