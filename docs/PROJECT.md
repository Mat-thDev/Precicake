# Precicake

Aplicação web local para gerenciamento de ingredientes, receitas e precificação de produtos de confeitaria.

## 1. Objetivo

Desenvolver uma ferramenta simples e eficiente para auxiliar na precificação de doces, bolos e outros produtos de confeitaria.

O sistema será utilizado por uma única pessoa, com foco em praticidade, baixo custo de manutenção e armazenamento local dos dados.

A aplicação deverá funcionar no computador e permitir acesso pelo celular através da rede Wi-Fi local, utilizando o mesmo banco de dados.

## 2. Stack tecnológica

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- daisyUI
- Lucide React
- Jotai

### Backend
- Node.js
- API local
- Prisma ORM

### Banco de dados
- SQLite

### Execução
- Aplicação web hospedada localmente.
- Acesso pelo navegador do computador.
- Acesso pelo celular através do endereço IP local do computador.
- Sem necessidade de hospedagem ou serviços externos.

## 3. Arquitetura

O Precicake será dividido em três camadas:

1. **Frontend:** interface, navegação, formulários e apresentação dos dados.
2. **Backend:** API responsável pelas operações, regras de negócio e comunicação com o banco.
3. **Banco de dados:** SQLite, armazenado localmente em um arquivo.

O frontend não acessará o SQLite diretamente. Toda operação será realizada através da API local.

O computador será responsável por executar o servidor e armazenar o banco de dados. Outros dispositivos na mesma rede poderão acessar a aplicação através do navegador.

## 4. Funcionalidades

### 4.1. Ingredientes

- Cadastrar ingredientes.
- Editar e excluir ingredientes.
- Informar nome, unidade de medida, quantidade da embalagem e preço de compra.
- Calcular automaticamente o custo por unidade de medida.
- Consultar ingredientes cadastrados.

Exemplo:

| Ingrediente | Embalagem | Preço |
|---|---:|---:|
| Leite condensado | 395 g | R$ 6,50 |
| Chocolate em pó | 1 kg | R$ 28,00 |
| Farinha de trigo | 1 kg | R$ 5,50 |

### 4.2. Receitas

- Criar, editar e excluir receitas.
- Adicionar ingredientes e suas respectivas quantidades.
- Calcular automaticamente o custo dos ingredientes.
- Informar rendimento da receita.
- Consultar custo total e custo por unidade.
- Salvar receitas para consultas futuras.

### 4.3. Precificação

O sistema utilizará inicialmente a seguinte fórmula:

**Etapa 1: Custo dos ingredientes**

Soma do custo proporcional de todos os ingredientes utilizados.

**Etapa 2: Custos indiretos**

Aplicação de um adicional de 20% sobre o custo dos ingredientes.

`custoAjustado = custoIngredientes × 1,20`

**Etapa 3: Preço de venda**

Aplicação do multiplicador escolhido:

`precoVenda = custoAjustado × multiplicador`

Multiplicadores iniciais:
- 2x
- 3x

O sistema deverá apresentar:
- Custo dos ingredientes.
- Valor dos custos indiretos.
- Custo ajustado.
- Preço de venda.
- Custo e preço por unidade, quando houver rendimento definido.

Os percentuais e multiplicadores deverão ser configuráveis futuramente.

## 5. Estrutura do projeto

```text
precicake/
├── src/
│   ├── app/
│   ├── components/
│   │   ├── layout/
│   │   └── ui/
│   ├── modules/
│   │   ├── ingredients/
│   │   ├── recipes/
│   │   └── pricing/
│   ├── services/
│   ├── store/
│   ├── types/
│   └── main.tsx
│
├── server/
│   ├── routes/
│   ├── services/
│   └── index.ts
│
├── prisma/
│   └── schema.prisma
│
├── data/
│   └── confeitaria.db
│
├── package.json
└── README.md
```

A estrutura poderá ser ajustada conforme o desenvolvimento, mantendo a separação entre interface, regras de negócio e persistência.

## 6. Diretrizes de desenvolvimento

- Priorizar uma interface simples, intuitiva e rápida.
- Desenvolver com foco inicial em desktop, mantendo responsividade para celulares.
- Evitar funcionalidades que não contribuam diretamente para a precificação.
- Centralizar os cálculos em serviços independentes da interface.
- Utilizar identificadores estáveis para os registros.
- Armazenar valores monetários com precisão decimal, evitando erros de ponto flutuante.
- Validar os dados antes de salvar no banco.
- Garantir que alterações em ingredientes não modifiquem silenciosamente os custos históricos de receitas já calculadas.
- Implementar backup e restauração dos dados.
- Manter o banco de dados fora dos arquivos temporários ou da pasta de build.

## 7. Escopo do MVP

O primeiro lançamento deverá contemplar:

1. Cadastro e gerenciamento de ingredientes.
2. Cadastro e gerenciamento de receitas.
3. Associação de ingredientes às receitas.
4. Cálculo automático dos custos.
5. Precificação com adicionais e multiplicadores.
6. Configurações básicas.
7. Persistência em SQLite.
8. Acesso pelo computador e celular na rede local.
9. Backup e restauração dos dados.

## 8. Fora do escopo inicial

Não fazem parte do MVP:

- Cadastro de usuários e autenticação.
- Sincronização pela internet.
- Hospedagem em nuvem.
- Integração com sistemas externos.
- Controle de estoque.
- Gestão financeira.
- Emissão fiscal.
- Relatórios avançados.
- Aplicativo nativo para Android ou iOS.

## 9. Evolução futura

A arquitetura deverá permitir a inclusão de funcionalidades sem exigir uma reestruturação completa.

Possíveis evoluções:

- Histórico de preços e alterações de ingredientes.
- Fichas técnicas de produtos.
- Precificação por tamanho e rendimento.
- Custos de embalagem e mão de obra.
- Margem de lucro configurável.
- Exportação de receitas e relatórios.
- Sincronização entre dispositivos pela internet.

Essas funcionalidades serão avaliadas conforme a necessidade real de utilização.

## 10. Princípio do projeto

O Precicake deve ser uma ferramenta prática de trabalho, não um sistema de gestão empresarial.

A prioridade é tornar o processo de cadastrar ingredientes, montar receitas e calcular preços rápido, confiável e simples.