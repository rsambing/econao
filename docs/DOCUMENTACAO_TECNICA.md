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

1. Disponibilizar conteúdos multimédia (vídeo, texto, podcast) sobre temas de história económica angolana, organizados por tema e região.
2. Implementar um sistema de quizzes interactivos com correcção automática, pontuação e ranking por quiz.
3. Implementar um fórum de discussão que permita a criação de tópicos e respostas entre utilizadores.
4. Permitir comentários em conteúdos publicados, promovendo participação e debate.
5. Implementar autenticação segura com dois níveis de acesso (ADMIN / USER) e recuperação de senha por email.
6. Disponibilizar um painel de gestão (backoffice) para administração de conteúdos e quizzes, distinto do painel público.
7. Suportar upload de imagens/vídeos/áudio associados a conteúdos, quizzes, tópicos de fórum e perfis de utilizador, com armazenamento em object storage dedicado.
8. Implementar a aplicação em três frentes tecnológicas coordenadas — API REST, aplicação web e aplicação móvel — partilhando o mesmo modelo de dados e regras de negócio.

### 1.3 Visão Geral do Projecto

O EconAO é composto por três aplicações independentes que comunicam através de uma única API REST:

- **Backend** (`backend/`) — API REST em Node.js/Express, persistência em PostgreSQL (NeonDB, serverless) via Prisma ORM, autenticação JWT, envio de email (recuperação de senha) e armazenamento de media em Cloudflare R2.
- **Web** (`frontend/`) — Aplicação React (Create React App) com painel público (Explorar, Quiz, Fórum, Perfil) e painel de gestão/backoffice (`/admin`, `/admin` Quiz) restrito a administradores.
- **Mobile** (`mobile/`) — Aplicação React Native com Expo Router, espelhando os fluxos públicos do painel web (autenticação, exploração de conteúdos, quiz, fórum, perfil).

Ao contrário de um protótipo estático, o EconAO implementa persistência real em base de dados relacional, autenticação e autorização por perfil, upload de ficheiros para object storage, e três clientes (web público, backoffice, mobile) sobre a mesma API — cumprindo os requisitos de arquitectura em camadas, modelação de dados normalizada e separação entre painel público e painel de gestão exigidos pelo enunciado do projecto.

---

## 2. Requisitos

### 2.1 Requisitos Funcionais

| ID | Descrição |
|---|---|
| RF-01 | O sistema deve permitir o registo público de novos utilizadores (nome, email, senha), atribuindo automaticamente o papel USER. |
| RF-02 | O sistema deve permitir autenticação por email e senha, devolvendo um token JWT. |
| RF-03 | O sistema deve permitir a um utilizador autenticado consultar e atualizar o seu próprio perfil (nome, foto de perfil). |
| RF-04 | O sistema deve permitir a recuperação de senha através do envio de um link por email, válido por tempo limitado. |
| RF-05 | O sistema deve permitir a um administrador criar, editar, listar e eliminar conteúdos (vídeo, texto ou podcast). |
| RF-06 | O sistema deve permitir a qualquer visitante listar e consultar conteúdos publicados, filtrados por tipo e tema. |
| RF-07 | O sistema deve permitir a um utilizador autenticado comentar um conteúdo. |
| RF-08 | O sistema deve permitir a um administrador criar um quiz com múltiplas perguntas e opções de resposta, identificando a opção correcta. |
| RF-09 | O sistema deve permitir a qualquer visitante consultar os quizzes disponíveis e as respectivas perguntas, sem revelar a resposta correcta antes da submissão. |
| RF-10 | O sistema deve permitir a um utilizador autenticado submeter respostas a um quiz, calculando automaticamente a pontuação obtida. |
| RF-11 | O sistema deve calcular e apresentar um ranking (top 10) por quiz, ordenado por pontuação. |
| RF-12 | O sistema deve permitir a qualquer utilizador autenticado criar um tópico de fórum, com título, descrição e imagem opcional. |
| RF-13 | O sistema deve permitir a qualquer utilizador autenticado responder a um tópico de fórum existente. |
| RF-14 | O sistema deve permitir o upload de ficheiros (imagem, vídeo, áudio) associados a conteúdos, quizzes, tópicos de fórum e avatares de utilizador. |
| RF-15 | O sistema deve atribuir um avatar por defeito (iniciais do nome) a utilizadores sem foto de perfil definida. |
| RF-16 | O sistema deve disponibilizar um painel de gestão (backoffice), acessível apenas a administradores, distinto do painel público. |
| RF-17 | O sistema deve disponibilizar as mesmas funcionalidades de consulta pública (conteúdos, quiz, fórum) na aplicação móvel. |

