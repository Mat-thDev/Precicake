import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { calculatePricing, ingredientCost } from './pricing';
import { copyText, formatCurrency } from './utils';

export type ShareResult = 'shared' | 'copied' | 'cancelled' | 'error';

/**
 * Compartilha a receita: share sheet nativo no Android.
 * Em web (ou plugin indisponível) cai para a área de transferência.
 */
export async function shareRecipe(recipe: Recipe.Item): Promise<ShareResult> {
  const text = recipeShareText(recipe);

  if (Capacitor.isNativePlatform()) {
    try {
      await Share.share({
        title: recipe.name.trim() || 'Receita sem nome',
        text,
        dialogTitle: 'Compartilhar receita',
      });
      return 'shared';
    } catch (error) {
      // Usuário fechou o sheet — sem feedback
      const message = error instanceof Error ? error.message : String(error);
      if (message.toLowerCase().includes('cancel')) return 'cancelled';
      // Plugin indisponível → tenta copiar
    }
  }

  const ok = await copyText(text);
  return ok ? 'copied' : 'error';
}

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
