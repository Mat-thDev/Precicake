// Utilitários de formatação e leitura de valores numéricos (pt-BR).

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

// Custos por unidade podem ter frações (ex.: R$ 0,0042/g).
const unitCost = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

export function formatBRL(value: number): string {
  return brl.format(Number.isFinite(value) ? value : 0);
}

export function formatUnitCost(value: number): string {
  return `R$ ${unitCost.format(Number.isFinite(value) ? value : 0)}`;
}

// Lê entrada do usuário aceitando vírgula ou ponto decimal.
export function parseNumericInput(raw: string): number {
  const normalized = raw.replace(/\s/g, '').replace(',', '.');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}
