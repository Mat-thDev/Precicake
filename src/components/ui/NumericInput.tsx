import { useState } from 'react';
import Input from './Input';
import { parseDecimal } from '../../lib/utils';

const toText = (value: number | undefined): string =>
  value === undefined ? '' : String(value).replace('.', ',');

/**
 * Input numérico com estado local: aceita vírgula pt-BR
 * e só commita valores válidos (não apaga o valor ao limpar o campo).
 */
const NumericInput = ({
  value,
  onCommit,
  allowEmpty = false,
  className,
  ...props
}: UI.NumericInputProps) => {
  const [text, setText] = useState(toText(value));

  return (
    <Input
      {...props}
      inputMode="decimal"
      className={className}
      value={text}
      onChange={(event) => {
        const raw = event.target.value;
        setText(raw);

        if (raw.trim() === '') {
          if (allowEmpty) onCommit(undefined);
          return;
        }

        onCommit(parseDecimal(raw));
      }}
      onBlur={() => setText(toText(value))}
    />
  );
};

export default NumericInput;
