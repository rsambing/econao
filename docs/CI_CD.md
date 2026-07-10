# CI/CD — EconAO

Este documento explica, em português e sem assumir conhecimento prévio, como funciona o
pipeline de integração contínua (CI) deste projecto no GitHub Actions: o que corre, quando
corre, e como interpretar o resultado. Para os testes automatizados em si (o que é testado e
porquê), ver [`docs/TESTES.md`](./TESTES.md).

---

## 1. CI vs CD — não são a mesma coisa

- **CI (Integração Contínua)** = validar automaticamente que o código ainda funciona
  (testes, build) antes/depois de cada alteração chegar à branch principal. É o que o
  workflow `.github/workflows/ci.yml` faz.
- **CD (Entrega/Implantação Contínua)** = publicar automaticamente uma nova versão em
  produção. No EconAO isto **já existe e é separado**: a Vercel está ligada directamente ao
  repositório GitHub (GitHub App) e faz deploy automático do backend e do frontend a cada
  push para `master`, independentemente do resultado do CI.

Ou seja: hoje, mesmo que o CI falhe, a Vercel continua a fazer deploy (não há um "gate" a
bloquear o deploy se os testes falharem). Isto é aceitável para a fase actual do projecto,
mas é uma limitação a ter em conta — o CI serve para o autor perceber rapidamente que algo
partiu, não (ainda) para impedir automaticamente um deploy problemático.

---

## 2. O que é o GitHub Actions

O **GitHub Actions** é o sistema de automação embutido no GitHub: descreve-se num ficheiro
YAML dentro de `.github/workflows/` uma sequência de passos (um "workflow"), e o GitHub
executa-os automaticamente numa máquina virtual limpa (Ubuntu, neste caso), sempre que o
evento indicado acontece (por exemplo, um `push`). Não é preciso nenhum servidor próprio —
o GitHub fornece a máquina e o tempo de execução gratuitamente até um limite generoso para
repositórios como este.

---

## 3. O workflow deste projecto

Ficheiro: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).

### 3.1 Quando corre

```yaml
on:
  push:
    branches: [master]
  pull_request:
    branches: [master]
```

Corre em duas situações: a cada `push` directo para `master`, e a cada Pull Request aberto
contra `master` (útil se um dia houver mais colaboradores e branches separadas).

### 3.2 Os dois jobs

O workflow tem dois **jobs** — cada um corre numa máquina virtual própria, em paralelo (ao
mesmo tempo, sem um depender do outro terminar):

**Job `backend` — "Backend — testes (Vitest)":**

1. `actions/checkout@v4` — obtém o código do repositório (equivalente a um `git clone`).
2. `actions/setup-node@v4` — instala o Node.js 22 (versão mínima exigida pelo Prisma; ver
   secção 5) e activa cache do npm baseada no `backend/package-lock.json` (torna execuções
   seguintes mais rápidas, sem repetir downloads).
3. `npm ci` — instala as dependências exactamente como estão fixadas no `package-lock.json`
   (ver secção 4 sobre porque não usamos `npm install` aqui).
4. `npm test` — corre a suite Vitest (49 testes: unitários + integração, ver `docs/TESTES.md`).

**Job `frontend` — "Frontend — testes e build":**

1. e 2. iguais ao backend, mas com `frontend/package-lock.json`.
3. `npm ci`.
4. `npm test -- --watchAll=false` (com a variável de ambiente `CI: true`) — corre a suite
   Jest uma vez e sai, em vez de ficar em modo watch à espera de alterações (que é o
   comportamento por omissão do `react-scripts test`, e bloquearia o pipeline para sempre).
5. `npm run build` (com `CI: true` e `REACT_APP_API_URL` apontado para o backend em produção
   na Vercel) — confirma que o build de produção compila sem erros. Isto já apanhou, no
   passado, avisos do ESLint que a Vercel trata como erros fatais em build de produção —
   o CI existe precisamente para apanhar este tipo de problema antes do deploy, mesmo que
   (por agora) não o bloqueie automaticamente.

Nenhum dos dois jobs precisa de acesso à base de dados real (NeonDB) ou a segredos: o
`prisma generate` (chamado implicitamente ao instalar dependências do backend) só gera o
cliente Prisma a partir do schema, não faz nenhuma ligação à base de dados.

### 3.3 Como ver o resultado

No GitHub, separador **Actions** do repositório (`github.com/rsambing/econao/actions`). Cada
push mostra uma execução (run) com os dois jobs; um ✅ verde significa que os testes e o build
passaram nesse commit, um ❌ vermelho significa que algo falhou. Clicar num job mostra o log
completo de cada passo — é aí que se vê a causa exacta de uma falha (ex.: qual teste falhou,
ou qual erro do `npm ci`).

---

## 4. `npm ci` vs `npm install` — porque insistimos no `npm ci`

`npm ci` (de "clean install") só funciona se o `package-lock.json` estiver **exactamente**
em sincronia com o `package.json`; se não estiver, falha imediatamente com um erro claro
(`EUSAGE`). O `npm install` é mais tolerante: se encontrar uma inconsistência, corrige-a
silenciosamente e reescreve o lockfile.

Em CI queremos exactamente o comportamento estrito do `npm ci` — é o que garante que a
máquina do GitHub instala **exactamente** o mesmo conjunto de versões que foste testar
localmente, sem surpresas. Usar `npm install` em CI para "ser mais tolerante" esconderia
problemas reais em vez de os corrigir (por exemplo, alguém commitar um `package.json` sem
actualizar o lockfile).

Isto foi mesmo posto à prova: a primeira versão do workflow falhou porque os dois
`package-lock.json` (backend e frontend) estavam desactualizados — faltava uma dependência
opcional do Vitest (`yaml`) que só é instalada nalgumas combinações de sistema operativo/npm.
A correcção foi apagar `node_modules` e o `package-lock.json` e correr `npm install` de novo
**localmente** para regenerar um lockfile correcto, e só depois confirmar com `npm ci` que
ficou consistente — não mudar o CI para `npm install`.

---

## 5. Node.js 20 → 22

O workflow usa `node-version: 22` em ambos os jobs. Isto foi necessário porque uma das
dependências do backend (`@prisma/streams-local`) exige `node >=22.0.0`; correr o workflow em
Node 20 produzia um aviso `EBADENGINE`. Adicionalmente, o GitHub está a descontinuar
progressivamente o Node 20 nos seus runners — usar Node 22 evita também esse aviso de
depreciação.

---

## 6. Limitações actuais (a considerar no futuro)

- O CI não bloqueia o deploy da Vercel — são dois sistemas independentes (ver secção 1). Uma
  evolução possível seria configurar a Vercel para só fazer deploy depois do CI passar
  (["required status checks"](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
  numa branch protegida), mas isso exigiria proteger a branch `master` e ajustar o fluxo de
  trabalho (hoje o autor faz push directo para `master`).
- Não há testes end-to-end automatizados (ex.: Playwright/Cypress) a correr no CI — a
  cobertura actual é unitária e de integração ao nível da API/componentes, complementada por
  testes manuais (ver secção 7 de `DOCUMENTACAO_TECNICA.md`).
