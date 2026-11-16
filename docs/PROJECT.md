# Precicake — Visão Geral do Projeto

> App mobile **Android-first** para **salvar receitas e precificá-las** — transforme qualquer receita (bolo, brigadeiro, pão…) em um produto com preço de venda justo, custo por porção e margem de lucro.

## 🎯 Conceito

O **Precicake** resolve a dúvida de todo pequeno produtor de alimentos artesanais:

> *"Quanto eu gasto para fazer isso, e por quanto eu devo vender?"*

O usuário cadastra uma receita com seus ingredientes e quantidades; o app calcula o **custo total**, o **custo por porção** e sugere um **preço de venda** com base na margem desejada — permitindo **salvar, organizar e comparar** receitas para precificar seus produtos com segurança.

## 📱 Plataforma e Stack

| Camada | Tecnologia |
|---|---|
| Framework | **React 19** + **TypeScript** |
| Build | **Vite 7** |
| Estilo | **Tailwind CSS 4** + **DaisyUI 5** (tema próprio "default": branco-gelo + marrom-cacau) |
| Estado | **Jotai** (`atomWithStorage` — persistência em localStorage) |
| Animações | **Framer Motion** (entradas escalonadas, transições entre páginas) |
| Ícones | **Lucide React** |
| Nativo | **Capacitor 8** (Android-first) |
| UI | Componentes genéricos (`Button`, `Input`, `Logo`, `Navbar`, `Wave`) tipados pelo namespace `UI` |

## 🏗️ Arquitetura de Pastas

```
src/
├── @types → types/      # Tipagens globais em NAMESPACES (User, Router, App, UI)
├── atoms/               # Estado global Jotai (user, router, app) com persistência
├── components/
│   ├── ui/              # Genéricos: Button, Input
│   ├── common/          # Navbar, Logo
│   └── Wave.tsx         # Decoração bezier
├── features/            # Telas por módulo (welcome/, home/ …)
├── hooks/               # useRouter, useProfile, useBackButton
├── lib/                 # Utilitários (utils, native)
├── styles/              # Tailwind + tema DaisyUI
└── Providers.tsx        # Theme + Providers globais
```

### Padrões do projeto

- **Namespaces de tipagem** — toda interface vive em `src/types/*.d.ts` (`UI.ButtonProps`, `Router.Routes`, `User.UserData`…)
- **Barrels** — `components/index.ts`, `hooks/index.ts`, `atoms/index.ts` exportam tudo uniformemente
- **Router próprio** — `useRouter` com pilha de navegação (`navigate` / `goBack` / `canGoBack`), persistido no localStorage
- **Mobile-first** — shell em `100dvh`, safe areas (`env(safe-area-inset-*)`), scroll interno por página (`.page-scroll`), sem zoom de input, feedback `active:scale` nos botões
- **Android nativo** — back button do sistema (`useBackButton`), `adjustResize` do teclado, status bar com ícones escuros
- **Formatação** — Prettier (`npm run format`)

## 🧭 Fluxo Atual (MVP em andamento)

1. **Welcome** — usuário digita o nome (salvo via `userAtom`) e entra no app
2. **Home** — scaffold de página (a ser preenchido com a lista de receitas)
3. **Próximos passos** — cadastro de receitas → ingredientes com quantidade/preço → cálculo de custo e precificação

## 💡 Roadmap (ideias)

- [ ] Cadastro de receitas (nome, porções, tempo de preparo)
- [ ] Ingredientes com preço por unidade (kg, g, L, un)
- [ ] Cálculo automático: custo total → custo por porção → preço sugerido
- [ ] Margem de lucro configurável (%)
- [ ] Lista/buscador de receitas salvas
- [ ] Exportar/Compartilhar precificação
- [ ] Modo escuro ("chocolate amargo")
- [ ] Splash screen com logo

## 🔧 Comandos

| Comando | Descrição |
|---|---|
| `npm run dev` | Dev server (HMR na rede local) |
| `npm run build` | Build de produção (`dist/`) |
| `npm run cap:sync` | Build + sincroniza com Android |
| `npm run format` | Formata o código com Prettier |
| `npx cap open android` | Abre o projeto no Android Studio |

## 📂 Repositório

GitHub: [Mat-thDev/Precicake](https://github.com/Mat-thDev/Precicake)
