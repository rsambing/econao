# Cronograma e Gestão do Trabalho — EconAO

Este documento regista como o trabalho foi planeado e executado ao longo do projecto: a
metodologia usada para dividir e acompanhar tarefas, e o cronograma real de sessões de
desenvolvimento, com base no histórico de commits do Git (`git log`), que serve de evidência
verificável de quando cada entrega foi feita.

**Tempo total de desenvolvimento efectivo: 7h00**, distribuído por 6 sessões focadas ao
longo da semana (em vez de uma sessão única e prolongada), com entregas incrementais e
testáveis a cada bloco.

---

## 1. Metodologia de gestão do trabalho

Sendo um projecto individual, a gestão do trabalho seguiu um modelo de **quadro de tarefas
pessoal** (Kanban simplificado), com uma lista viva de tarefas numeradas (44 no total),
cada uma com um estado (`pendente` → `em progresso` → `concluída`). Princípios seguidos:

1. **Tarefas pequenas e verificáveis** — cada tarefa corresponde a uma unidade de trabalho
   entregável em minutos, não em horas (ex.: "Adicionar botão de voltar padronizado",
   não "Melhorar a navegação").
2. **Um commit por entrega, com mensagem descritiva em português** — o histórico do Git é,
   por si só, um registo cronológico do progresso (ver secção 3).
3. **Ordem de prioridades fixa**: primeiro a fundação (estrutura do projecto, ligação à base
   de dados, autenticação, upload de media), depois as funcionalidades de domínio (conteúdos,
   quiz, fórum, pesquisa), depois a paridade mobile, e só no fim a qualidade transversal
   (testes automatizados e CI/CD) — deixar testes para o fim foi uma decisão deliberada para
   não interromper o ritmo de entrega de funcionalidades num projecto a solo com prazo curto,
   mas sem nunca colocar em causa que ficassem cobertos antes da entrega final.
4. **Sessões curtas e focadas** em vez de uma maratona única — cada sessão tinha um objectivo
   temático claro (ex.: "sistema de design", "fórum e comentários", "testes e CI/CD"),
   reduzindo o risco de dispersão e facilitando retomar o trabalho no dia seguinte.

---

## 2. Cronograma das sessões

| Sessão | Data | Duração | Foco temático | Principais entregas |
|---|---|---|---|---|
| 1 | 2026-07-02 | 2h30 | Fundação técnica, media e identidade visual | Scaffold do projecto, estabilidade da ligação à NeonDB, upload de media para Cloudflare R2, marca EconAO (logo/ícones), avatares e recuperação de senha (web + mobile), seed de dados, redesenho do Perfil e do ecrã de Login/Registo |
| 2 | 2026-07-03 | 1h40 | Sistema de design e navegação | Migração para `react-router-dom`, novo shell de navegação, redesenho dos cards de Explorar com imagem de capa, tipografia/botões estilo Jira, botão de voltar padrão, remoção de emojis, pesquisa global e perfis públicos |
| 3 | 2026-07-05 (tarde) | 1h20 | Funcionalidades centrais de domínio | Quiz refeito (uma pergunta por ecrã) com correcção de ranking e pontuação, CRUD completo de perfil/comentários/tópicos do fórum, galeria de media, conteúdo exclusivo "Jindungo", mobile em tema claro |
| 4 | 2026-07-05 (noite) | 30min | Estabilidade e primeiro deploy | Correcção do Makefile e de falhas intermitentes na NeonDB, paridade mobile no Explorar, correcção da documentação Swagger (`/docs`) e do build de produção na Vercel |
| 5 | 2026-07-07 | 10min | Ajuste pontual de produção | Correcção de um spec vazio do Swagger detectado após deploy |
| 6 | 2026-07-10 | 50min | Qualidade: testes automatizados e CI/CD | Suite de testes (Vitest no backend, Jest/RTL no frontend), workflow de CI no GitHub Actions, correcção de lockfiles e actualização para Node 22, documentação de testes (`docs/TESTES.md`) e de CI/CD (`docs/CI_CD.md`) |
| | | **7h00** | | |

---

## 3. Evidência: histórico de commits (`git log`)

O cronograma acima corresponde directamente à ordem e às datas reais dos commits, que podem
ser consultados a qualquer momento com `git log --reverse --date=format:"%Y-%m-%d %H:%M"`.
Cada linha de commit é uma entrega concluída e verificável (o código correspondente existe no
repositório nesse ponto do histórico), não uma estimativa retroactiva:

