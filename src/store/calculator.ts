// Estado global da calculadora (Jotai).

import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { getIngredients } from '@/services/ingredients';
import {
  MULTIPLICADORES,
  calcularPrecificacao,
  type CalcLine,
} from '@/services/pricing';
import { parseNumericInput } from '@/services/format';
import type { CalculatorSelection, PricingResult } from '@/types';

export const ingredientsAtom = atom(getIngredients());

// Seleção persistida no localStorage: { [ingredientId]: "150" }.
export const selectionAtom = atomWithStorage<CalculatorSelection>(
  'precicake:calculator-selection',
  {},
);

export const searchAtom = atom('');

export const multiplierAtom = atom<(typeof MULTIPLICADORES)[number]>(2);

// Rendimento da receita (string p/ vírgula decimal). "" = sem rendimento.
export const yieldInputAtom = atomWithStorage('precicake:calculator-yield', '');

export const filteredIngredientsAtom = atom((get) => {
  const ingredients = get(ingredientsAtom);
  const search = get(searchAtom).trim().toLowerCase();
  if (!search) return ingredients;
  return ingredients.filter((i) => i.nome.toLowerCase().includes(search));
});

export const selectedCountAtom = atom(
  (get) => Object.keys(get(selectionAtom)).length,
);

export const pricingResultAtom = atom<PricingResult>((get) => {
  const ingredients = get(ingredientsAtom);
  const selection = get(selectionAtom);
  const multiplicador = get(multiplierAtom);
  const rendimento = parseNumericInput(get(yieldInputAtom));

  const byId = new Map(ingredients.map((i) => [i.id, i]));

  const linhas: CalcLine[] = Object.entries(selection)
    .map(([id, quantidade]): CalcLine | null => {
      const ingrediente = byId.get(id);
      if (!ingrediente) return null;
      return {
        custoUnitario: ingrediente.custoPorUnidade,
        quantidade: parseNumericInput(quantidade),
      };
    })
    .filter((linha): linha is CalcLine => linha !== null);

  return calcularPrecificacao(linhas, { multiplicador, rendimento });
});