### 2.2 Requisitos Não Funcionais

| ID | Descrição |
|---|---|
| RNF-01 | As passwords devem ser armazenadas com hash (bcrypt), nunca em texto simples. |
| RNF-02 | O acesso a operações de escrita deve exigir autenticação via token JWT, validado em middleware dedicado. |
| RNF-03 | Operações de gestão de conteúdos e quizzes devem estar restritas ao papel ADMIN, validado em middleware de autorização por papel. |
| RNF-04 | A ligação à base de dados deve reciclar ligações inactivas (idle) rapidamente, para tolerar a suspensão automática da instância serverless (NeonDB) sem falhas visíveis ao utilizador. |
| RNF-05 | O upload de ficheiros deve ser processado no servidor (proxy), sem exigir configuração de CORS em serviços de terceiros (object storage). |
| RNF-06 | O sistema deve ser modular, com separação clara entre camadas de rota, controlador, serviço e acesso a dados (arquitectura em camadas) no backend. |
| RNF-07 | O modelo de dados deve ser relacional e normalizado, com integridade referencial garantida por chaves estrangeiras e eliminação em cascata onde aplicável. |
| RNF-08 | A interface deve ser responsiva, adaptando-se a ecrãs desktop, tablet e mobile na aplicação web. |
| RNF-09 | O sistema deve fornecer feedback visual de carregamento (skeleton screens) em vez de bloquear a interface durante pedidos assíncronos. |
| RNF-10 | O código-fonte deve estar sob controlo de versão (Git/GitHub), com histórico de commits coerente com as alterações realizadas. |
| RNF-11 | As credenciais e segredos (base de dados, JWT, SMTP, object storage) devem ser geridos por variáveis de ambiente, nunca incluídos no controlo de versão. |
| RNF-12 | A aplicação móvel e a aplicação web devem consumir a mesma API, sem duplicação de regras de negócio no cliente.

### 2.3 Regras de Negócio

| ID | Descrição |
|---|---|
| RN-01 | Apenas utilizadores com papel ADMIN podem criar, editar ou eliminar Conteúdos e Quizzes. |
| RN-02 | Qualquer utilizador autenticado (USER ou ADMIN) pode comentar Conteúdos, criar Tópicos de Fórum e responder a Tópicos. |
| RN-03 | O registo público de utilizadores atribui sempre o papel USER; o papel ADMIN só pode ser atribuído por outro administrador através da gestão de utilizadores. |
| RN-04 | Um quiz só pode ser criado com pelo menos uma pergunta, e cada pergunta com pelo menos duas opções, sendo obrigatória a marcação de uma opção correcta. |
| RN-05 | A resposta correcta de uma pergunta de quiz nunca é devolvida ao cliente antes da submissão da tentativa. |
| RN-06 | A pontuação de uma tentativa de quiz é calculada no servidor, comparando as respostas submetidas com as opções marcadas como correctas — nunca confiando em cálculo feito no cliente. |
| RN-07 | O ranking de um quiz apresenta as 10 melhores tentativas, ordenadas por pontuação decrescente e, em caso de empate, pela tentativa mais antiga. |
| RN-08 | O token de recuperação de senha expira 1 hora após a sua geração e é invalidado (removido) após uma redefinição bem-sucedida. |
| RN-09 | O pedido de recuperação de senha nunca revela se um determinado email está ou não registado no sistema (resposta genérica). |
| RN-10 | A eliminação de um Conteúdo ou Tópico de Fórum elimina em cascata os respectivos Comentários e Respostas associados. |
| RN-11 | Ficheiros enviados por upload são organizados em `images/` ou `videos/` no object storage, consoante o tipo MIME do ficheiro. |
| RN-12 | Um utilizador sem `avatarUrl` definido é representado, em todos os clientes (web e mobile), por um círculo com as suas iniciais — nunca por um espaço vazio. |

