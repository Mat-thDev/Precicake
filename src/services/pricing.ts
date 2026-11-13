// Cálculos de precificação — independentes da interface (diretriz do PROJECT.md).
//
// Fórmula do MVP:
//   custoAjustado   = custoIngredientes × 1,20
//   precoVenda      = custoAjustado × multiplicador

import type { PricingResult } from '@/types';
import { parseNumericInput } from './format';

// TODO: mover para Settings quando as configurações forem implementadas.
export const TAXA_CUSTOS_INDIRETOS = 0.2;
export const MULTIPLICADORES = [2, 3] as const;

export interface CalcLine {
  custoUnitario: number;
  quantidade: number; // já convertido para a unidade do custoUnitario
}

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

// Custo proporcional de uma linha, arredondado para centavos.
export function calcularCustoLinha(line: CalcLine): number {
  return roundMoney(line.custoUnitario * line.quantidade);
}

export function calcularPrecificacao(
  linhas: CalcLine[],
  opcoes: { multiplicador: number; rendimento?: number | null },
): PricingResult {
  const custoIngredientes = roundMoney(
    linhas.reduce((total, line) => total + calcularCustoLinha(line), 0),
  );
  const custosIndiretos = roundMoney(custoIngredientes * TAXA_CUSTOS_INDIRETOS);
  const custoAjustado = roundMoney(custoIngredientes + custosIndiretos);
  const precoVenda = roundMoney(custoAjustado * opcoes.multiplicador);

  const rendimento = opcoes.rendimento ?? null;
  const temRendimento = rendimento !== null && rendimento > 0;

  return {
    custoIngredientes,
    custosIndiretos,
    custoAjustado,
    multiplicador: opcoes.multiplicador,
    precoVenda,
    custoPorUnidade: temRendimento ? roundMoney(custoAjustado / rendimento) : null,
    precoPorUnidade: temRendimento ? roundMoney(precoVenda / rendimento) : null,
  };
}

export { parseNumericInput };
