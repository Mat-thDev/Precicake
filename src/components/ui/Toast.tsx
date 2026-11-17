import { useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, XCircle } from 'lucide-react';
import clsx from 'clsx';
import { toastAtom, type ToastVariant } from '../../hooks/useToast';

const AUTO_DISMISS_MS = 2500;

const VARIANTS: Record<ToastVariant, { icon: typeof CheckCircle2; className: string }> = {
  success: { icon: CheckCircle2, className: 'alert-success' },
  info: { icon: Info, className: 'alert-info' },
  error: { icon: XCircle, className: 'alert-error' },
};

/**
 * Host global dos toasts — montar uma única vez no App.
 * Posição fixa no topo (abaixo da status bar), saída animada, auto-dismiss.
 */
export function ToastHost() {
  const toast = useAtomValue(toastAtom);
  const setToast = useSetAtom(toastAtom);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [toast, setToast]);

  const variant = toast ? VARIANTS[toast.variant] : null;
  const Icon = variant?.icon;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-col items-center gap-2 px-4 pt-[max(1rem,env(safe-area-inset-top))]"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence>
        {toast && variant && Icon && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="max-w-full"
          >
            <div className={clsx('alert shadow-lg', variant.className)}>
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ToastHost;
