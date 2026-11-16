import clsx from 'clsx';
import Logomark from '../../assets/logo.png';

/** Logotipo do app — tamanhos padronizados no namespace UI (UI.LogoProps) */
const Logo = ({ size = 'md', className, alt = 'Precifica' }: UI.LogoProps) => {
  return (
    <img
      src={Logomark}
      alt={alt}
      className={clsx(
        {
          'h-7 w-auto': size === 'xs',
          'w-36': size === 'sm',
          'w-56': size === 'md',
          'w-72': size === 'lg',
          'w-full': size === 'full',
        },
        className,
      )}
    />
  );
};

export default Logo;
