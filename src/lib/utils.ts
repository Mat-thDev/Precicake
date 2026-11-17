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

/**
 * UUID v4 com fallback para contexto não-seguro.
 * `crypto.randomUUID()` só existe em HTTPS/localhost — no dispositivo
 * (app servido por http://IP) ela é `undefined` e o save quebrava.
 */
export function uuid(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();

  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0'));
  return [
    hex.slice(0, 4).join(''),
    hex.slice(4, 6).join(''),
    hex.slice(6, 8).join(''),
    hex.slice(8, 10).join(''),
    hex.slice(10, 16).join(''),
  ].join('-');
}
