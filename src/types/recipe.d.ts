declare namespace Recipe {
  type Unit = 'kg' | 'g' | 'L' | 'mL' | 'un';

  interface Ingredient {
    id: string;
    name: string;
    unit: Unit;
    /** Preço da embalagem inteira (R$) */
    packagePrice: number;
    /** Quantidade que a embalagem contém (em `unit`) */
    packageQty: number;
    /** Quantidade usada na receita (em `unit`) */
    usedQty: number;
  }

  interface AdditionalCost {
    id: string;
    name: string;
    /** Valor em R$ */
    value: number;
  }

  interface Item {
    id: string;
    name: string;
    /** Rendimento em porções/pedaços — opcional (habilita o preço por pedaço) */
    portions?: number;
    prepTimeMin?: number;
    ingredients: Ingredient[];
    /** Custo percentual sobre os ingredientes (%) — padrão 3,5 */
    percentCost: number;
    /** Custos fixos agregados: embalagens, decoração, etc. (R$) */
    additionalCosts: AdditionalCost[];
    /** Multiplicador de venda escolhido — padrão 3 */
    multiplier: 2 | 3;
    createdAt: string;
  }
}