---

## 3. Perfis de Utilizador

| Perfil | Descrição | Permissões |
|---|---|---|
| **Visitante (não autenticado)** | Qualquer pessoa que aceda à aplicação web ou móvel sem sessão iniciada. | Consultar conteúdos, quizzes (sem submeter) e tópicos de fórum (sem responder). Pode registar-se ou iniciar sessão. |
| **Utilizador (USER)** | Estudante ou membro da comunidade registado na plataforma. | Todas as permissões de Visitante, mais: comentar conteúdos, submeter tentativas de quiz, criar tópicos e responder no fórum, atualizar o próprio perfil (nome, avatar). |
| **Administrador (ADMIN)** | Gestor de conteúdo pedagógico da plataforma (ex.: docente, equipa editorial). | Todas as permissões de Utilizador, mais: criar/editar/eliminar Conteúdos e Quizzes, aceder ao painel de gestão (`/admin`, `/admin` Quiz). |

> Nota para a versão final do relatório em `.docx`: incluir nesta secção uma tabela com fotografias/avatares representativos de cada perfil (capturas de ecrã do avatar por defeito e de um avatar carregado), e uma breve jornada de utilizador (user journey) ilustrada para o perfil Visitante → Utilizador → submissão de quiz.

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
| API | Node.js + Express 5 | Arquitectura em camadas (rotas → controladores → serviços → Prisma), validação com Zod, autenticação JWT. |
| Autenticação | JWT + bcrypt | Stateless, adequado a múltiplos clientes (web + mobile) sem sessão partilhada. |
| Email | Nodemailer (SMTP) | Envio do link de recuperação de senha. |
| Object Storage | Cloudflare R2 (API compatível S3) | Armazenamento de imagens/vídeos/áudio; upload em proxy pelo backend (sem exigir CORS no bucket). |
| Web | React 19 (CRA) | Componentização, SPA leve, sem necessidade de SSR para este caso de uso. |
| Mobile | Expo + Expo Router + React Native | Desenvolvimento e testes rápidos (Expo Go), routing por ficheiros, partilha de padrões com a web. |

### 4.2 Modelo de Dados

O modelo de dados é composto por 8 entidades principais, todas geridas via Prisma:

- **User** — id, name, email (único), password (hash), role (ADMIN/USER), avatarUrl, resetPasswordToken, resetPasswordExpiresAt, createdAt
- **Content** — id, type (VIDEO/TEXT/PODCAST), title, body, mediaUrl, theme, region, authorId → User
- **Comment** — id, body, contentId → Content, authorId → User
- **Quiz** — id, title, imageUrl
- **Question** — id, text, order, quizId → Quiz
- **Option** — id, text, isCorrect, questionId → Question
- **QuizAttempt** — id, score, userId → User, quizId → Quiz
- **ForumTopic** — id, title, description, theme, imageUrl, authorId → User
- **ForumReply** — id, body, topicId → ForumTopic, authorId → User

Todas as relações 1:N estão implementadas com chave estrangeira e, nos casos de conteúdo dependente (Comment, ForumReply, Question, Option), com eliminação em cascata (`onDelete: Cascade`).

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
Connected to Visitante: "Consultar Conteúdos", "Consultar Quizzes", "Consultar Fórum", "Registar Conta", "Iniciar Sessão", "Recuperar Senha"
Connected to Utilizador: "Comentar Conteúdo", "Submeter Tentativa de Quiz", "Ver Ranking do Quiz", "Criar Tópico de Fórum", "Responder a Tópico", "Atualizar Perfil"
Connected to Administrador: "Gerir Conteúdos (CRUD)", "Gerir Quizzes (CRUD)", "Aceder ao Painel de Gestão"

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
- Content: id: Int, type: ContentType, title: String, body: String, mediaUrl: String?, theme: String, region: String?, createdAt: DateTime
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
- Quiz "1" -- "1..*" Question (composition, filled diamond, cascade delete)
- Question "1" -- "2..*" Option (composition, filled diamond, cascade delete)
- Quiz "1" -- "0..*" QuizAttempt
- ForumTopic "1" -- "0..*" ForumReply (composition, filled diamond, cascade delete)

