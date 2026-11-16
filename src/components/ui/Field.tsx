/**
 * Rótulo de campo de formulário — associa implicitamente o label ao control.
 * Ex.: <Field label="Preço embal."><NumericInput … /></Field>
 */
const Field = ({ label, children }: UI.FieldProps) => (
  <label className="block">
    <span className="mb-1 block text-[0.65rem] font-medium uppercase tracking-wide text-base-content/50">
      {label}
    </span>
    {children}
  </label>
);

export default Field;
