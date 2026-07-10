# Testes Automatizados — EconAO

Este documento explica, em português e sem assumir conhecimento prévio, como funcionam os
testes automatizados deste projecto: o que existe, porque foi feito desta forma, e como
correr tudo localmente. Para o pipeline de CI/CD que corre estes testes automaticamente a
cada push, ver [`docs/CI_CD.md`](./CI_CD.md).

---

## 1. Porquê testes automatizados

Até agora a verificação do EconAO era manual (ver secção 7 de `DOCUMENTACAO_TECNICA.md`):
abrir o browser, fazer login, clicar, confirmar visualmente. Isto funciona, mas tem dois
problemas: (1) é lento — repetir tudo manualmente a cada alteração não é viável; (2) não é
repetível automaticamente — nada impede que uma alteração parta um fluxo que já funcionava
sem que ninguém dê por isso (uma regressão).

Um **teste automatizado** é um pequeno programa que chama uma função ou uma rota da API e
verifica que o resultado é o esperado, sem intervenção humana. Corre em segundos e pode ser
executado automaticamente a cada `git push` (é isso que o CI, em `docs/CI_CD.md`, faz).

---

## 2. Testes do Backend (Vitest)

### 2.1 Porque Vitest e não Jest

O `backend/package.json` tem `"type": "module"` — o backend usa `import`/`export` nativos do
Node (ESM), não `require`. O **Jest** (o test runner mais comum no ecossistema React/Node)
tem suporte a ESM ainda experimental e cheio de configuração extra necessária. O **Vitest** foi
desenhado desde o início para ESM e para projectos com Vite/ESM puro, funciona sem configuração
adicional neste caso, e tem uma API quase idêntica à do Jest (`describe`, `it`, `expect`,
`vi.fn()` em vez de `jest.fn()`) — não há curva de aprendizagem extra.

### 2.2 Estrutura

```
backend/
  vitest.config.js       # configuração do test runner
  vitest.setup.js        # corre antes de todos os testes (variáveis de ambiente)
  src/
    schemas/validation.schemas.test.js
    services/content.service.test.js
    services/auth.service.test.js
    services/quiz.service.test.js
    middlewares/authorize.middleware.test.js
  server.integration.test.js
```

Um ficheiro `X.test.js` ao lado do ficheiro `X.js` que testa é a convenção do Vitest — não é
preciso configurar nada para ele ser encontrado.

### 2.3 Dois tipos de teste usados

**Testes unitários** — testam uma função isolada, sem tocar na base de dados real. Exemplos:

- `validation.schemas.test.js`: testa os schemas Zod (`registerSchema`, `createContentSchema`,
  etc.) — dados válidos passam, dados inválidos são rejeitados com o erro certo.
- `content.service.test.js`: testa `applyExclusiveGate` (a função que esconde o conteúdo
  "Jindungo" de visitantes) diretamente, com objectos de conteúdo criados à mão.
- `authorize.middleware.test.js`: testa o middleware de autorização por papel (`ADMIN`/`USER`)
  chamando-o directamente com objectos `req`/`res`/`next` falsos.
- `quiz.service.test.js`: testa o cálculo de pontuação e do ranking. Este ficheiro usa
  `vi.mock('../lib/prisma.js')` para **substituir o Prisma por uma versão falsa** — assim o
  teste corre em milissegundos e não depende da NeonDB estar acessível.

**Testes de integração** — testam a aplicação Express completa, incluindo rotas, middlewares
de autenticação/autorização e validação, através de pedidos HTTP reais:

- `server.integration.test.js` usa a biblioteca **Supertest** para importar a app do
  `server.js` e fazer-lhe pedidos (`request(app).post('/auth/register')...`) sem precisar de
  arrancar um servidor numa porta real. Cobre casos como: registo com dados inválidos → 400,
  criar conteúdo sem token → 401, criar conteúdo com token de `USER` → 403 (só `ADMIN` pode),
  criar conteúdo com token de `ADMIN` mas corpo inválido → 400 (confirma que a autorização
  passou e falhou na validação, não no acesso).

### 2.4 Como correr

```bash
cd backend
npm test              # corre todos os testes uma vez
npm run test:watch    # corre em modo watch (re-corre ao gravar ficheiros)
npm run test:coverage # gera relatório de cobertura em backend/coverage/
```