Layout: User class centered/top since it relates to most other classes; group Quiz/Question/Option together on one side, Content/Comment together, ForumTopic/ForumReply together.
```

#### 4.3.3 Diagrama de Sequência — Submissão de Quiz

**Prompt para o Gemini:**
```
Generate a UML Sequence Diagram for the flow "Submeter Tentativa de Quiz" (Submit Quiz Attempt).

[Insert the "Estilo visual EconAO" style block here]

Participants (left to right, as vertical lifelines with headers):
Utilizador (actor) | App (Web/Mobile) | API (Express) | AuthMiddleware | QuizService | PostgreSQL (Prisma)

Messages in order:
1. Utilizador -> App: seleciona respostas e clica "Confirmar respostas"
2. App -> API: POST /quizzes/{id}/attempts (Authorization: Bearer token, body: answers[])
3. API -> AuthMiddleware: valida token JWT
4. AuthMiddleware --> API: utilizador autenticado (req.user)
5. API -> QuizService: submitAttempt(quizId, userId, answers)
6. QuizService -> PostgreSQL: SELECT quiz WITH questions, options (incl. isCorrect)
7. PostgreSQL --> QuizService: dados do quiz
8. QuizService -> QuizService: calcula score comparando answers com isCorrect (self-message, note: "cálculo sempre no servidor")
9. QuizService -> PostgreSQL: INSERT QuizAttempt(score)
10. PostgreSQL --> QuizService: attempt criado
11. QuizService --> API: { score, total, feedback }
12. API --> App: 201 Created (JSON: score, feedback)
13. App -> App: pede ranking (GET /quizzes/{id}/ranking)
14. App --> Utilizador: mostra resultado e ranking atualizado

Use standard sequence diagram notation: solid arrows for synchronous calls, dashed arrows for returns, activation bars on each lifeline while processing.
```

#### 4.3.4 Diagrama de Arquitectura / Componentes

**Prompt para o Gemini:**
```
Generate a UML Component/Deployment-style architecture diagram for a 3-tier system called "EconAO".

[Insert the "Estilo visual EconAO" style block here]

Top row (two boxes side by side, labeled "Clientes"):
- "Web (React SPA)" — small icons/labels: Painel Público, Painel de Gestão (Admin)
- "Mobile (Expo / React Native)" — small icon of a phone

Both top boxes connect downward with arrows labeled "REST API (JSON, Bearer JWT)" to:

Middle box: "Backend — Node.js + Express" containing smaller internal labeled sub-boxes stacked vertically: "Routes", "Middlewares (auth, validate)", "Controllers", "Services", "Prisma ORM"

Bottom row (two boxes side by side), connected from the Backend box with two separate arrows:
- Arrow labeled "SQL (Prisma)" pointing to a database cylinder icon labeled "NeonDB — PostgreSQL (serverless)"
- Arrow labeled "S3 API (PutObject)" pointing to a storage bucket icon labeled "Cloudflare R2 (media: images/, videos/)"

Also show a small external box "SMTP (Gmail)" connected from the Backend box with an arrow labeled "Nodemailer (recuperação de senha)".

