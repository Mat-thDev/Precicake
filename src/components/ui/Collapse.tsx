import { AnimatePresence, motion } from 'framer-motion';

/**
 * Wrapper de altura animada (0 ↔ auto) para conteúdos colapsáveis.
 * Desmonta o conteúdo quando fechado — nada oculto fica focável.
 */
export function Collapse({ open, children }: UI.CollapseProps) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Collapse;
