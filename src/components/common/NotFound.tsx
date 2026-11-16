import { CakeSlice } from 'lucide-react';
import Button from '../ui/Button';
import useRouter from '../../hooks/useRouter';

/**
 * Página 404 — usada temporariamente como placeholder das rotas em construção.
 */
const NotFound = ({
  title = 'Página não encontrada',
  description = 'Esta rota ainda está sendo preparada. Volte para o início e tente novamente.',
}: UI.NotFoundProps) => {
  const { navigate } = useRouter();

  return (
    <div className="page-scroll flex h-full w-full flex-col items-center justify-center px-6 pb-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CakeSlice className="h-10 w-10" aria-hidden />
      </div>

      <p className="mt-6 text-6xl font-extrabold tracking-tight text-primary">404</p>

      <h1 className="mt-2 text-xl font-bold text-base-content">{title}</h1>

      <p className="mt-2 max-w-xs text-sm text-base-content/60">{description}</p>

      <Button variant="outline" size="lg" className="mt-8" onClick={() => navigate('Home')}>
        Ir para o início
      </Button>
    </div>
  );
};

export default NotFound;