Layout: clean layered/tiered diagram, top-to-bottom data flow, clear labeled arrows, group related icons.
```

### 4.4 Design Visual

| Elemento | Valor |
|---|---|
| Cor primária (bordeaux) | `#7A1F2B` |
| Cor primária (hover/dark) | `#5C1620` |
| Cor secundária (cinza) | `#6B7280` |
| Fundo | `#F7F5F4` |
| Tipografia | Inter (sans-serif geométrica) |
| Ícone/logo | Letra "E" combinada com silhueta do mapa de Angola e símbolo do Kwanza |

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
│       ├── prisma/schema.prisma   Modelo de dados
│       ├── routes/                Definição de endpoints por domínio
│       ├── controllers/           Tratamento de request/response
│       ├── services/               Regras de negócio + acesso a dados
│       ├── middlewares/           authenticate, authorize, validate, upload
│       ├── schemas/               Validação de payloads (Zod)
│       └── lib/                   Clientes partilhados (prisma, r2, mail)
├── frontend/                      Aplicação web (React)
│   └── src/
│       ├── api/                   Clientes HTTP por domínio
│       ├── components/            Componentes reutilizáveis (Avatar, Skeleton)
│       ├── context/                AuthContext (sessão)
│       └── pages/                 Páginas públicas + pages/admin (backoffice)
└── mobile/                        Aplicação móvel (Expo)
    ├── app/                       Rotas (Expo Router — file-based)
    │   ├── (tabs)/                Explorar, Quiz, Fórum, Perfil
    │   ├── content/[id].tsx       Detalhe de conteúdo
    │   ├── quiz/[id].tsx          Jogar quiz
    │   └── forum/[id].tsx         Tópico de fórum
    ├── components/                Componentes de UI reutilizáveis
    ├── contexts/                  AuthContext, SettingsContext
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
| Web | React | 19.x |
| Mobile | Expo / React Native / Expo Router | SDK 54 |

### 6.2 Autenticação e Autorização

A autenticação é feita por **JWT** (`jsonwebtoken`), com payload contendo `id`, `email` e `role`. O middleware `authenticate` valida o token no cabeçalho `Authorization: Bearer <token>`; o middleware `authorize(...roles)` restringe rotas a papéis específicos (ex.: `authorize('ADMIN')` nas rotas de gestão de Conteúdos e Quizzes). As passwords são cifradas com `bcrypt` (custo 10) antes de gravadas.

A recuperação de senha gera um token aleatório (`crypto.randomBytes`), armazenado no próprio registo do utilizador com data de expiração (1 hora), e envia por email (Nodemailer/SMTP) um link para `FRONTEND_URL?reset_token=...`. Este padrão evita a necessidade de uma tabela dedicada a tokens, mantendo o modelo de dados simples sem comprometer a segurança (o token é de uso único e expira).

### 6.3 Módulos Implementados

| Módulo | Endpoints principais | Regras aplicadas |
|---|---|---|
| **Auth** | `POST /auth/register`, `POST /auth/login`, `GET/PUT /auth/me`, `POST /auth/forgot-password`, `POST /auth/reset-password` | Registo público sempre como USER; JWT; hash bcrypt |
| **Content** | `GET/POST /content`, `GET/PUT/DELETE /content/:id`, `GET/POST /content/:id/comments` | Escrita de Content restrita a ADMIN; comentários exigem autenticação |
| **Quiz** | `GET/POST /quizzes`, `GET /quizzes/:id`, `POST /quizzes/:id/attempts`, `GET /quizzes/:id/ranking` | Criação restrita a ADMIN; correcção de tentativas sempre no servidor |
| **Forum** | `GET/POST /forum/topics`, `GET /forum/topics/:id`, `POST /forum/topics/:id/replies` | Criação de tópicos/respostas exige autenticação (qualquer papel) |
| **Upload** | `POST /uploads` (multipart/form-data) | Exige autenticação; proxy no servidor para o R2 (sem CORS necessário no cliente) |

### 6.4 Armazenamento de Media

O upload de ficheiros segue um fluxo em **proxy pelo servidor**: o cliente (web ou mobile) envia o ficheiro em `multipart/form-data` para `POST /uploads`; o backend recebe-o em memória (Multer) e reenvia-o ao Cloudflare R2 via `PutObjectCommand` (SDK S3), devolvendo o URL público final. Esta escolha evita que o cliente comunique directamente com o R2 (o que exigiria configuração de CORS no bucket), centralizando a lógica de nomeação de ficheiros (`images/` vs `videos/`, conforme o tipo MIME) e a validação de autenticação num único ponto.

