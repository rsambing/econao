import { z } from 'zod';

const roleEnum = z.enum(['ADMIN', 'USER']);
const contentTypeEnum = z.enum(['VIDEO', 'TEXT', 'PODCAST']);

// AUTH SCHEMAS
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido').transform((value) => value.toLowerCase()),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  avatarUrl: z.string().url('URL inválido').optional().or(z.literal('')),
  email: z.string().email('Email inválido').optional(),
  password: z.string().min(6, 'A nova senha deve ter pelo menos 6 caracteres').optional(),
  currentPassword: z.string().optional()
}).strict();

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido')
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
});

// USER SCHEMAS
export const createUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido').transform((value) => value.toLowerCase()),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  role: roleEnum.optional().default('USER')
});

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  email: z.string().email('Email inválido').optional(),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').optional(),
  role: roleEnum.optional()
}).strict();

// Item da galeria (foto/vídeo/áudio adicional)
const mediaItemSchema = z.object({
  url: z.string().url('URL inválido'),
  type: z.enum(['IMAGE', 'VIDEO', 'AUDIO']).optional().default('IMAGE')
});

// CONTENT SCHEMAS
export const createContentSchema = z.object({
  type: contentTypeEnum,
  title: z.string().min(2, 'Título deve ter pelo menos 2 caracteres'),
  body: z.string().min(5, 'Conteúdo deve ter pelo menos 5 caracteres'),
  mediaUrl: z.string().url('URL inválido').optional().or(z.literal('')),
  imageUrl: z.string().url('URL inválido').optional().or(z.literal('')),
  theme: z.string().min(2, 'Tema deve ter pelo menos 2 caracteres'),
  region: z.string().optional(),
  isExclusive: z.boolean().optional(),
  media: z.array(mediaItemSchema).optional()
});

export const updateContentSchema = z.object({
  type: contentTypeEnum.optional(),
  title: z.string().min(2, 'Título deve ter pelo menos 2 caracteres').optional(),
  body: z.string().min(5, 'Conteúdo deve ter pelo menos 5 caracteres').optional(),
  mediaUrl: z.string().url('URL inválido').optional().or(z.literal('')),
  imageUrl: z.string().url('URL inválido').optional().or(z.literal('')),
  theme: z.string().min(2, 'Tema deve ter pelo menos 2 caracteres').optional(),
  region: z.string().optional(),
  isExclusive: z.boolean().optional(),
  media: z.array(mediaItemSchema).optional()
}).strict();

// COMMENT SCHEMAS
export const createCommentSchema = z.object({
  body: z.string().min(1, 'Comentário não pode ser vazio')
});

// QUIZ SCHEMAS
export const createQuizSchema = z.object({
  title: z.string().min(2, 'Título deve ter pelo menos 2 caracteres'),
  imageUrl: z.string().url('URL inválido').optional().or(z.literal('')),
  questions: z.array(z.object({
    text: z.string().min(2, 'Pergunta deve ter pelo menos 2 caracteres'),
    order: z.number().int().optional().default(0),
    options: z.array(z.object({
      text: z.string().min(1, 'Opção não pode ser vazia'),
      isCorrect: z.boolean().optional().default(false)
    })).min(2, 'Cada pergunta precisa de pelo menos 2 opções')
  })).min(1, 'Quiz precisa de pelo menos 1 pergunta')
});

export const submitQuizAttemptSchema = z.object({
  answers: z.array(z.object({
    questionId: z.number().int(),
    optionId: z.number().int()
  })).min(1, 'É necessário responder pelo menos 1 pergunta')
});

// FORUM SCHEMAS
export const createForumTopicSchema = z.object({
  title: z.string().min(2, 'Título deve ter pelo menos 2 caracteres'),
  description: z.string().min(5, 'Descrição deve ter pelo menos 5 caracteres'),
  theme: z.string().optional(),
  imageUrl: z.string().url('URL inválido').optional().or(z.literal('')),
  media: z.array(mediaItemSchema).optional()
});

export const updateForumTopicSchema = z.object({
  title: z.string().min(2, 'Título deve ter pelo menos 2 caracteres').optional(),
  description: z.string().min(5, 'Descrição deve ter pelo menos 5 caracteres').optional(),
  theme: z.string().optional().nullable(),
  imageUrl: z.string().url('URL inválido').optional().or(z.literal('')).nullable(),
  media: z.array(mediaItemSchema).optional()
}).strict();

export const createForumReplySchema = z.object({
  body: z.string().min(1, 'Resposta não pode ser vazia')
});
