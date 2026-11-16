/**
 * Tipagens dos componentes genéricos de UI (namespace UI)
 */
declare namespace UI {
  type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  type ButtonSize = 'sm' | 'md' | 'lg';

  type InputVariant = 'outline' | 'filled';
  type InputSize = 'sm' | 'md' | 'lg';

  type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'full';

  interface NavbarProps {
    title: string;
  }

  interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    /** Ocupa toda a largura disponível */
    block?: boolean;
    className?: string;
    children?: React.ReactNode;
  }

  interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
    variant?: InputVariant;
    size?: InputSize;
    className?: string;
  }

  interface LogoProps {
    size?: LogoSize;
    className?: string;
    alt?: string;
  }
}
