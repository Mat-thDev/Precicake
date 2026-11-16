import clsx from 'clsx';

/**
 * Esqueleto genérico de página — exibir durante carregamentos.
 * Ex.: <SkeletonPage blocks={4} lines={3} />
 */
const SkeletonPage = ({
  header = true,
  blocks = 3,
  lines = 2,
  className,
}: UI.SkeletonPageProps) => {
  return (
    <div
      role="status"
      aria-label="Carregando"
      className={clsx('page-scroll h-full w-full px-4 py-4', className)}
    >
      <div className="animate-pulse space-y-4">
        {header && <div className="skeleton h-7 w-1/2 max-w-48 rounded-full" />}

        {Array.from({ length: blocks }).map((_, index) => (
          <div key={`block-${index}`} className="skeleton h-28 w-full rounded-2xl" />
        ))}

        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={`line-${index}`}
            className={clsx('skeleton h-4 rounded-full', index === lines - 1 ? 'w-3/5' : 'w-full')}
          />
        ))}
      </div>
    </div>
  );
};

export default SkeletonPage;
