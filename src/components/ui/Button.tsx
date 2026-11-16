import clsx from 'clsx';

/**
 * Botão genérico do app — variants e sizes padronizados via namespace UI.
 * Ex.: <Button variant="accent" size="lg" block>Enviar</Button>
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  block = false,
  className,
  children,
  type = 'button',
  ...props
}: UI.ButtonProps) => {
  return (
    <button
      type={type}
      className={clsx(
        'btn select-none transition-transform active:scale-95',
        `btn-${variant}`,
        size !== 'md' && `btn-${size}`,
        block && 'w-full',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
