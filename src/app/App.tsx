import { Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { PricingCalculator } from '@/modules/pricing';

export function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<PricingCalculator />} />
      </Routes>
    </AppShell>
  );
}
