declare namespace Recipe {
  type Unit = 'kg' | 'g' | 'L' | 'mL' | 'un';

  interface Ingredient {
    id: string;
    name: string;
    quantity: number;
    unit: Unit;
    /** Custo da quantidade usada nesta receita (R$) */
    unitCost: number;
  }

  interface Item {
    id: string;
    name: string;
    portions: number;
    prepTimeMin?: number;
    ingredients: Ingredient[];
    /** Margem de lucro desejada (%) */
    margin: number;
    createdAt: string;
  }
}
