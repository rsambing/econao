import 'dotenv/config';
import bcrypt from 'bcrypt';
import prisma from '../src/lib/prisma.js';

const SAMPLE_VIDEO = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

async function upsertUser({ name, email, password, role = 'USER', avatarUrl }) {
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashed, role, avatarUrl: avatarUrl ?? undefined },
    create: { name, email, password: hashed, role, avatarUrl }
  });
  console.log(`✓ Utilizador: ${user.email}${avatarUrl ? ' (com avatar)' : ' (sem avatar — usa iniciais)'}`);
  return user;
}

async function main() {
  const admin = await upsertUser({
    name: 'Administrador EconAO',
    email: 'admin@econao.ao',
    password: 'admin123',
    role: 'ADMIN'
  });

  // Utilizadores de exemplo — alguns com foto de perfil, outros sem
  // (para demonstrar o fallback de iniciais no avatar por defeito).
  const maria = await upsertUser({
    name: 'Maria Fernandes',
    email: 'maria@econao.ao',
    password: 'senha123',
    avatarUrl: 'https://i.pravatar.cc/150?img=32'
  });
  const carlos = await upsertUser({
    name: 'Carlos Silva',
    email: 'carlos@econao.ao',
    password: 'senha123',
    avatarUrl: 'https://i.pravatar.cc/150?img=12'
  });
  const ana = await upsertUser({
    name: 'Ana Costa',
    email: 'ana@econao.ao',
    password: 'senha123'
    // sem avatarUrl de propósito
  });

  const contents = [
    {
      type: 'VIDEO',
      title: 'Inflação em Angola',
      body: 'Vídeo explicativo sobre a evolução da inflação em Angola, com dados históricos e atuais.',
      theme: 'Inflação',
      region: 'Nacional',
      mediaUrl: SAMPLE_VIDEO,
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80'
    },
    {
      type: 'TEXT',
      title: 'Comércio no período colonial',
      body: 'Artigo sobre as dinâmicas do comércio angolano durante o período colonial.',
      theme: 'História Económica',
      region: 'Luanda',
      mediaUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80',
      imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80'
    },
    {
      type: 'PODCAST',
      title: 'Mulheres nos negócios',
      body: 'Episódio sobre o papel das mulheres no empreendedorismo e comércio angolano.',
      theme: 'Empreendedorismo',
      region: 'Nacional',
      mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      imageUrl: 'https://images.unsplash.com/photo-1518183214770-9cffbec72538?auto=format&fit=crop&w=900&q=80'
    },
    {
      type: 'TEXT',
      title: 'História da moeda angolana',
      body: 'Do Escudo Angolano ao Kwanza: a evolução da moeda nacional ao longo da história.',
      theme: 'Reformas Monetárias',
      region: 'Nacional',
      mediaUrl: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=900&q=80',
      imageUrl: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=900&q=80'
    },
    {
      type: 'TEXT',
      title: 'Exportação de petróleo e crescimento económico',
      body: 'Como a exportação de petróleo moldou a economia angolana entre 2005 e 2014.',
      theme: 'Economia',
      region: 'Cabinda',
      mediaUrl: 'https://images.unsplash.com/photo-1611095973763-414019e72400?auto=format&fit=crop&w=900&q=80',
      imageUrl: 'https://images.unsplash.com/photo-1611095973763-414019e72400?auto=format&fit=crop&w=900&q=80'
    },
    {
      type: 'TEXT',
      title: 'Urbanização de Luanda',
      body: 'O crescimento urbano da capital angolana e o seu impacto socioeconómico nas últimas décadas.',
      theme: 'Urbanização',
      region: 'Luanda',
      mediaUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=900&q=80',
      imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=900&q=80'
    },
    {
      type: 'PODCAST',
      title: 'Migração e êxodo rural',
      body: 'Conversa sobre os movimentos migratórios internos em Angola e as suas causas económicas.',
      theme: 'Migração',
      region: 'Nacional',
      mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=900&q=80'
    },
    {
      type: 'VIDEO',
      title: 'Reformas económicas dos anos 90',
      body: 'Documentário curto sobre a transição para a economia de mercado em Angola.',
      theme: 'Reformas Económicas',
      region: 'Nacional',
      mediaUrl: SAMPLE_VIDEO,
      imageUrl: 'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?auto=format&fit=crop&w=900&q=80',
      // Conteúdo Jindungo (exclusivo) de exemplo — só visível a quem tem conta.
      isExclusive: true
    }
  ];

  for (const c of contents) {
    const existing = await prisma.content.findFirst({ where: { title: c.title } });
    let contentRow = existing;
    if (!existing) {
      contentRow = await prisma.content.create({ data: { ...c, authorId: admin.id } });
      console.log('✓ Conteúdo:', c.title);
    } else if (!existing.mediaUrl || !existing.imageUrl || (c.isExclusive && !existing.isExclusive)) {
      // Backfill de mediaUrl/imageUrl/isExclusive em conteúdos de execuções anteriores do seed.
      contentRow = await prisma.content.update({
        where: { id: existing.id },
        data: {
          mediaUrl: existing.mediaUrl || c.mediaUrl,
          imageUrl: existing.imageUrl || c.imageUrl,
          isExclusive: c.isExclusive ?? existing.isExclusive
        }
      });
      console.log('✓ Conteúdo atualizado (mediaUrl/imageUrl/isExclusive):', c.title);
    }

    // Um comentário de exemplo por conteúdo, de utilizadores diferentes
    if (c.title === 'Inflação em Angola') {
      const hasComment = await prisma.comment.findFirst({ where: { contentId: contentRow.id, authorId: maria.id } });
      if (!hasComment) await prisma.comment.create({ data: { contentId: contentRow.id, authorId: maria.id, body: 'Muito esclarecedor, obrigada!' } });
    }
    if (c.title === 'História da moeda angolana') {
      const hasComment = await prisma.comment.findFirst({ where: { contentId: contentRow.id, authorId: ana.id } });
      if (!hasComment) await prisma.comment.create({ data: { contentId: contentRow.id, authorId: ana.id, body: 'Não sabia que o Kwanza teve tantas reformas.' } });
    }
  }

  const existingQuiz = await prisma.quiz.findFirst({
    where: { title: 'Economia e História de Angola' },
    include: { questions: { include: { options: true } } }
  });
  let quiz = existingQuiz;
  if (existingQuiz && !existingQuiz.imageUrl) {
    quiz = await prisma.quiz.update({
      where: { id: existingQuiz.id },
      data: { imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=900&q=80' },
      include: { questions: { include: { options: true } } }
    });
    console.log('✓ Quiz atualizado (imageUrl)');
  }
  if (!existingQuiz) {
    quiz = await prisma.quiz.create({
      data: {
        title: 'Economia e História de Angola',
        imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=900&q=80',
        questions: {
          create: [
            {
              text: 'Qual foi o impacto da reforma monetária de 1999?',
              order: 1,
              options: {
                create: [
                  { text: 'Redução da inflação', isCorrect: false },
                  { text: 'Substituição do Kwanza', isCorrect: true },
                  { text: 'Aumento do salário mínimo', isCorrect: false },
                  { text: 'Criação do Banco Central Africano', isCorrect: false }
                ]
              }
            },
            {
              text: 'Qual setor liderou o crescimento económico entre 2005 e 2014?',
              order: 2,
              options: {
                create: [
                  { text: 'Agricultura', isCorrect: false },
                  { text: 'Petróleo e gás', isCorrect: true },
                  { text: 'Turismo', isCorrect: false },
                  { text: 'Tecnologia', isCorrect: false }
                ]
              }
            }
          ]
        }
      },
      include: { questions: { include: { options: true } } }
    });
    console.log('✓ Quiz: Economia e História de Angola');
  }

  // Algumas tentativas de quiz de exemplo, para o ranking não aparecer vazio
  if (quiz?.questions?.length) {
    const existingAttempt = await prisma.quizAttempt.findFirst({ where: { quizId: quiz.id, userId: carlos.id } });
    if (!existingAttempt) {
      await prisma.quizAttempt.create({ data: { quizId: quiz.id, userId: carlos.id, score: 2 } });
      await prisma.quizAttempt.create({ data: { quizId: quiz.id, userId: maria.id, score: 1 } });
      console.log('✓ Tentativas de quiz de exemplo (Carlos, Maria)');
    }
  }

  const topics = [
    {
      title: 'Exportação de petróleo',
      description: 'Qual o impacto da exportação de petróleo na economia angolana ao longo das décadas?',
      theme: 'Economia',
      imageUrl: 'https://images.unsplash.com/photo-1611095973763-414019e72400?auto=format&fit=crop&w=900&q=80',
      authorId: admin.id
    },
    {
      title: 'Impacto da diversificação económica',
      description: 'Angola tem investido em diversificar a economia para além do petróleo. Que setores acham mais promissores?',
      theme: 'Economia',
      imageUrl: 'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?auto=format&fit=crop&w=900&q=80',
      authorId: maria.id
    },
    {
      title: 'Memórias do período colonial',
      description: 'Espaço para partilhar histórias e relatos sobre o comércio e a economia no período colonial.',
      theme: 'História',
      imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80',
      authorId: carlos.id
    }
  ];

  for (const t of topics) {
    const existing = await prisma.forumTopic.findFirst({ where: { title: t.title } });
    let topicRow = existing;
    if (!existing) {
      topicRow = await prisma.forumTopic.create({ data: t });
      console.log('✓ Tópico de fórum:', t.title);
    } else if (!existing.imageUrl) {
      topicRow = await prisma.forumTopic.update({ where: { id: existing.id }, data: { imageUrl: t.imageUrl } });
      console.log('✓ Tópico atualizado (imageUrl):', t.title);
    }

    if (t.title === 'Exportação de petróleo') {
      const hasReply = await prisma.forumReply.findFirst({ where: { topicId: topicRow.id, authorId: carlos.id } });
      if (!hasReply) {
        await prisma.forumReply.create({ data: { topicId: topicRow.id, authorId: carlos.id, body: 'Foi determinante para o crescimento do PIB entre 2005 e 2014.' } });
        await prisma.forumReply.create({ data: { topicId: topicRow.id, authorId: ana.id, body: 'Mas também criou dependência de um único setor.' } });
      }
    }
  }

  console.log('\nSeed concluído!');
  console.log('Contas de teste (password entre parêntesis):');
  console.log('  admin@econao.ao   (admin123)  — ADMIN');
  console.log('  maria@econao.ao   (senha123)  — USER, com avatar');
  console.log('  carlos@econao.ao  (senha123)  — USER, com avatar');
  console.log('  ana@econao.ao     (senha123)  — USER, sem avatar (iniciais)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
