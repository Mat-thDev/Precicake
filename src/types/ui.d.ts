/**
 * Tipagens dos componentes genéricos de UI (namespace UI)
 */
declare namespace UI {
  type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  type ButtonSize = 'sm' | 'md' | 'lg';

  type InputVariant = 'outline' | 'filled';
  type InputSize = 'sm' | 'md' | 'lg';

  type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'full';

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

  interface NumericInputProps extends Omit<InputProps, 'value' | 'onChange'> {
    value: number | undefined;
    onCommit: (value: number | undefined) => void;
    /** Permite limpar o campo (commita undefined) — usado no rendimento */
    allowEmpty?: boolean;
  }

  interface FieldProps {
    label: string;
    children: React.ReactNode;
  }

  interface LogoProps {
    size?: LogoSize;
    className?: string;
    alt?: string;
  }

  interface NotFoundProps {
    title?: string;
    description?: string;
  }

  interface CollapseProps {
    open: boolean;
    children: React.ReactNode;
  }

  interface CollapsibleSectionProps {
    title: string;
    /** Texto auxiliar exibido abaixo do título quando o corpo está aberto */
    description?: string;
    /** Resumo à direita no header (badge, valor…) — sempre visível */
    summary?: React.ReactNode;
    open: boolean;
    onToggle: () => void;
    children: React.ReactNode;
  }

  interface SkeletonPageProps {
    /** Exibe o esqueleto do título/cabeçalho */
    header?: boolean;
    /** Quantidade de blocos grandes (cards) */
    blocks?: number;
    /** Quantidade de linhas de texto */
    lines?: number;
    className?: string;
  }
}
