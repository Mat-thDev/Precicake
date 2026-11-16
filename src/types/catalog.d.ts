declare namespace Catalog {
  interface Item {
    id: string;
    name: string;
    unit: Recipe.Unit;
    /** Preço da embalagem inteira (R$) */
    packagePrice: number;
    /** Quantidade que a embalagem contém (em `unit`) */
    packageQty: number;
    createdAt: string;
  }
}
