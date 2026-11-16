import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button, Input, Logo, Wave } from '../../components';
import useProfile from '../../hooks/useProfile';
import useRouter from '../../hooks/useRouter';

/** Animação escalonada (stagger) dos elementos do Welcome */
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
};

const WelcomePage = () => {
  const [name, setName] = useState('');

  const { setUsername } = useProfile();
  const { navigate } = useRouter();

  const handleSubmit = () => {
    if (!name || name.length > 36) return;
    setUsername(name);
    navigate('Home');
  };

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden">
      <div className="relative flex flex-1 flex-col overflow-hidden bg-primary text-primary-content">
        <Wave />

        <motion.div
          className="relative z-10 flex flex-1 flex-col items-center justify-center px-7 pb-[max(4rem,env(safe-area-inset-bottom))] pt-32 text-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item}>
            <Logo size="lg" />
          </motion.div>

          <motion.h1 className="mt-5 text-2xl font-extrabold tracking-tight" variants={item}>
            Bem-vindo!
          </motion.h1>

          <motion.p className="mt-2 text-sm text-primary-content/75" variants={item}>
            Como devemos te chamar?
          </motion.p>

          <motion.form
            className="mt-8 w-full max-w-sm space-y-4"
            variants={item}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <Input
              variant="filled"
              size="lg"
              type="text"
              placeholder="Seu nome"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
            />

            <Button type="submit" variant="accent" size="lg" block>
              Começar
              <ArrowRight className="h-5 w-5" />
            </Button>
          </motion.form>

          <motion.p className="mt-6 text-xs text-primary-content/50" variants={item}>
            Seu nome fica salvo apenas neste dispositivo
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomePage;
