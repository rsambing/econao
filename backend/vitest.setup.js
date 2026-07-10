// Variáveis de ambiente mínimas para os testes correrem isolados,
// sem depender do ficheiro .env real (que tem segredos e a ligação à NeonDB).
process.env.JWT_SECRET = process.env.JWT_SECRET || 'segredo-de-teste-nao-usar-em-producao';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

// Evita que server.js chame app.listen() ao ser importado nos testes de
// integração (o mesmo mecanismo que o server.js já usa para a Vercel).
process.env.VERCEL = process.env.VERCEL || '1';
