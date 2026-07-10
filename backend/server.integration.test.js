import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './server.js';
import { AuthService } from './src/services/auth.service.js';

// Testes de integração contra a app Express real (rotas -> middlewares ->
// controladores), sem tocar na base de dados. Cobrem a fronteira onde a
// maioria dos erros de segurança/validação acontece: payload inválido,
// falta de autenticação e falta de autorização — tudo isto é resolvido
// antes de qualquer pedido chegar ao Prisma, por isso pode ser testado
// sem mocks nem base de dados real.

const authService = new AuthService();
const tokenUser = authService.generateToken({ id: 1, email: 'user@econao.ao', role: 'USER' });
const tokenAdmin = authService.generateToken({ id: 2, email: 'admin@econao.ao', role: 'ADMIN' });

describe('GET /', () => {
  it('responde com a mensagem de boas-vindas da API', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('EconAO');
  });
});

describe('POST /auth/register', () => {
  it('rejeita um registo com senha demasiado curta (400)', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ name: 'Teste', email: 'teste@econao.ao', password: '123' });

    expect(res.status).toBe(400);
  });

  it('rejeita um registo sem nome (400)', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'teste@econao.ao', password: 'senha123' });

    expect(res.status).toBe(400);
  });
});

describe('POST /auth/login', () => {
  it('rejeita um login sem password (400)', async () => {
    const res = await request(app).post('/auth/login').send({ email: 'a@a.ao' });
    expect(res.status).toBe(400);
  });
});

describe('Autenticação e autorização em rotas protegidas', () => {
  it('POST /content sem token devolve 401', async () => {
    const res = await request(app)
      .post('/content')
      .send({ type: 'TEXT', title: 'Título', body: 'Corpo válido', theme: 'Tema' });

    expect(res.status).toBe(401);
  });

  it('POST /content com um token inválido devolve 401', async () => {
    const res = await request(app)
      .post('/content')
      .set('Authorization', 'Bearer token-invalido')
      .send({ type: 'TEXT', title: 'Título', body: 'Corpo válido', theme: 'Tema' });

    expect(res.status).toBe(401);
  });

  it('POST /content com um utilizador USER (não ADMIN) devolve 403', async () => {
    const res = await request(app)
      .post('/content')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({ type: 'TEXT', title: 'Título', body: 'Corpo válido', theme: 'Tema' });

    expect(res.status).toBe(403);
  });

  it('POST /quizzes com um utilizador USER (não ADMIN) devolve 403', async () => {
    const res = await request(app)
      .post('/quizzes')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({ title: 'Quiz', questions: [] });

    expect(res.status).toBe(403);
  });

  it('POST /content/:id/comments sem token devolve 401 (comentar exige sessão)', async () => {
    const res = await request(app).post('/content/1/comments').send({ body: 'Comentário' });
    expect(res.status).toBe(401);
  });

  it('um token de ADMIN passa a autorização de rotas restritas a ADMIN (chega à validação do payload)', async () => {
    // Sem base de dados mockada, o pedido acaba por falhar mais à frente (schema),
    // mas o importante aqui é confirmar que NÃO fica preso em 401/403 — ou seja,
    // que authenticate + authorize aceitaram corretamente o papel ADMIN.
    const res = await request(app)
      .post('/quizzes')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ title: '' }); // payload inválido de propósito (sem perguntas)

    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(403);
    expect(res.status).toBe(400); // falha na validação do schema, não na autorização
  });
});

describe('GET /search', () => {
  it('sem termo de pesquisa devolve estrutura vazia sem tocar na base de dados', async () => {
    const res = await request(app).get('/search');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ query: '', content: [], quizzes: [], topics: [], users: [] });
  });
});
