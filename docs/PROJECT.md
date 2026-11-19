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
| Estilo | **Tailwind CSS 4** + **DaisyUI 5** (temas "default" branco-gelo/marrom-cacau e "chocolate" escuro) |
| Estado | **Jotai** (`atomWithStorage` — persistência em **@capacitor/preferences**) |
| Animações | **Framer Motion** (entradas escalonadas, transições entre páginas, toasts) |
| Ícones | **Lucide React** |
| Nativo | **Capacitor 8** (Android-first: preferences, keyboard, status-bar, share, app) |
| UI | Componentes genéricos (`Button`, `Input`, `NumericInput`, `Field`, `Collapse`, `Toast`…) tipados pelo namespace `UI` |

## 🏗️ Arquitetura de Pastas

```
src/
├── types/               # Tipagens globais em NAMESPACES (User, Router, App, UI…)
├── atoms/               # Estado global Jotai (user, router, app, recipes, catalog)
├── components/
│   ├── ui/              # Genéricos: Button, Input, NumericInput, Field, Collapse, Toast
│   └── common/          # BottomBar, Logo, NotFound, SkeletonPage, ThemeSync
├── features/            # Telas: welcome/, home/, recipes/, recipe-detail/,
│                        #        ingredients/, ingredient-form/
├── hooks/               # useRouter, useBackButton, useRecipes, useCatalog,
│                        #   useProfile, useTheme, useToast
├── lib/                 # pricing, share, storage, native, utils
├── styles/              # Tailwind + temas DaisyUI (themes/*.theme.css)
└── Providers.tsx        # Providers globais
```

### Padrões do projeto

- **Namespaces de tipagem** — toda interface vive em `src/types/*.d.ts` (`UI.ButtonProps`, `Router.Routes`, `App.AppState`…)
- **Barrels** — `components/index.ts`, `hooks/index.ts`, `atoms/index.ts` exportam tudo uniformemente
- **Router próprio** — `useRouter` com pilha de navegação (`navigate(page, props)` / `goBack` / `canGoBack`), persistido; volta nativa do Android via `useBackButton`; sem react-router
- **Persistência** — `@capacitor/preferences` via `capacitorStorage()`; `STORAGE_KEYS` centralizado em `lib/storage.ts`; `hydrateStorage()` com timeout de 2s por chave; `storageReadyAtom` e `<SkeletonPage />` até hidratar; página persistida inválida cai para Home
- **Mobile-first** — shell em `100dvh`, safe areas (`env(safe-area-inset-*)`), scroll interno por página (`.page-scroll`), sem zoom de input, feedback `active:scale` nos botões
- **Android nativo** — back button do sistema (`useBackButton`), `adjustResize` do teclado, status bar com ícones conforme o tema
- **Feedback** — toasts daisyUI (`showToast(msg, variant)`) em todos os fluxos; auto-save de receita com debounce de 800ms
- **Formatação** — Prettier (`npm run format`)

## 🧭 Fluxo Atual (MVP funcional)

1. **Welcome** — usuário digita o nome (salvo via `userAtom`) e entra no app
2. **Home** — estatísticas (receitas, ingredientes, preço médio), receitas recentes e atalhos; toggle de tema claro/escuro
3. **Receitas** — lista com busca por nome, criação rápida e preço de venda por cartão
4. **Detalhe da receita** — auto-save com toast; seções em acordeão (① Ingredientes → ② Custos); barra de resumo fixa com total, ×2/×3 e cópia/compartilhamento do preço
5. **Ingredientes** — catálogo com busca, CRUD e preço unitário; receitas copiam (não referenciam) do catálogo

### Fórmula de precificação (final)

```
CI = Σ (preçoEmb ÷ qtdEmb × qtdUsada)
total = CI + CI × %custo + custosAdicionais
Venda = total × 2  |  total × 3   (seleção persistida, padrão ×3)
Preço por pedaço = Venda ÷ porções (opcional)
```

Arredondamento só na exibição (`formatCurrency`); cálculo com precisão total de float.

## 💡 Roadmap (ideias)

- [x] Cadastro de receitas (nome, porções, tempo de preparo)
- [x] Ingredientes com preço por unidade (g, kg, mL, L, un)
- [x] Cálculo automático: custo total → custo por porção → preço sugerido
- [x] Margem de lucro configurável (%)
- [x] Lista/buscador de receitas salvas
- [x] Exportar/Compartilhar precificação (share sheet nativo + fallback cópia)
- [x] Modo escuro ("chocolate amargo")
- [ ] Splash screen com logo
- [ ] Exportar dados / backup
- [ ] Modo de edição em lote de ingredientes

## 🔧 Comandos

| Comando | Descrição |
|---|---|
| `npm run dev` | Dev server na porta 5174 (live reload no dispositivo via `server.url`) |
| `npm run build` | Build de produção (`tsc -b && vite build`) |
| `npm run format` | Formata o código com Prettier |
| `npm run cap:sync` | Build + sincroniza com Android |
| `npx cap open android` | Abre o projeto no Android Studio |

**Dispositivo:** live reload exige `npm run dev` rodando. Mudanças nativas/config exigem `npx cap sync android` + `cd android && .\gradlew assembleDebug` + `adb install -r`.

## 📂 Repositório

GitHub: [Mat-thDev/Precicake](https://github.com/Mat-thDev/Precicake)
