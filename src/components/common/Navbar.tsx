import { Menu } from 'lucide-react';
import useRouter from '../../hooks/useRouter';
import Button from '../ui/Button';
import Logo from './Logo';

/**
 * Barra superior do app — some no Welcome.
 * A volta é feita pelo botão/gesto nativo do Android (useBackButton).
 */
export function Navbar({ title }: UI.NavbarProps) {
  const { currentPage } = useRouter();

  if (currentPage === 'Welcome') return null;

  return (
    <header className="navbar min-h-14 shrink-0 gap-2 border-b border-base-200 bg-base-100 px-3 pt-safe">
      <div className="navbar-start gap-2">
        <Button variant="ghost" className="btn-square" aria-label="Menu">
          <Menu className="h-5 w-5" />
        </Button>
        <Logo size="xs" alt="Precifica" />
      </div>

      <div className="navbar-center">
        <span className="text-sm font-semibold text-base-content">{title}</span>
      </div>

      <div className="navbar-end" />
    </header>
  );
}