---

## 3. Testes do Frontend (Jest + React Testing Library)

### 3.1 Porque Jest aqui e não Vitest

O frontend usa **Create React App (CRA)**, que já vem com Jest e React Testing Library
pré-configurados (`react-scripts test`) — não há necessidade de escolher ou instalar um test
runner à parte. A desvantagem é que o Jest embutido no `react-scripts@5` é uma versão antiga
(27.5.1), anterior a alguns padrões modernos do ecossistema JavaScript — ver secção 3.3.

### 3.2 Estrutura

```
frontend/
  src/
    setupTests.js                 # corre antes de todos os testes
    components/
      Avatar.test.js
      ContentCard.test.js
      BackButton.test.js
  package.json                    # chave "jest" com a configuração extra (ver 3.3)
```

Testes de componentes usam **React Testing Library**: renderizam o componente num DOM virtual
(jsdom) e verificam o que um utilizador veria/faria — texto no ecrã, cliques, navegação —
em vez de inspecionar detalhes internos de implementação.

### 3.3 Três incompatibilidades resolvidas (e porque a configuração existe)

O Jest 27 (bundled no CRA) e as versões actuais de `react-router-dom` (v7) e `lucide-react`
não são directamente compatíveis. Isto exigiu configuração extra em `frontend/package.json`
(chave `"jest"`) e em `frontend/src/setupTests.js`. Se um dia mexeres nestes ficheiros e algo
partir, é útil saber porque cada linha existe:

1. **`Cannot find module 'react-router/dom'`** — o `react-router-dom` v7 usa o campo
   `"exports"` do `package.json` para mapear sub-caminhos (`react-router-dom/dom`, etc.) para
   ficheiros reais. O Jest 27 é anterior ao suporte deste campo e não consegue resolver esse
   mapeamento. **Corrigido** com `moduleNameMapper` em `package.json`, que redirecciona
   manualmente esses imports para os ficheiros concretos dentro de `node_modules`.

2. **`ReferenceError: TextEncoder is not defined`** — o ambiente de teste do Jest (jsdom) não
   define `TextEncoder`/`TextDecoder` globalmente, mas o `react-router-dom` v7 precisa deles
   internamente. **Corrigido** com um polyfill em `setupTests.js`, usando o módulo nativo
   `node:util` do Node.

3. **`SyntaxError: Cannot use import statement outside a module` (`lucide-react`)** — por
   omissão o Jest não transforma (não passa pelo Babel) nada dentro de `node_modules`, para
   ser mais rápido. Mas o `lucide-react` é distribuído apenas em ESM puro, que o Jest não
   consegue interpretar sem transformação. **Corrigido** com `transformIgnorePatterns` em
   `package.json`, que diz ao Jest para abrir uma excepção só para `lucide-react`.

### 3.4 Testar navegação sem mockar `useNavigate`

Uma tentativa inicial de testar a navegação mockando `useNavigate` (`jest.mock('react-router-dom', ...)`)
esbarrou no mesmo problema de resolução de módulos do ponto 1. Em vez de insistir no mock, os
testes (`ContentCard.test.js`, `BackButton.test.js`) usam um pequeno componente auxiliar
`LocationProbe` que lê `useLocation()` e mostra o `pathname` actual num `data-testid`. Isto
tem a vantagem de testar o comportamento real de navegação (para onde é que o clique
efectivamente levou o utilizador), não apenas se uma função mock foi chamada.

### 3.5 Como correr

```bash
cd frontend
npm test                        # modo watch (padrão do CRA)
npm test -- --watchAll=false    # corre uma vez e termina (usado no CI)
```

---

## 4. Resumo prático

| Preciso de... | Comando |
|---|---|
| Correr testes do backend | `cd backend && npm test` |
| Correr testes do backend com cobertura | `cd backend && npm run test:coverage` |
| Correr testes do frontend uma vez | `cd frontend && npm test -- --watchAll=false` |
| Adicionar um novo teste de serviço/schema no backend | Criar `X.test.js` ao lado de `X.js` em `backend/src/` |
| Adicionar um novo teste de componente no frontend | Criar `Componente.test.js` ao lado do componente em `frontend/src/components/` |
