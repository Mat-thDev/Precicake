import { BookOpen, ChevronRight, Wheat } from 'lucide-react';
import { Button } from '../../components';
import useRouter from '../../hooks/useRouter';
import useProfile from '../../hooks/useProfile';

const Home = () => {
  const { navigate } = useRouter();
  const { user } = useProfile();

  return (
    <div className="page-scroll h-full w-full space-y-4 px-4 py-4">
      <div>
        <h1 className="text-lg font-bold">{user.username ? `Olá, ${user.username}!` : 'Olá!'}</h1>
        <p className="text-xs text-base-content/60">Gerencie suas receitas e precificação</p>
      </div>

      <div className="space-y-3">
        <Button
          variant="outline"
          size="lg"
          block
          className="justify-between"
          onClick={() => navigate('Recipes')}
        >
          <span className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" aria-hidden />
            Minhas receitas
          </span>
          <ChevronRight className="h-5 w-5" aria-hidden />
        </Button>

        <Button
          variant="outline"
          size="lg"
          block
          className="justify-between"
          onClick={() => navigate('Ingredients')}
        >
          <span className="flex items-center gap-2">
            <Wheat className="h-5 w-5" aria-hidden />
            Ingredientes
          </span>
          <ChevronRight className="h-5 w-5" aria-hidden />
        </Button>
      </div>
    </div>
  );
};

export default Home;
