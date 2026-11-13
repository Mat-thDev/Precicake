import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Calculator, CakeSlice } from 'lucide-react';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-base-200">
      <header className="sticky top-0 z-10 border-b border-base-300 bg-base-100/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <CakeSlice className="size-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight">Precicake</span>
          </div>

          <nav className="ml-2 flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors duration-150 ${
                  isActive
                    ? 'bg-primary/10 font-medium text-primary'
                    : 'text-base-content/60 hover:bg-base-200 hover:text-base-content'
                }`
              }
            >
              <Calculator className="size-4" />
              Calculadora
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