### 6.5 Envio de Emails

O envio de email (recuperação de senha) usa **Nodemailer** com um transportador SMTP configurado por variáveis de ambiente (`MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_ENCRYPTION`). O corpo do email é gerado em HTML inline, com o link de recuperação apontando para o frontend web (`FRONTEND_URL`).

---

## 7. Testes Realizados

Dado o prazo do projecto, os testes realizados até ao momento são **manuais e de verificação end-to-end**, cobrindo os fluxos críticos:

| Fluxo testado | Método | Resultado |
|---|---|---|
| Registo e login de utilizador | Chamadas HTTP directas (curl) + interacção no browser | ✅ Token JWT emitido, sessão restaurada em recarregamento |
| Listagem e detalhe de Conteúdos, Quizzes, Fórum | Verificação via browser (dados reais da NeonDB) | ✅ Dados correctos, imagens/vídeo/áudio renderizados |
| Submissão de tentativa de quiz + ranking | Interacção no browser (selecção de respostas, submissão) | ✅ Pontuação correcta, ranking actualizado |
| CRUD de Conteúdos e Quizzes (painel de gestão) | Interacção no browser como ADMIN | ✅ Criação, edição e listagem confirmadas |
| Recuperação de senha | Execução directa do serviço + envio real de email | ✅ Email recebido, token validado, senha redefinida, novo login bem-sucedido |
| Upload de ficheiros (avatar, imagens) | Simulação de pedido multipart autenticado | ✅ Ficheiro processado e enviado ao R2 |
| Restrição de acesso por papel | Tentativa de acções ADMIN com utilizador USER | ✅ Erro 403 devolvido corretamente |
| Tolerância a suspensão da base de dados (cold start NeonDB) | Consultas repetidas após inactividade | ✅ Reconexão automática sem erro visível ao utilizador |
| Compilação TypeScript (mobile) | `tsc --noEmit` | ✅ Sem erros nos ficheiros do projecto |

**Limitações actuais (por concluir):** não existe ainda uma suite de testes automatizados (unitários/integração) nem pipeline de CI/CD configurado — trabalho previsto como próximo passo, fora do período coberto por este relatório.

---

## 8. Implantação

### 8.1 Repositório

Código-fonte disponível em: **[github.com/rsambing/econao](https://github.com/rsambing/econao)**, com histórico de commits reflectindo a evolução incremental do projecto (adaptação do scaffold inicial, módulos de domínio, upload de media, autenticação avançada).

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

O EconAO cumpre os requisitos centrais definidos para a fase actual do projecto: uma aplicação educativa com persistência real em base de dados relacional normalizada, autenticação e autorização por papéis, três frentes de cliente (web público, backoffice de gestão, e aplicação móvel) consumindo uma única API REST, upload de media para object storage dedicado, e recuperação de senha por email. A arquitectura em camadas do backend e a partilha de modelo de dados entre clientes fornecem uma base sólida para a evolução do sistema. Os próximos passos identificados — diagramas UML formais (a produzir a partir dos prompts fornecidos), suite de testes automatizados, pipeline de CI/CD e deploy público — estão claramente delimitados e não colocam em causa a funcionalidade actual do sistema.

---

## 10. Referências Bibliográficas

- Prisma. _Prisma ORM Documentation._ Disponível em: https://www.prisma.io/docs
- Express.js. _Express — Node.js web application framework._ Disponível em: https://expressjs.com/
- Neon. _Neon Serverless Postgres Documentation._ Disponível em: https://neon.tech/docs
- Cloudflare. _R2 Object Storage Documentation._ Disponível em: https://developers.cloudflare.com/r2/
- Expo. _Expo Documentation._ Disponível em: https://docs.expo.dev/
- React. _React Documentation._ Disponível em: https://react.dev/
- JWT.io. _Introduction to JSON Web Tokens._ Disponível em: https://jwt.io/introduction
