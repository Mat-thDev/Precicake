import { useState } from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Button, Field, Input, NotFound, NumericInput } from '../../components';
import useRouter from '../../hooks/useRouter';
import useCatalog from '../../hooks/useCatalog';

const UNITS: Recipe.Unit[] = ['g', 'kg', 'mL', 'L', 'un'];

/**
 * Formulário do catálogo — novo ou edição.
 * Estado local: só grava no Salvar (sem itens órfãos); Cancelar/voltar descarta.
 */
const IngredientFormPage = () => {
  const { currentProps, goBack } = useRouter();
  const { ingredients, addIngredient, updateIngredient, removeIngredient } = useCatalog();

  const ingredientId = currentProps?.ingredientId;
  const existing = ingredientId ? ingredients.find((item) => item.id === ingredientId) : undefined;

  const [name, setName] = useState(existing?.name ?? '');
  const [unit, setUnit] = useState<Recipe.Unit>(existing?.unit ?? 'g');
  const [packagePrice, setPackagePrice] = useState<number | undefined>(existing?.packagePrice);
  const [packageQty, setPackageQty] = useState<number | undefined>(existing?.packageQty);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (ingredientId && !existing) {
    return (
      <NotFound
        title="Ingrediente não encontrado"
        description="Ele pode ter sido removido. Volte para a lista e tente novamente."
      />
    );
  }

  const isValid = name.trim() !== '' && (packageQty ?? 0) > 0 && (packagePrice ?? 0) >= 0;

  const handleSave = () => {
    if (!isValid) return;

    const payload = {
      name: name.trim(),
      unit,
      packagePrice: packagePrice ?? 0,
      packageQty: packageQty ?? 0,
    };

    if (existing) updateIngredient(existing.id, payload);
    else addIngredient(payload);

    goBack();
  };

  const handleDelete = () => {
    if (!existing) return;
    removeIngredient(existing.id);
    goBack();
  };

  return (
    <div className="page-scroll h-full w-full space-y-4 px-4 py-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="btn-square shrink-0"
          onClick={goBack}
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <h1 className="min-w-0 flex-1 truncate text-lg font-bold">
          {existing ? 'Editar ingrediente' : 'Novo ingrediente'}
        </h1>

        {existing && (
          <Button
            variant="ghost"
            size="sm"
            className="btn-square shrink-0 text-error"
            onClick={() => setConfirmDelete(true)}
            aria-label="Excluir ingrediente"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        )}
      </div>

      <section className="space-y-4 rounded-2xl border border-base-200 bg-base-100 p-4">
        <Field label="Nome">
          <Input
            value={name}
            placeholder="Ex.: Manteiga"
            aria-label="Nome do ingrediente"
            onChange={(event) => setName(event.target.value)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Unidade">
            <select
              className="select w-full"
              value={unit}
              aria-label="Unidade"
              onChange={(event) => setUnit(event.target.value as Recipe.Unit)}
            >
              {UNITS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Qtd. da embalagem">
            <NumericInput
              value={packageQty}
              onCommit={setPackageQty}
              allowEmpty
              className="text-right"
              placeholder="0"
              aria-label="Quantidade da embalagem"
            />
          </Field>
        </div>

        <Field label="Preço da embalagem (R$)">
          <NumericInput
            value={packagePrice}
            onCommit={setPackagePrice}
            allowEmpty
            className="text-right"
            placeholder="R$"
            aria-label="Preço da embalagem"
          />
        </Field>

        <p className="text-xs leading-snug text-base-content/60">
          O custo unitário sai de preço ÷ quantidade — ex.: R$ 11,00 / 200 g = R$ 0,055 por g.
        </p>
      </section>

      {!isValid && (
        <p className="text-center text-xs text-base-content/50">
          Preencha nome, preço e quantidade da embalagem.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" size="lg" onClick={goBack}>
          Cancelar
        </Button>
        <Button variant="accent" size="lg" disabled={!isValid} onClick={handleSave}>
          Salvar
        </Button>
      </div>

      {/* Confirmação de exclusão */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="Confirmar exclusão"
        >
          <div className="w-full max-w-sm rounded-2xl bg-base-100 p-4 shadow-xl">
            <h2 className="font-bold">Excluir ingrediente?</h2>
            <p className="mt-2 text-sm text-base-content/70">
              “{existing?.name.trim() || 'Sem nome'}” será removido do catálogo. Receitas já criadas
              não serão afetadas.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button variant="outline" size="sm" onClick={() => setConfirmDelete(false)}>
                Cancelar
              </Button>
              <button
                type="button"
                className="btn btn-error btn-sm select-none transition-transform active:scale-95"
                onClick={handleDelete}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientFormPage;
