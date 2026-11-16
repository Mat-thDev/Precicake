import { createRoot } from 'react-dom/client';
import Providers from './Providers';
import App from './App';
import { initNative } from './lib/native';
import { hydrateStorage } from './lib/storage';

void initNative();

void hydrateStorage().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <Providers>
      <App />
    </Providers>,
  );
});
