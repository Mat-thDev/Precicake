import './styles/index.css';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex h-full min-h-0 flex-col">{children}</div>;
};

export default Providers;
