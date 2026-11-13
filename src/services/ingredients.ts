// Fonte de ingredientes da calculadora.
//
// Enquanto o CRUD de ingredientes (fase 2) não existe, a UI consome dados de
// exemplo. Trocar `getIngredients()` por chamada à API não altera consumidores.

import type { Ingredient } from '@/types';

interface SeedDef {
  id: string;
  nome: string;
  unidadeMedida: string;
  quantidadeEmbalagem: number;
  precoCompra: number;
}

// IDs estáveis (diretriz do PROJECT.md).
const SEED: SeedDef[] = [
  { id: 'leite-condensado', nome: 'Leite condensado', unidadeMedida: 'g', quantidadeEmbalagem: 395, precoCompra: 6.5 },
  { id: 'chocolate-em-po', nome: 'Chocolate em pó', unidadeMedida: 'g', quantidadeEmbalagem: 1000, precoCompra: 28.0 },
  { id: 'farinha-de-trigo', nome: 'Farinha de trigo', unidadeMedida: 'g', quantidadeEmbalagem: 1000, precoCompra: 5.5 },
  { id: 'acucar', nome: 'Açúcar', unidadeMedida: 'g', quantidadeEmbalagem: 1000, precoCompra: 4.2 },
  { id: 'manteiga', nome: 'Manteiga', unidadeMedida: 'g', quantidadeEmbalagem: 200, precoCompra: 8.9 },
  { id: 'ovos', nome: 'Ovos', unidadeMedida: 'un', quantidadeEmbalagem: 30, precoCompra: 21.9 },
  { id: 'leite', nome: 'Leite', unidadeMedida: 'ml', quantidadeEmbalagem: 1000, precoCompra: 5.4 },
  { id: 'creme-de-leite', nome: 'Creme de leite', unidadeMedida: 'ml', quantidadeEmbalagem: 200, precoCompra: 3.5 },
  { id: 'fermento-em-po', nome: 'Fermento em pó', unidadeMedida: 'g', quantidadeEmbalagem: 100, precoCompra: 3.9 },
  { id: 'chocolate-amargo', nome: 'Chocolate amargo', unidadeMedida: 'g', quantidadeEmbalagem: 100, precoCompra: 12.5 },
];

let cache: Ingredient[] | null = null;

export function getIngredients(): Ingredient[] {
  if (!cache) {
    cache = SEED.map((def) => ({
      ...def,
      custoPorUnidade: def.precoCompra / def.quantidadeEmbalagem,
    }));
  }
  return cache;
}
