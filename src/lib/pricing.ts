/** Custo da quantidade usada: preço da embalagem ÷ quantidade da embalagem × usado */
export function ingredientCost(ingredient: Recipe.Ingredient): number {
  if (ingredient.packageQty <= 0) return 0;
  return (ingredient.packagePrice / ingredient.packageQty) * ingredient.usedQty;
}

export interface PricingResult {
  /** CI — soma dos custos dos ingredientes */
  ingredientCost: number;
  /** CI × percentCost/100 */
  percentValue: number;
  /* Σ custos adicionais */
  additionalCost: number;
  /* CI + percentValue + additionalCost */
  totalPrice: number;
  salePrices: { x2: number; x3: number };
  /** Preço escolhido conforme recipe.multiplier */
  salePrice: number;
  /** salePrice ÷ portions — só quando portions > 0 */
  pricePerPiece?: number;
}

export function calculatePricing(recipe: Recipe.Item): PricingResult {
  const ci = recipe.ingredients.reduce((sum, ingredient) => sum + ingredientCost(ingredient), 0);
  const percentValue = ci * (recipe.percentCost / 100);
  const additionalCost = recipe.additionalCosts.reduce((sum, cost) => sum + cost.value, 0);
  const totalPrice = ci + percentValue + additionalCost;

  const salePrices = { x2: totalPrice * 2, x3: totalPrice * 3 };
  const salePrice = salePrices[recipe.multiplier === 2 ? 'x2' : 'x3'];
  const pricePerPiece =
    recipe.portions && recipe.portions > 0 ? salePrice / recipe.portions : undefined;

  return {
    ingredientCost: ci,
    percentValue,
    additionalCost,
    totalPrice,
    salePrices,
    salePrice,
    pricePerPiece,
  };
}
