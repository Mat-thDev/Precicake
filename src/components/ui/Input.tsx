import clsx from 'clsx';

/**
 * Input genérico do app — variants e sizes padronizados via namespace UI.
 * - outline: borda padrão (daisyUI)
 * - filled: pílula branca (usada no Welcome)
 * Ex.: <Input variant="filled" size="lg" placeholder="Seu nome" />
 */
const Input = ({ variant = 'outline', size = 'md', className, ...props }: UI.InputProps) => {
  return (
    <input
      className={clsx(
        'input w-full text-base',
        size !== 'md' && `input-${size}`,
        variant === 'filled' &&
          'rounded-full border-none bg-white text-center text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-accent',
        className,
      )}
      {...props}
    />
  );
};

export default Input;
