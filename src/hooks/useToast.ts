import { atom, getDefaultStore } from 'jotai';

export type ToastVariant = 'success' | 'info' | 'error';

export interface ToastMessage {
  id: number;
  message: string;
  variant: ToastVariant;
}

/** Mensagem atual do toast — o <ToastHost /> no App renderiza e auto-descarta */
export const toastAtom = atom<ToastMessage | null>(null);

let nextId = 0;

/** Exibe um toast global (auto-dismiss de ~2,5s no host). Uso: showToast('Salvo') */
export function showToast(message: string, variant: ToastVariant = 'success'): void {
  getDefaultStore().set(toastAtom, { id: ++nextId, message, variant });
}
