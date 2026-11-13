// Tipos compartilhados entre frontend e backend.

export interface Ingredient {
  id: string;
  nome: string;
  unidadeMedida: string; // "g", "ml", "un"
  quantidadeEmbalagem: number;
  precoCompra: number;
  custoPorUnidade: number;
}

// Linha da calculadora: ingrediente selecionado + quantidade digitada (string
// para permitir vírgula decimal enquanto o usuário digita).
export type CalculatorSelection = Record<string, string>;

export interface PricingResult {
  custoIngredientes: number;
  custosIndiretos: number;
  custoAjustado: number;
  multiplicador: number;
  precoVenda: number;
  custoPorUnidade: number | null;
  precoPorUnidade: number | null;
}