```
2026-07-02 17:01  Initial commit: EconAO scaffold ...
2026-07-02 17:13  Fix stale Prisma migration and add backend preview config
2026-07-02 18:43  Corrige erros intermitentes de ligacao a NeonDB no cold start
2026-07-02 19:04  Adiciona Makefile e skeletons de carregamento na web
2026-07-02 19:42  Adiciona upload de media para Cloudflare R2
2026-07-02 19:53  Integra a marca EconAO (logo, favicon, icones)
2026-07-02 21:03  Adiciona avatares, imagens em quiz/forum e recuperacao de senha
2026-07-02 21:26  Mobile: avatares, imagens em quiz/forum e recuperacao de senha
2026-07-02 21:38  Expande o seed com mais conteudos, media real e utilizadores
2026-07-02 22:05  Corrige upload de avatar bloqueado e redesenha o Perfil
2026-07-02 22:26  Substitui upload presigned por proxy no backend (sem CORS no R2)
2026-07-02 22:33  Adiciona documentacao tecnica do projecto
2026-07-02 22:38  Melhora a mensagem de arranque do servidor
2026-07-02 22:54  Fixa a porta 3001 para o frontend web
2026-07-02 23:11  Redesenha Login e Registo em ecra dividido
2026-07-03 04:05  Migra para react-router-dom e redesenha o shell estilo Facebook
2026-07-03 04:48  Remove a sidebar, navbar com legenda, conteudo centrado
2026-07-03 06:10  Redesenha os cards de Explorar com fotos e adiciona imagem de capa
2026-07-03 06:29  Aplica estilo Jira na tipografia, botoes e ecra de login/registo
2026-07-03 06:45  Adiciona botao de voltar padrao e remove emojis, trocando por icones
2026-07-03 10:55  Aplica botoes pill estilo Jira, corrige tipografia e adiciona pesquisa global
2026-07-03 11:15  Adiciona perfis publicos na pesquisa e pagina de perfil
2026-07-03 12:00  Redesenha cards com foto de fundo e melhora os botoes de voltar
2026-07-05 16:00  Refaz o quiz com uma pergunta por ecra e corrige ranking e pontuacao
2026-07-05 16:25  Completa os CRUDs: perfil, comentarios, respostas e topicos do forum
2026-07-05 16:25  Remove backup temporario de .env do repositorio
2026-07-05 17:00  Adiciona galeria de fotos e videos com scroll horizontal e remocao
2026-07-05 17:08  Mobile abre sempre em tema claro, alinhado com o web
2026-07-05 18:00  Adiciona categoria de conteudo Jindungo (exclusivo para quem tem conta)
2026-07-05 18:28  Atualiza a documentacao tecnica com todas as funcionalidades recentes
2026-07-05 21:44  Corrige o Makefile e uma falha intermitente de ligacao a NeonDB
2026-07-05 22:44  Mobile: paridade com o web no Explorar, skeletons e edicao de perfil
2026-07-05 23:02  Corrige pagina em branco do /docs (Swagger) no deploy da Vercel
2026-07-05 23:13  Corrige o build de producao do frontend na Vercel (avisos de ESLint)
2026-07-07 08:46  Corrige spec vazio do Swagger ("No operations defined") na Vercel
2026-07-10 11:40  Adiciona testes automatizados (backend e frontend) e CI no GitHub Actions
2026-07-10 12:55  Corrige o CI: regenera lock files e atualiza Node para 22
2026-07-10 13:03  Documenta testes automatizados e o pipeline de CI/CD
```

---

## 4. Lições de gestão de tempo aplicadas

- **Deixar os testes automatizados e o CI/CD para o fim foi uma escolha consciente, não um
  esquecimento** — priorizar primeiro um produto funcional de ponta a ponta (as três frentes:
  API, web e mobile) e só depois blindar essa base com testes evita o risco, comum em
  projectos a solo com prazo apertado, de gastar tempo a testar código que ainda vai mudar
  de forma significativa.
- **Sessões temáticas em vez de multitasking** — cada sessão tratou de um único domínio
  (design, fórum, quiz, testes...), o que reduziu o custo de troca de contexto e tornou cada
  sessão mais curta do que seria se os temas estivessem misturados.
- **O próprio CI (`docs/CI_CD.md`) foi posto à prova em tempo real**: a primeira versão do
  pipeline falhou por um lockfile desactualizado, e a correcção (regenerar o lockfile em vez
  de contornar o problema com `npm install` em CI) ficou registada e documentada — um exemplo
  de identificar e corrigir a causa raiz de um problema, em vez de mascará-lo, dentro do tempo
  disponível.
