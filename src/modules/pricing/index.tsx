import { IngredientTable } from './components/IngredientTable';
import { PricingPanel } from './components/PricingPanel';

export function PricingCalculator() {
  return (
    <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
      <IngredientTable />
      <PricingPanel />
    </div>
  );
}

export { IngredientTable, PricingPanel };
