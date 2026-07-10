import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  registerSchema,
  updateProfileSchema,
  createContentSchema,
  createQuizSchema,
  submitQuizAttemptSchema,
  createForumTopicSchema
} from './validation.schemas.js';

describe('registerSchema', () => {
  it('aceita dados válidos e normaliza o email para minúsculas', () => {
    const result = registerSchema.parse({
      name: 'Maria Fernandes',
      email: 'Maria@ECONAO.ao',
      password: 'senha123'
    });
    expect(result.email).toBe('maria@econao.ao');
  });

  it('rejeita senha com menos de 6 caracteres', () => {
    expect(() =>
      registerSchema.parse({ name: 'Maria', email: 'maria@econao.ao', password: '123' })
    ).toThrow();
  });

  it('rejeita nome com menos de 2 caracteres', () => {
    expect(() =>
      registerSchema.parse({ name: 'M', email: 'maria@econao.ao', password: 'senha123' })
    ).toThrow();
  });

  it('rejeita email inválido', () => {
    expect(() =>
      registerSchema.parse({ name: 'Maria', email: 'nao-e-um-email', password: 'senha123' })
    ).toThrow();
  });
});

describe('loginSchema', () => {
  it('aceita credenciais válidas', () => {
    expect(() => loginSchema.parse({ email: 'a@a.ao', password: '123456' })).not.toThrow();
  });

  it('rejeita quando falta a password', () => {
    expect(() => loginSchema.parse({ email: 'a@a.ao' })).toThrow();
  });
});

describe('updateProfileSchema', () => {
  it('aceita apenas o nome (todos os campos são opcionais)', () => {
    expect(() => updateProfileSchema.parse({ name: 'Novo Nome' })).not.toThrow();
  });

  it('rejeita campos desconhecidos (schema estrito)', () => {
    expect(() => updateProfileSchema.parse({ name: 'Nome', role: 'ADMIN' })).toThrow();
  });

  it('aceita a mudança de email e senha juntamente com a senha atual', () => {
    expect(() =>
      updateProfileSchema.parse({
        email: 'novo@econao.ao',
        password: 'novaSenha1',
        currentPassword: 'senhaAntiga1'
      })
    ).not.toThrow();
  });
});

describe('createContentSchema', () => {
  const base = {
    type: 'TEXT',
    title: 'Título válido',
    body: 'Corpo com mais de 5 caracteres',
    theme: 'Economia'
  };

  it('aceita o mínimo de campos obrigatórios', () => {
    expect(() => createContentSchema.parse(base)).not.toThrow();
  });

  it('rejeita um "type" fora do enum', () => {
    expect(() => createContentSchema.parse({ ...base, type: 'ARTIGO' })).toThrow();
  });

  it('aceita isExclusive e uma galeria de media', () => {
    const result = createContentSchema.parse({
      ...base,
      isExclusive: true,
      media: [{ url: 'https://exemplo.ao/foto.jpg' }]
    });
    expect(result.isExclusive).toBe(true);
    expect(result.media[0].type).toBe('IMAGE');
  });

  it('rejeita um item de media sem URL válido', () => {
    expect(() =>
      createContentSchema.parse({ ...base, media: [{ url: 'nao-e-url' }] })
    ).toThrow();
  });
});

describe('createQuizSchema', () => {
  it('rejeita uma pergunta com menos de 2 opções', () => {
    expect(() =>
      createQuizSchema.parse({
        title: 'Quiz de teste',
        questions: [{ text: 'Pergunta?', options: [{ text: 'Única opção', isCorrect: true }] }]
      })
    ).toThrow();
  });

  it('aceita um quiz válido com pelo menos uma pergunta e duas opções', () => {
    expect(() =>
      createQuizSchema.parse({
        title: 'Quiz de teste',
        questions: [
          {
            text: 'Pergunta?',
            options: [
              { text: 'Opção A', isCorrect: true },
              { text: 'Opção B', isCorrect: false }
            ]
          }
        ]
      })
    ).not.toThrow();
  });
});

describe('submitQuizAttemptSchema', () => {
  it('rejeita uma lista de respostas vazia', () => {
    expect(() => submitQuizAttemptSchema.parse({ answers: [] })).toThrow();
  });

  it('aceita pelo menos uma resposta com IDs inteiros', () => {
    expect(() =>
      submitQuizAttemptSchema.parse({ answers: [{ questionId: 1, optionId: 2 }] })
    ).not.toThrow();
  });
});

describe('createForumTopicSchema', () => {
  it('aceita título, descrição e tema opcional', () => {
    expect(() =>
      createForumTopicSchema.parse({ title: 'Tópico', description: 'Descrição válida aqui' })
    ).not.toThrow();
  });

  it('rejeita descrição com menos de 5 caracteres', () => {
    expect(() =>
      createForumTopicSchema.parse({ title: 'Tópico', description: 'Oi' })
    ).toThrow();
  });
});
