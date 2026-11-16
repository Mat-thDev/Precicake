# 🍫 Precicake

App mobile **Android-first** para **salvar receitas e precificá-las** — cadastre receitas, descubra o custo por porção e defina um preço de venda justo com margem de lucro.

> 📖 Documentação completa: **[docs/PROJECT.md](docs/PROJECT.md)** — visão geral, arquitetura, padrões e roadmap.

## Stack

- **React 19** + **TypeScript** + **Vite 7**
- **Tailwind CSS 4** + **DaisyUI 5** (tema branco-gelo + marrom-cacau)
- **Jotai** (estado global com persistência) · **Framer Motion** (animações) · **Lucide** (ícones)
- **Capacitor 8** (Android nativo: back button, teclado, status bar)

## Início rápido

```bash
npm install
npm run dev        # dev server com HMR (http://localhost:5174)
```

Para rodar no celular:

```bash
npm run cap:sync            # build + copia para o Android
npx cap open android        # abre no Android Studio → ▶ Run
```

## Estrutura

```
src/
├── types/        # Tipagens em namespaces (User, Router, App, UI)
├── atoms/        # Estado global Jotai (persistido)
├── components/   # UI genéricos (Button, Input) + comuns (Navbar, Logo)
├── features/     # Telas (welcome/, home/)
├── hooks/        # useRouter, useProfile, useBackButton
├── lib/          # Utils e inicialização nativa
└── styles/       # Tailwind + tema DaisyUI
```

## Comandos

| Comando | Descrição |
|---|---|
| `npm run dev` | Dev server na rede local |
| `npm run build` | Build de produção |
| `npm run cap:sync` | Build + sincroniza com Android |
| `npm run format` | Formata com Prettier |

## Licença

Projeto privado — NoDevs LTDA.
