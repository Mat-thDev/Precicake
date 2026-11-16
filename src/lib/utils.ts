// Funções utilitárias
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/** Converte texto de input numérico aceitando vírgula decimal pt-BR ("3,5" → 3.5) */
export function parseDecimal(text: string): number {
  const normalized = text.includes(',') ? text.replace(/\./g, '').replace(',', '.') : text;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : 0;
}
