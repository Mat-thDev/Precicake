import { CakeSlice } from 'lucide-react';

// Layout principal: header + conteúdo. Sidebar/menu entra na fase 2.
export function AppShell() {
  return (
    <div className="min-h-screen bg-base-200">
      <header className="navbar bg-base-100 shadow-sm px-4">
        <div className="flex-1 gap-2">
          <CakeSlice className="size-6 text-primary" />
          <span className="text-lg font-semibold">Precicake</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-6">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Estrutura base pronta</h2>
            <p className="text-sm opacity-70">
              Frontend e backend instalados. As telas de ingredientes, receitas e
              precificação serão implementadas nas próximas fases.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
