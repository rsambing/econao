# EconAO — Economia com História: Angola

**Relatório Técnico de Engenharia de Software**
Instituto Superior Politécnico de Tecnologias e Ciências (ISPTEC)
Departamento de Engenharia e Tecnologias — Engenharia de Software II
Licenciatura em Engenharia Informática — 2025/2026

**Repositório:** [github.com/rsambing/econao](https://github.com/rsambing/econao)
**Ambiente hospedado:** _a definir — projecto corre atualmente em ambiente local funcional (backend, web e mobile), conforme permitido pelo enunciado_

---

## Índice

1. [Introdução](#1-introdução)
2. [Requisitos](#2-requisitos)
3. [Perfis de Utilizador](#3-perfis-de-utilizador)
4. [Arquitetura e Design](#4-arquitetura-e-design)
5. [Organização da Estrutura de Pastas do Projeto](#5-organização-da-estrutura-de-pastas-do-projeto)
6. [Implementação](#6-implementação)
7. [Testes Realizados](#7-testes-realizados)
8. [Implantação](#8-implantação)
9. [Conclusão](#9-conclusão)
10. [Referências Bibliográficas](#10-referências-bibliográficas)

---

## 1. Introdução

### 1.1 Descrição do Problema

A realidade educacional angolana enfrenta desafios estruturais no ensino da história económica do país: desigualdade territorial no acesso a materiais didáticos, escassez de conteúdos contextualizados à realidade angolana e baixa integração de tecnologias digitais no ensino da economia e da história. Os recursos existentes são maioritariamente estáticos (manuais, apontamentos), não promovem participação activa do estudante, não têm mecanismos de avaliação do conhecimento adquirido, e não criam espaço para debate e construção colectiva de conhecimento entre estudantes.

Esta situação limita o desenvolvimento do pensamento crítico dos estudantes sobre temas centrais da economia angolana — reformas monetárias, exportação de petróleo, urbanização, migração, comércio colonial — e não aproveita o acesso crescente a dispositivos móveis para tornar este conteúdo acessível fora da sala de aula.

### 1.2 Objectivos

#### Objectivo Geral

Desenvolver uma aplicação educativa digital — **EconAO** — que disponibilize conteúdos sobre economia e história de Angola de forma acessível, interativa e territorialmente contextualizada, através de uma plataforma web (com painel público e painel de gestão) e de uma aplicação móvel, ambas consumindo a mesma API REST.

#### Objectivos Específicos

1. Disponibilizar conteúdos multimédia (vídeo, texto, podcast) sobre temas de história económica angolana, organizados por tema e região, com galeria de fotos/vídeos adicionais por conteúdo.
2. Implementar um sistema de quizzes interactivos, jogado uma pergunta de cada vez, com correcção automática, pontuação que penaliza repetições e ranking por quiz.
3. Implementar um fórum de discussão que permita a criação, edição e remoção de tópicos e respostas entre utilizadores.
4. Permitir comentários (com edição e remoção) em conteúdos publicados, promovendo participação e debate.
5. Implementar autenticação segura com dois níveis de acesso (ADMIN / USER), recuperação de senha por email e edição do próprio perfil (nome, email, senha, avatar).
6. Disponibilizar um painel de gestão (backoffice) para administração de conteúdos e quizzes, distinto do painel público.
7. Suportar upload de imagens/vídeos/áudio associados a conteúdos, quizzes, tópicos de fórum e perfis de utilizador, com armazenamento em object storage dedicado.
8. Disponibilizar uma pesquisa global (conteúdos, quizzes, tópicos do fórum e pessoas) e perfis públicos read-only de utilizadores.
9. Restringir uma categoria de conteúdo ("Jindungo") a utilizadores autenticados, mantendo um teaser público visível a visitantes.
10. Implementar a aplicação em três frentes tecnológicas coordenadas — API REST, aplicação web e aplicação móvel — partilhando o mesmo modelo de dados e regras de negócio, com um sistema de design consistente entre web e mobile.

### 1.3 Visão Geral do Projecto

O EconAO é composto por três aplicações independentes que comunicam através de uma única API REST:

- **Backend** (`backend/`) — API REST em Node.js/Express, persistência em PostgreSQL (NeonDB, serverless) via Prisma ORM, autenticação JWT (obrigatória e opcional), envio de email (recuperação de senha) e armazenamento de media em Cloudflare R2.
- **Web** (`frontend/`) — Aplicação React (Create React App) com painel público (Explorar, Quiz, Fórum, Pesquisa, Perfil próprio e perfis públicos de terceiros) e painel de gestão/backoffice (`/admin`, `/admin/quiz`) restrito a administradores. Sistema de design inspirado no Jira (tipografia forte, botões em pill, navbar com pesquisa).
- **Mobile** (`mobile/`) — Aplicação React Native com Expo Router, espelhando os fluxos públicos do painel web (autenticação, exploração de conteúdos com reprodução nativa de vídeo/áudio, quiz com ranking, fórum com criação/edição/eliminação de tópicos e respostas, pesquisa global, perfil próprio e perfis públicos de terceiros), sempre em tema claro para consistência visual com o web.

Ao contrário de um protótipo estático, o EconAO implementa persistência real em base de dados relacional, autenticação e autorização por perfil (incluindo autorização por posse do recurso — autor ou administrador), upload de ficheiros para object storage, pesquisa global multi-entidade, e três clientes (web público, backoffice, mobile) sobre a mesma API — cumprindo os requisitos de arquitectura em camadas, modelação de dados normalizada e separação entre painel público e painel de gestão exigidos pelo enunciado do projecto.

---

## 2. Requisitos

### 2.1 Requisitos Funcionais

| ID | Descrição |
|---|---|
| RF-01 | O sistema deve permitir o registo público de novos utilizadores (nome, email, senha), atribuindo automaticamente o papel USER. |
| RF-02 | O sistema deve permitir autenticação por email e senha, devolvendo um token JWT. |
| RF-03 | O sistema deve permitir a um utilizador autenticado consultar e atualizar o seu próprio perfil: nome, foto de perfil, email e senha (as duas últimas exigem confirmação da senha atual). |
| RF-04 | O sistema deve permitir a recuperação de senha através do envio de um link por email, válido por tempo limitado. |
| RF-05 | O sistema deve permitir a um administrador criar, editar, listar e eliminar conteúdos (vídeo, texto ou podcast), incluindo uma galeria de fotos/vídeos adicionais e a marcação como conteúdo exclusivo ("Jindungo"). |
| RF-06 | O sistema deve permitir a qualquer visitante listar e consultar conteúdos publicados, filtrados por tipo e tema. |
| RF-07 | O sistema deve permitir a um utilizador autenticado comentar um conteúdo, e ao autor do comentário (ou a um administrador) editá-lo ou eliminá-lo. |
| RF-08 | O sistema deve permitir a um administrador criar um quiz com múltiplas perguntas e opções de resposta, identificando a opção correcta. |
| RF-09 | O sistema deve permitir a qualquer visitante consultar os quizzes disponíveis e as respectivas perguntas, sem revelar a resposta correcta antes da submissão. |
| RF-10 | O sistema deve apresentar o quiz uma pergunta de cada vez (com barra de progresso e navegação anterior/seguinte), e permitir a um utilizador autenticado submeter as respostas, calculando automaticamente a pontuação obtida e o número de tentativas já realizadas. |
| RF-11 | O sistema deve calcular e apresentar um ranking (top 10) por quiz, sem duplicar utilizadores, mostrando a melhor pontuação de cada um e o número de vezes que jogou. |
| RF-12 | O sistema deve permitir a qualquer utilizador autenticado criar um tópico de fórum, com título, descrição, tema/categoria e galeria de fotos/vídeos opcional. |
| RF-13 | O sistema deve permitir a qualquer utilizador autenticado responder a um tópico de fórum existente, e ao autor do tópico/resposta (ou a um administrador) editá-lo por completo ou eliminá-lo. |
| RF-14 | O sistema deve permitir o upload de ficheiros (imagem, vídeo, áudio) associados a conteúdos, quizzes, tópicos de fórum e avatares de utilizador, incluindo múltiplos ficheiros por conteúdo/tópico (galeria) com possibilidade de remoção individual. |
| RF-15 | O sistema deve atribuir um avatar por defeito (iniciais do nome) a utilizadores sem foto de perfil definida. |
| RF-16 | O sistema deve disponibilizar um painel de gestão (backoffice), acessível apenas a administradores, distinto do painel público. |
| RF-17 | O sistema deve disponibilizar as mesmas funcionalidades de consulta pública (conteúdos, quiz, fórum) na aplicação móvel, num tema visual claro alinhado com o web. |
| RF-18 | O sistema deve disponibilizar uma pesquisa global (por texto) que devolva resultados agrupados por conteúdos, quizzes, tópicos de fórum e pessoas. |
| RF-19 | O sistema deve disponibilizar um perfil público (read-only) de qualquer utilizador, com nome, avatar, papel, data de adesão, tópicos criados no fórum e melhores pontuações em quizzes — sem expor dados sensíveis como o email. |
| RF-20 | O sistema deve permitir marcar um conteúdo como exclusivo ("Jindungo"), mostrando-o normalmente a utilizadores autenticados e apenas um teaser (título, tema, região, capa) a visitantes, escondendo corpo, media, galeria e comentários. |

### 2.2 Requisitos Não Funcionais

| ID | Descrição |
|---|---|
| RNF-01 | As passwords devem ser armazenadas com hash (bcrypt), nunca em texto simples. |
| RNF-02 | O acesso a operações de escrita deve exigir autenticação via token JWT, validado em middleware dedicado. |
| RNF-03 | Operações de gestão de conteúdos e quizzes devem estar restritas ao papel ADMIN, validado em middleware de autorização por papel; a edição/remoção de comentários, respostas e tópicos deve estar restrita ao respectivo autor ou a um ADMIN, validado ao nível do serviço. |
| RNF-04 | Rotas públicas que precisam de saber se o visitante tem sessão iniciada (listagem/detalhe de conteúdo, pesquisa) devem usar autenticação opcional — nunca bloqueiam o pedido, apenas ajustam a resposta. |
| RNF-05 | A ligação à base de dados deve reciclar ligações inactivas (idle) rapidamente, para tolerar a suspensão automática da instância serverless (NeonDB) sem falhas visíveis ao utilizador. |
| RNF-06 | O upload de ficheiros deve ser processado no servidor (proxy), sem exigir configuração de CORS em serviços de terceiros (object storage). |
| RNF-07 | O sistema deve ser modular, com separação clara entre camadas de rota, controlador, serviço e acesso a dados (arquitectura em camadas) no backend. |
| RNF-08 | O modelo de dados deve ser relacional e normalizado, com integridade referencial garantida por chaves estrangeiras e eliminação em cascata onde aplicável. |
| RNF-09 | A interface deve ser responsiva, adaptando-se a ecrãs desktop, tablet e mobile na aplicação web. |
| RNF-10 | O sistema deve fornecer feedback visual de carregamento (skeleton screens) em vez de bloquear a interface durante pedidos assíncronos. |
| RNF-11 | O código-fonte deve estar sob controlo de versão (Git/GitHub), com histórico de commits coerente com as alterações realizadas. |
| RNF-12 | As credenciais e segredos (base de dados, JWT, SMTP, object storage) devem ser geridos por variáveis de ambiente, nunca incluídos no controlo de versão. |
| RNF-13 | A aplicação móvel e a aplicação web devem consumir a mesma API, sem duplicação de regras de negócio no cliente, e partilhar a mesma identidade visual (cores, tipografia, tema claro). |

### 2.3 Regras de Negócio

| ID | Descrição |
|---|---|
| RN-01 | Apenas utilizadores com papel ADMIN podem criar, editar ou eliminar Conteúdos e Quizzes. |
| RN-02 | Qualquer utilizador autenticado (USER ou ADMIN) pode comentar Conteúdos, criar Tópicos de Fórum e responder a Tópicos. |
| RN-03 | O registo público de utilizadores atribui sempre o papel USER; o papel ADMIN só pode ser atribuído por outro administrador através da gestão de utilizadores. |
| RN-04 | Um quiz só pode ser criado com pelo menos uma pergunta, e cada pergunta com pelo menos duas opções, sendo obrigatória a marcação de uma opção correcta. |
| RN-05 | A resposta correcta de uma pergunta de quiz nunca é devolvida ao cliente antes da submissão da tentativa. |
| RN-06 | A pontuação de uma tentativa de quiz é calculada no servidor, comparando as respostas submetidas com as opções marcadas como correctas — nunca confiando em cálculo feito no cliente. |
| RN-07 | O ranking de um quiz apresenta as 10 melhores pontuações, uma entrada por utilizador (nunca duplicado): a pontuação final é a melhor tentativa menos 1 ponto por cada repetição (nunca abaixo de 0), de forma a premiar quem acerta tudo à primeira tentativa; em caso de empate de pontos, desempata pela melhor pontuação bruta e depois pelo menor número de tentativas. |
| RN-08 | O token de recuperação de senha expira 1 hora após a sua geração e é invalidado (removido) após uma redefinição bem-sucedida. |
| RN-09 | O pedido de recuperação de senha nunca revela se um determinado email está ou não registado no sistema (resposta genérica). |
| RN-10 | A eliminação de um Conteúdo ou Tópico de Fórum elimina em cascata os respectivos Comentários, Respostas e itens de galeria (MediaItem) associados. |
| RN-11 | Ficheiros enviados por upload são organizados em `images/` ou `videos/` no object storage, consoante o tipo MIME do ficheiro. |
| RN-12 | Um utilizador sem `avatarUrl` definido é representado, em todos os clientes (web e mobile), por um círculo com as suas iniciais — nunca por um espaço vazio. |
| RN-13 | A alteração do próprio email ou da própria senha exige a confirmação da senha atual; um email já em uso por outra conta é rejeitado. |
| RN-14 | Um comentário, resposta de fórum ou tópico de fórum só pode ser editado ou eliminado pelo respectivo autor ou por um ADMIN; qualquer outra tentativa é rejeitada (403). |
| RN-15 | Um conteúdo marcado como exclusivo ("Jindungo") mostra sempre o teaser (título, tema, região, capa) a qualquer visitante; o corpo, o `mediaUrl`, a galeria e os comentários só são devolvidos pela API quando o pedido é autenticado — esta regra aplica-se de forma consistente à listagem, ao detalhe e à pesquisa global. |
| RN-16 | A pesquisa global cobre Conteúdos (título, corpo, tema, região), Quizzes (título), Tópicos de Fórum (título, descrição, tema) e Utilizadores (nome), é case-insensitive e devolve no máximo 20 resultados por categoria. |

---

## 3. Perfis de Utilizador

| Perfil | Descrição | Permissões |
|---|---|---|
| **Visitante (não autenticado)** | Qualquer pessoa que aceda à aplicação web ou móvel sem sessão iniciada. | Consultar conteúdos (excepto o conteúdo integral de itens "Jindungo"), quizzes (sem submeter), tópicos de fórum (sem responder), perfis públicos e resultados de pesquisa. Pode registar-se ou iniciar sessão. |
| **Utilizador (USER)** | Estudante ou membro da comunidade registado na plataforma. | Todas as permissões de Visitante, mais: ver o conteúdo integral de itens "Jindungo", comentar conteúdos, submeter tentativas de quiz, criar tópicos e responder no fórum, editar/eliminar os seus próprios comentários/respostas/tópicos, atualizar o próprio perfil (nome, email, senha, avatar). |
| **Administrador (ADMIN)** | Gestor de conteúdo pedagógico da plataforma (ex.: docente, equipa editorial). | Todas as permissões de Utilizador, mais: criar/editar/eliminar Conteúdos e Quizzes, marcar conteúdos como "Jindungo", editar ou eliminar qualquer comentário/resposta/tópico de qualquer utilizador, aceder ao painel de gestão (`/admin`, `/admin/quiz`). |

> Nota para a versão final do relatório em `.docx`: incluir nesta secção uma tabela com fotografias/avatares representativos de cada perfil (capturas de ecrã do avatar por defeito e de um avatar carregado), e uma breve jornada de utilizador (user journey) ilustrada para o perfil Visitante → Utilizador → submissão de quiz → consulta de perfil público de outro utilizador.

---

## 4. Arquitetura e Design

### 4.1 Visão Geral da Arquitetura

```
┌─────────────┐      ┌─────────────┐
│   Web        │      │   Mobile     │
│  (React)     │      │ (Expo/RN)    │
└──────┬──────┘      └──────┬──────┘
       │        REST/JSON          │
       └───────────┬───────────────┘
                    ▼
            ┌───────────────┐
            │   Backend      │
            │ Express + JWT  │
            └───┬───────┬────┘
                │       │
       ┌────────┘       └────────┐
       ▼                         ▼
┌─────────────┐          ┌──────────────┐
│  NeonDB      │          │ Cloudflare R2│
│ (PostgreSQL) │          │  (media)     │
└─────────────┘          └──────────────┘
```

| Camada | Tecnologia | Justificação |
|---|---|---|
| Base de dados | PostgreSQL (NeonDB, serverless) | Relacional, normalizada, com suporte nativo a chaves estrangeiras e transacções; NeonDB elimina a necessidade de gerir infraestrutura de BD. |
| ORM | Prisma (com adapter `pg`) | Migrações versionadas, type-safety, geração automática de cliente a partir do schema. |
| API | Node.js + Express 5 | Arquitectura em camadas (rotas → controladores → serviços → Prisma), validação com Zod, autenticação JWT (obrigatória e opcional). |
| Autenticação | JWT + bcrypt | Stateless, adequado a múltiplos clientes (web + mobile) sem sessão partilhada. |
| Email | Nodemailer (SMTP) | Envio do link de recuperação de senha. |
| Object Storage | Cloudflare R2 (API compatível S3) | Armazenamento de imagens/vídeos/áudio; upload em proxy pelo backend (sem exigir CORS no bucket). |
| Web | React 19 (CRA) + react-router-dom | Componentização, SPA leve com routing por URL, sem necessidade de SSR para este caso de uso. |
| Mobile | Expo + Expo Router + React Native | Desenvolvimento e testes rápidos (Expo Go), routing por ficheiros, partilha de padrões visuais com a web. |

### 4.2 Modelo de Dados

O modelo de dados é composto por 10 entidades principais, todas geridas via Prisma:

- **User** — id, name, email (único), password (hash), role (ADMIN/USER), avatarUrl, resetPasswordToken, resetPasswordExpiresAt, createdAt
- **Content** — id, type (VIDEO/TEXT/PODCAST), title, body, mediaUrl, imageUrl, theme, region, **isExclusive** (conteúdo "Jindungo"), authorId → User
- **MediaItem** — id, url, type (IMAGE/VIDEO/AUDIO), order, contentId → Content (opcional) ou topicId → ForumTopic (opcional) — galeria de ficheiros extra por conteúdo ou tópico
- **Comment** — id, body, contentId → Content, authorId → User
- **Quiz** — id, title, imageUrl
- **Question** — id, text, order, quizId → Quiz
- **Option** — id, text, isCorrect, questionId → Question
- **QuizAttempt** — id, score, userId → User, quizId → Quiz
- **ForumTopic** — id, title, description, theme, imageUrl, authorId → User
- **ForumReply** — id, body, topicId → ForumTopic, authorId → User

Todas as relações 1:N estão implementadas com chave estrangeira e, nos casos de conteúdo dependente (Comment, ForumReply, MediaItem, Question, Option), com eliminação em cascata (`onDelete: Cascade`).

O campo `Content.isExclusive` implementa a categoria "Jindungo": o serviço `ContentService.applyExclusiveGate` decide, com base na presença de um utilizador autenticado no pedido, se devolve o objecto completo ou apenas um teaser (`body: null`, `mediaUrl: null`, `media: []`, `comments: []`, `locked: true`).

### 4.3 Diagramas UML

Os diagramas seguintes devem ser gerados a partir dos prompts fornecidos, usando um gerador de imagem (ex.: Gemini). **Estilo definido para todos os diagramas** (incluir sempre este bloco no início de cada prompt, para consistência visual entre todos os diagramas do relatório):

> **Estilo visual EconAO:** clean, flat, professional UML diagram, white background, minimal shadows, rounded-corner rectangles for classes/entities, bordeaux (#7A1F2B) headers/borders for primary elements, warm grey (#6B7280) for secondary elements and connector lines, cream/off-white (#F7F5F4) fills, clear sans-serif typography (Inter or similar geometric sans), generous white space, no gradients, no 3D effects, standard UML notation, high resolution, presentation-ready.

#### 4.3.1 Diagrama de Casos de Uso

**Actores:** Visitante, Utilizador (USER), Administrador (ADMIN) — nota: Administrador herda todas as ações de Utilizador.

**Prompt para o Gemini:**
```
Generate a UML Use Case Diagram for an educational web/mobile platform called "EconAO".

[Insert the "Estilo visual EconAO" style block here]

Actors (left side, stick figures):
- Visitante (Guest, not authenticated)
- Utilizador (Authenticated User) — extends/inherits from Visitante
- Administrador (Admin) — extends/inherits from Utilizador

Use cases (ellipses, grouped inside a system boundary box labeled "EconAO"):
Connected to Visitante: "Consultar Conteúdos", "Consultar Quizzes", "Consultar Fórum", "Pesquisar na Plataforma", "Ver Perfil Público", "Registar Conta", "Iniciar Sessão", "Recuperar Senha"
Connected to Utilizador: "Comentar Conteúdo", "Editar/Eliminar Próprio Comentário", "Submeter Tentativa de Quiz", "Ver Ranking do Quiz", "Criar Tópico de Fórum", "Responder a Tópico", "Editar/Eliminar Próprio Tópico ou Resposta", "Atualizar Perfil (nome, email, senha, avatar)", "Ver Conteúdo Jindungo (exclusivo)"
Connected to Administrador: "Gerir Conteúdos (CRUD)", "Marcar Conteúdo como Jindungo", "Gerir Quizzes (CRUD)", "Editar/Eliminar Qualquer Comentário ou Tópico", "Aceder ao Painel de Gestão"

Use inheritance arrows (hollow triangle, dashed) from Administrador to Utilizador, and from Utilizador to Visitante, to show role hierarchy.
Layout: actors on the left in a vertical line, use cases inside the system boundary on the right, grouped logically with association lines (plain lines) from each actor to their use cases.
```

#### 4.3.2 Diagrama de Classes

**Prompt para o Gemini:**
```
Generate a UML Class Diagram based on this data model (Prisma schema translated to UML classes).

[Insert the "Estilo visual EconAO" style block here]

Classes with attributes and types:
- User: id: Int, name: String, email: String, password: String, role: Role, avatarUrl: String?, resetPasswordToken: String?, resetPasswordExpiresAt: DateTime?, createdAt: DateTime
- Content: id: Int, type: ContentType, title: String, body: String, mediaUrl: String?, imageUrl: String?, theme: String, region: String?, isExclusive: Boolean, createdAt: DateTime
- MediaItem: id: Int, url: String, type: String, order: Int, createdAt: DateTime
- Comment: id: Int, body: String, createdAt: DateTime
- Quiz: id: Int, title: String, imageUrl: String?, createdAt: DateTime
- Question: id: Int, text: String, order: Int
- Option: id: Int, text: String, isCorrect: Boolean
- QuizAttempt: id: Int, score: Int, createdAt: DateTime
- ForumTopic: id: Int, title: String, description: String, theme: String?, imageUrl: String?, createdAt: DateTime
- ForumReply: id: Int, body: String, createdAt: DateTime

Enums (shown as small stereotype boxes «enumeration»):
- Role: ADMIN, USER
- ContentType: VIDEO, TEXT, PODCAST

Relationships (with cardinality labels):
- User "1" -- "0..*" Content (authored by)
- User "1" -- "0..*" Comment (authored by)
- User "1" -- "0..*" QuizAttempt (attempted by)
- User "1" -- "0..*" ForumTopic (authored by)
- User "1" -- "0..*" ForumReply (authored by)
- Content "1" -- "0..*" Comment (composition, filled diamond, cascade delete)
- Content "1" -- "0..*" MediaItem (composition, filled diamond, cascade delete)
- ForumTopic "1" -- "0..*" MediaItem (composition, filled diamond, cascade delete)
- Quiz "1" -- "1..*" Question (composition, filled diamond, cascade delete)
- Question "1" -- "2..*" Option (composition, filled diamond, cascade delete)
- Quiz "1" -- "0..*" QuizAttempt
- ForumTopic "1" -- "0..*" ForumReply (composition, filled diamond, cascade delete)

Layout: User class centered/top since it relates to most other classes; group Quiz/Question/Option together on one side, Content/MediaItem/Comment together, ForumTopic/ForumReply together.
```

#### 4.3.3 Diagrama de Sequência — Submissão de Quiz

**Prompt para o Gemini:**
```
Generate a UML Sequence Diagram for the flow "Submeter Tentativa de Quiz" (Submit Quiz Attempt).

[Insert the "Estilo visual EconAO" style block here]

Participants (left to right, as vertical lifelines with headers):
Utilizador (actor) | App (Web/Mobile) | API (Express) | AuthMiddleware | QuizService | PostgreSQL (Prisma)

Messages in order:
1. Utilizador -> App: responde a cada pergunta (uma por ecrã) e clica "Confirmar respostas" na última
2. App -> API: POST /quizzes/{id}/attempts (Authorization: Bearer token, body: answers[])
3. API -> AuthMiddleware: valida token JWT
4. AuthMiddleware --> API: utilizador autenticado (req.user)
5. API -> QuizService: submitAttempt(quizId, userId, answers)
6. QuizService -> PostgreSQL: SELECT quiz WITH questions, options (incl. isCorrect)
7. PostgreSQL --> QuizService: dados do quiz
8. QuizService -> QuizService: calcula score comparando answers com isCorrect (self-message, note: "cálculo sempre no servidor")
9. QuizService -> PostgreSQL: INSERT QuizAttempt(score)
10. QuizService -> PostgreSQL: COUNT QuizAttempt WHERE userId, quizId (número de tentativas)
11. PostgreSQL --> QuizService: attempt criado + contagem
12. QuizService --> API: { score, total, feedback, attempts }
13. API --> App: 201 Created (JSON: score, feedback, attempts)
14. App -> API: GET /quizzes/{id}/ranking
15. API -> QuizService: getRanking(quizId) — agrupa por utilizador, melhor pontuação menos penalização por repetição
16. QuizService --> API: ranking (top 10, sem duplicados)
17. API --> App: 200 OK (ranking)
18. App --> Utilizador: mostra resultado, revisão pergunta a pergunta e ranking atualizado

Use standard sequence diagram notation: solid arrows for synchronous calls, dashed arrows for returns, activation bars on each lifeline while processing.
```

#### 4.3.4 Diagrama de Arquitectura / Componentes

**Prompt para o Gemini:**
```
Generate a UML Component/Deployment-style architecture diagram for a 3-tier system called "EconAO".

[Insert the "Estilo visual EconAO" style block here]

Top row (two boxes side by side, labeled "Clientes"):
- "Web (React SPA)" — small icons/labels: Painel Público, Pesquisa Global, Painel de Gestão (Admin)
- "Mobile (Expo / React Native)" — small icon of a phone

Both top boxes connect downward with arrows labeled "REST API (JSON, Bearer JWT opcional/obrigatório)" to:

Middle box: "Backend — Node.js + Express" containing smaller internal labeled sub-boxes stacked vertically: "Routes", "Middlewares (authenticate, optionalAuthenticate, authorize, validate)", "Controllers", "Services", "Prisma ORM"

Bottom row (two boxes side by side), connected from the Backend box with two separate arrows:
- Arrow labeled "SQL (Prisma)" pointing to a database cylinder icon labeled "NeonDB — PostgreSQL (serverless)"
- Arrow labeled "S3 API (PutObject)" pointing to a storage bucket icon labeled "Cloudflare R2 (media: images/, videos/)"

Also show a small external box "SMTP (Gmail)" connected from the Backend box with an arrow labeled "Nodemailer (recuperação de senha)".

Layout: clean layered/tiered diagram, top-to-bottom data flow, clear labeled arrows, group related icons.
```

### 4.4 Design Visual

O sistema de design foi revisto para um estilo inspirado no Jira: tipografia mais forte e compacta, botões em pill (`border-radius: 999px`), fundo branco puro e uma navbar com pesquisa global — mantendo a cor de marca (bordô) e a identidade angolana.

| Elemento | Valor |
|---|---|
| Cor primária (bordeaux) | `#7A1F2B` |
| Cor primária (hover/dark) | `#5C1620` |
| Cor secundária (cinza) | `#6B7280` |
| Fundo | `#FFFFFF` (branco puro, igual no web e no mobile) |
| Tipografia | Inter (pesos 400 a 900), títulos a 800/900 com letter-spacing negativo |
| Botões | Pill (`border-radius: 999px`); botão de texto (`.btn-link`) para ações secundárias como "Entrar" |
| Ícone/logo | Letra "E" combinada com silhueta do mapa de Angola e símbolo do Kwanza |
| Ícones de interface | `lucide-react` (web) / `@expo/vector-icons` (mobile) — sem emojis |
| Cards de conteúdo | Foto de fundo escurecida por gradiente, texto e botão sobrepostos, sem rodapé branco |
| Selo "Jindungo" | Chip laranja (`#e8590c`) com ícone de chama, para conteúdo exclusivo |

---

## 5. Organização da Estrutura de Pastas do Projeto

```
economia/
├── docs/                          Documentação do projecto
├── backend/                       API REST (Node.js + Express + Prisma)
│   ├── server.js                  Entry point Express
│   ├── docs/swagger.js            Configuração OpenAPI/Swagger
│   ├── prisma/
│   │   ├── seed.js                Dados de exemplo (idempotente)
│   │   └── migrations/            Histórico de migrações versionado
│   └── src/
│       ├── prisma/schema.prisma   Modelo de dados (10 entidades)
│       ├── routes/                Definição de endpoints por domínio (auth, user, content, quiz, forum, search, upload)
│       ├── controllers/           Tratamento de request/response
│       ├── services/               Regras de negócio + acesso a dados (inclui gate de conteúdo Jindungo e ranking de quiz)
│       ├── middlewares/           authenticate, optionalAuthenticate, authorize, validate, upload
│       ├── schemas/               Validação de payloads (Zod)
│       └── lib/                   Clientes partilhados (prisma, r2, mail)
├── frontend/                      Aplicação web (React)
│   └── src/
│       ├── api/                   Clientes HTTP por domínio (auth, content, quiz, forum, search, users, upload)
│       ├── components/            Componentes reutilizáveis (Avatar, Skeleton, BackButton, CommentItem, MediaGallery, ContentCard, AppShell, AuthLayout)
│       ├── context/                AuthContext (sessão)
│       └── pages/                 Explorar, Quiz, Fórum, Pesquisa, Perfil próprio, Perfil público, admin/ (backoffice)
└── mobile/                        Aplicação móvel (Expo)
    ├── app/                       Rotas (Expo Router — file-based)
    │   ├── (tabs)/                Explorar, Quiz, Fórum, Perfil
    │   ├── content/[id].tsx       Detalhe de conteúdo
    │   ├── quiz/[id].tsx          Jogar quiz
    │   └── forum/[id].tsx         Tópico de fórum
    ├── components/                Componentes de UI reutilizáveis
    ├── contexts/                  AuthContext, SettingsContext (tema claro por omissão)
    └── services/                  Clientes HTTP por domínio
```

---

## 6. Implementação

### 6.1 Stack Tecnológico

| Camada | Tecnologia | Versão principal |
|---|---|---|
| Runtime | Node.js | — |
| Backend framework | Express | 5.x |
| ORM | Prisma | 7.x (com `@prisma/adapter-pg`) |
| Base de dados | PostgreSQL (NeonDB) | — |
| Validação | Zod | 4.x |
| Autenticação | jsonwebtoken + bcrypt | — |
| Email | Nodemailer | — |
| Storage | @aws-sdk/client-s3 (Cloudflare R2) | 3.x |
| Upload no servidor | Multer (memory storage) | 2.x |
| Web | React + react-router-dom | 19.x |
| Ícones (web) | lucide-react | — |
| Mobile | Expo / React Native / Expo Router | SDK 54 |

### 6.2 Autenticação e Autorização

A autenticação é feita por **JWT** (`jsonwebtoken`), com payload contendo `id`, `email` e `role`. Existem dois middlewares de autenticação:

- `authenticate` — exige um token válido; devolve 401 se ausente ou inválido. Usado em todas as rotas de escrita.
- `optionalAuthenticate` — nunca bloqueia o pedido; se houver um token válido define `req.user`, caso contrário segue como visitante anónimo. Usado nas rotas públicas que precisam de saber se o visitante tem conta (listagem/detalhe de Conteúdo e pesquisa global), para aplicar a regra de conteúdo "Jindungo".

O middleware `authorize(...roles)` restringe rotas a papéis específicos (ex.: `authorize('ADMIN')` nas rotas de gestão de Conteúdos e Quizzes). Para recursos que pertencem a um utilizador (comentários, respostas e tópicos de fórum), a autorização por posse (autor ou ADMIN) é validada ao nível do serviço, devolvendo 403 caso contrário.

As passwords são cifradas com `bcrypt` (custo 10) antes de gravadas. A alteração do próprio email ou senha (`PUT /auth/me`) exige a confirmação da senha atual (`currentPassword`); um email duplicado devolve 409.

A recuperação de senha gera um token aleatório (`crypto.randomBytes`), armazenado no próprio registo do utilizador com data de expiração (1 hora), e envia por email (Nodemailer/SMTP) um link para `FRONTEND_URL?reset_token=...`. Este padrão evita a necessidade de uma tabela dedicada a tokens, mantendo o modelo de dados simples sem comprometer a segurança (o token é de uso único e expira).

### 6.3 Módulos Implementados

| Módulo | Endpoints principais | Regras aplicadas |
|---|---|---|
| **Auth** | `POST /auth/register`, `POST /auth/login`, `GET/PUT /auth/me`, `POST /auth/forgot-password`, `POST /auth/reset-password` | Registo público sempre como USER; JWT; hash bcrypt; alteração de email/senha exige senha atual |
| **Users** | `GET /users/:id/public`, `POST/GET/PUT/DELETE /users` (ADMIN) | Perfil público sem dados sensíveis; gestão de utilizadores restrita a ADMIN |
| **Content** | `GET/POST /content`, `GET/PUT/DELETE /content/:id`, `GET/POST /content/:id/comments`, `PUT/DELETE /comments/:commentId` | Escrita de Content restrita a ADMIN; comentários exigem autenticação; edição/remoção de comentário restrita ao autor ou ADMIN; listagem/detalhe aplicam a regra de conteúdo Jindungo via `optionalAuthenticate` |
| **Quiz** | `GET/POST /quizzes`, `GET/PUT/DELETE /quizzes/:id`, `POST /quizzes/:id/attempts`, `GET /quizzes/:id/ranking` | Criação/edição/eliminação restritas a ADMIN (edição substitui por completo as perguntas/opções); correcção de tentativas sempre no servidor; opção correcta só é revelada a um ADMIN autenticado; ranking sem duplicados, com penalização por repetição, consultável sem ser preciso jogar |
| **Forum** | `GET/POST /forum/topics`, `GET/PUT/DELETE /forum/topics/:id`, `POST /forum/topics/:id/replies`, `PUT/DELETE /forum/replies/:replyId` | Criação de tópicos/respostas exige autenticação; edição/remoção de tópico ou resposta restrita ao autor ou ADMIN |
| **Search** | `GET /search?q=` | Pesquisa case-insensitive em Content, Quiz, ForumTopic e User; aplica a mesma regra de conteúdo Jindungo aos resultados de Content |
| **Upload** | `POST /uploads` (multipart/form-data) | Exige autenticação; proxy no servidor para o R2 (sem CORS necessário no cliente); suporta múltiplos ficheiros por galeria através de chamadas sucessivas |

### 6.4 Galeria de Media (MediaItem)

Além do par `imageUrl`/`mediaUrl` (capa e ficheiro principal), Conteúdos e Tópicos de Fórum podem ter uma **galeria** de fotos/vídeos/áudios adicionais, modelada pela entidade `MediaItem`. Ao criar ou editar um Conteúdo/Tópico, o cliente envia a lista completa de itens da galeria (`media: [{ url, type }]`); o serviço substitui a galeria inteira (`deleteMany` seguido de `create`), o que torna trivial remover um item individual no cliente (basta omiti-lo da lista enviada). A galeria é apresentada em scroll horizontal (`MediaGallery`), com um botão "×" por item quando em modo de edição.

### 6.5 Conteúdo Jindungo (Exclusivo)

Esta regra de negócio não constava do enunciado do professor nem dos documentos de referência originais — foi identificada como uma extensão natural da ideia de "Assinar conteúdos exclusivos" presente no protótipo original ("Estrutura Navegável", Slide 7). Foi implementada da seguinte forma:

- Um Conteúdo pode ser marcado como `isExclusive: true` pelo administrador.
- Nas rotas públicas de listagem, detalhe e pesquisa, o serviço aplica `applyExclusiveGate(content, isAuthenticated)`: se o conteúdo for exclusivo e o pedido não estiver autenticado, devolve apenas o teaser (título, tema, região, capa) com `body`, `mediaUrl`, `media` e `comments` vazios/nulos e a flag `locked: true`.
- No cliente, o card mostra sempre um selo "Jindungo"; ao abrir um conteúdo bloqueado, a página mostra um cartão de bloqueio ("Conteúdo Jindungo — entra ou regista-te para ver tudo") em vez do corpo/media/comentários.
- A barreira de acesso é simplesmente ter sessão iniciada (USER ou ADMIN) — não existe um nível de subscrição separado.

### 6.6 Pesquisa Global e Perfis Públicos

A pesquisa global (`GET /search?q=`) devolve resultados agrupados por Conteúdos, Quizzes, Tópicos de Fórum e Utilizadores, com correspondência case-insensitive (`contains`, `mode: insensitive`) nos campos textuais relevantes de cada entidade, limitada a 20 resultados por categoria. Os perfis públicos (`GET /users/:id/public`) devolvem apenas dados não sensíveis (nome, avatar, papel, data de adesão) e agregam os tópicos de fórum criados pelo utilizador e a sua melhor pontuação em cada quiz jogado — sem expor o email nem outros dados de conta.

### 6.7 Quiz: Uma Pergunta por Ecrã e Pontuação Anti-Repetição

O ecrã de jogo do quiz (`QuizPlay`) apresenta uma pergunta de cada vez, com barra de progresso, opções rotuladas A/B/C/D e navegação Anterior/Próxima — inspirado no formato "Quem Quer Ser Milionário". A submissão só é possível depois de responder a todas as perguntas.

O cálculo de ranking (`QuizService.getRanking`) resolve dois problemas identificados em teste: (1) a mesma pessoa aparecia várias vezes no ranking se jogasse o quiz mais de uma vez; (2) não havia qualquer penalização por tentar várias vezes até acertar tudo. A solução agrupa as tentativas por utilizador, guarda a melhor pontuação bruta (`bestScore`) e o número de tentativas (`attempts`), e calcula os pontos finais como `max(bestScore - (attempts - 1), 0)` — quem acerta tudo à primeira tentativa mantém a pontuação máxima; cada tentativa adicional desconta um ponto. O número de tentativas é sempre mostrado ao lado da pontuação, tanto no ranking como no ecrã de resultado do próprio jogador.

### 6.8 Armazenamento de Media

O upload de ficheiros segue um fluxo em **proxy pelo servidor**: o cliente (web ou mobile) envia o ficheiro em `multipart/form-data` para `POST /uploads`; o backend recebe-o em memória (Multer) e reenvia-o ao Cloudflare R2 via `PutObjectCommand` (SDK S3), devolvendo o URL público final. Esta escolha evita que o cliente comunique directamente com o R2 (o que exigiria configuração de CORS no bucket), centralizando a lógica de nomeação de ficheiros (`images/` vs `videos/`, conforme o tipo MIME) e a validação de autenticação num único ponto.

### 6.9 Envio de Emails

O envio de email (recuperação de senha) usa **Nodemailer** com um transportador SMTP configurado por variáveis de ambiente (`MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_ENCRYPTION`). O corpo do email é gerado em HTML inline, com o link de recuperação apontando para o frontend web (`FRONTEND_URL`).

---

## 7. Testes Realizados

Dado o prazo do projecto, os testes realizados até ao momento são **manuais e de verificação end-to-end**, cobrindo os fluxos críticos, executados num ambiente de preview isolado (portas dedicadas, sem afectar os servidores de desenvolvimento do autor):

| Fluxo testado | Método | Resultado |
|---|---|---|
| Registo e login de utilizador | Chamadas HTTP directas (curl) + interacção no browser | ✅ Token JWT emitido, sessão restaurada em recarregamento |
| Listagem e detalhe de Conteúdos, Quizzes, Fórum | Verificação via browser (dados reais da NeonDB) | ✅ Dados correctos, imagens/vídeo/áudio renderizados |
| Quiz — uma pergunta por ecrã, submissão e ranking | Interacção no browser (jogo completo, duas contas diferentes) | ✅ Progresso e navegação correctos; ranking sem duplicados; pontuação penalizada corretamente na 2ª tentativa (0 pontos vs. melhor tentativa alheia) |
| CRUD de Conteúdos e Quizzes (painel de gestão) | Interacção no browser como ADMIN | ✅ Criação, edição, remoção de capa/media e listagem confirmadas |
| Edição/remoção de comentários e tópicos de fórum | Chamadas HTTP directas com contas diferentes | ✅ Autor edita com sucesso (200); terceiro utilizador bloqueado (403); ADMIN sempre autorizado |
| Alteração de perfil próprio (nome, email, senha) | Chamadas HTTP directas + interacção no browser | ✅ Sem senha atual → 400; senha atual errada → 401; senha atual certa → 200; email duplicado → 409 |
| Conteúdo Jindungo (exclusivo) | Chamadas HTTP directas sem/com token, em listagem, detalhe e pesquisa | ✅ Sem sessão: teaser visível, `body`/`media`/comentários ocultos (`locked: true`); com sessão: conteúdo completo |
| Pesquisa global | Chamadas HTTP directas + interacção no browser | ✅ Resultados agrupados por Conteúdos/Quizzes/Fórum/Pessoas; conteúdo Jindungo não vaza o corpo na pesquisa |
| Perfil público de utilizador | Chamadas HTTP directas + interacção no browser | ✅ Nome, avatar, papel, data de adesão, tópicos e melhores pontuações corretos; email nunca exposto |
| Galeria de media (adicionar/remover fotos e vídeos) | Chamadas HTTP directas + interacção no browser | ✅ Substituição integral da galeria confirmada; remoção individual funcional em Conteúdo e Tópico de Fórum |
| Recuperação de senha | Execução directa do serviço + envio real de email | ✅ Email recebido, token validado, senha redefinida, novo login bem-sucedido |
| Upload de ficheiros (avatar, imagens, galeria) | Simulação de pedido multipart autenticado | ✅ Ficheiro processado e enviado ao R2 |
| Restrição de acesso por papel | Tentativa de acções ADMIN com utilizador USER | ✅ Erro 403 devolvido corretamente |
| Tolerância a suspensão da base de dados (cold start NeonDB) | Consultas repetidas após inactividade | ✅ Reconexão automática sem erro visível ao utilizador |
| Compilação TypeScript (mobile) | `tsc --noEmit` | ✅ Sem erros nos ficheiros do projecto |

Para além destes testes manuais, o projecto tem agora uma suite de testes automatizados
(backend: Vitest, unitários e de integração; frontend: Jest/React Testing Library) e um
pipeline de CI configurado no GitHub Actions, correndo a cada push — ver
[`docs/TESTES.md`](./TESTES.md) e [`docs/CI_CD.md`](./CI_CD.md) para detalhes.

---

## 8. Implantação

### 8.1 Repositório

Código-fonte disponível em: **[github.com/rsambing/econao](https://github.com/rsambing/econao)**, com histórico de commits reflectindo a evolução incremental do projecto (adaptação do scaffold inicial, módulos de domínio, upload de media, autenticação avançada, redesenho de interface, pesquisa global, perfis públicos, galeria de media, conteúdo Jindungo).

### 8.2 Ambiente de Execução

| Componente | Ambiente actual |
|---|---|
| Base de dados | NeonDB (PostgreSQL serverless, hospedado) |
| Object storage | Cloudflare R2 (hospedado) |
| Backend | Local (`npm run dev`, porta 3000) — pronto para deploy (configuração `vercel.json` incluída) |
| Web | Local (`npm start`, porta 3001) |
| Mobile | Expo Go (desenvolvimento) |

**URL do projecto hospedado:** _a definir — deploy do backend/web ainda não realizado; a NeonDB e o Cloudflare R2 já são serviços hospedados externos._

---

## 9. Conclusão

O EconAO cumpre e ultrapassa os requisitos centrais definidos para a fase actual do projecto: uma aplicação educativa com persistência real em base de dados relacional normalizada, autenticação e autorização por papéis (incluindo autorização por posse do recurso), três frentes de cliente (web público, backoffice de gestão, e aplicação móvel) consumindo uma única API REST, upload de media para object storage dedicado com suporte a galerias, pesquisa global multi-entidade, perfis públicos, recuperação de senha por email, e uma categoria de conteúdo exclusivo ("Jindungo") pensada para reforçar o valor de ter conta na plataforma. A arquitectura em camadas do backend, a autenticação opcional para regras de visibilidade condicional, e a partilha de modelo de dados entre clientes fornecem uma base sólida para a evolução do sistema. Os próximos passos identificados — diagramas UML formais (a produzir a partir dos prompts fornecidos), suite de testes automatizados, pipeline de CI/CD e deploy público — estão claramente delimitados e não colocam em causa a funcionalidade actual do sistema.

---

## 10. Referências Bibliográficas

- Prisma. _Prisma ORM Documentation._ Disponível em: https://www.prisma.io/docs
- Express.js. _Express — Node.js web application framework._ Disponível em: https://expressjs.com/
- Neon. _Neon Serverless Postgres Documentation._ Disponível em: https://neon.tech/docs
- Cloudflare. _R2 Object Storage Documentation._ Disponível em: https://developers.cloudflare.com/r2/
- Expo. _Expo Documentation._ Disponível em: https://docs.expo.dev/
- React. _React Documentation._ Disponível em: https://react.dev/
- JWT.io. _Introduction to JSON Web Tokens._ Disponível em: https://jwt.io/introduction
