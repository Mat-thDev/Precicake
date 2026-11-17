import { calculatePricing, ingredientCost } from './pricing';
import { formatCurrency } from './utils';

/**
 * Texto para compartilhar a receita + resumo de venda (área de transferência).
 * Formato plano pt-BR — pronto para colar em WhatsApp/e-mail.
 */
export function recipeShareText(recipe: Recipe.Item): string {
  const pricing = calculatePricing(recipe);
  const lines: string[] = [];

  lines.push(recipe.name.trim() || 'Receita sem nome');
  if (recipe.portions) {
    lines.push(`Rende: ${recipe.portions} ${recipe.portions === 1 ? 'porção' : 'porções'}`);
  }
  if (recipe.prepTimeMin) lines.push(`Preparo: ${recipe.prepTimeMin} min`);

  if (recipe.ingredients.length > 0) {
    lines.push('', 'INGREDIENTES');
    for (const ingredient of recipe.ingredients) {
      lines.push(
        `• ${ingredient.name.trim() || 'Sem nome'} — ${ingredient.usedQty.toLocaleString('pt-BR')} ${ingredient.unit} — ${formatCurrency(ingredientCost(ingredient))}`,
      );
    }
  }

  lines.push('', 'CUSTOS');
  lines.push(`Ingredientes: ${formatCurrency(pricing.ingredientCost)}`);
  lines.push(
    `Percentual (${recipe.percentCost.toLocaleString('pt-BR')}%): ${formatCurrency(pricing.percentValue)}`,
  );
  lines.push(`Adicionais: ${formatCurrency(pricing.additionalCost)}`);
  for (const cost of recipe.additionalCosts) {
    lines.push(`• ${cost.name.trim() || 'Custo adicional'}: ${formatCurrency(cost.value)}`);
  }
  lines.push(`Custo total: ${formatCurrency(pricing.totalPrice)}`);

  lines.push('', 'VENDA');
  lines.push(`×2: ${formatCurrency(pricing.salePrices.x2)}`);
  lines.push(`×3: ${formatCurrency(pricing.salePrices.x3)}`);
  lines.push(`Escolhido: ×${recipe.multiplier} — ${formatCurrency(pricing.salePrice)}`);
  if (pricing.pricePerPiece !== undefined) {
    lines.push(`Preço por peça: ${formatCurrency(pricing.pricePerPiece)}`);
  }

  return lines.join('\n');
}
