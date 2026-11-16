import { useAtom } from 'jotai';
import { userAtom } from '../atoms';

const useProfile = () => {
  const [user, setUser] = useAtom(userAtom);

  const setUsername = (username: string) => {
    setUser((prev) => ({ ...prev, username }));
  };

  return {
    user,
    setUsername,
  };
};

export default useProfile;
