import 'dotenv/config';
import bcrypt from 'bcrypt';
import prisma from '../src/lib/prisma.js';

async function main() {
  const hashed = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@econao.ao' },
    update: { password: hashed, role: 'ADMIN' },
    create: {
      name: 'Administrador EconAO',
      email: 'admin@econao.ao',
      password: hashed,
      role: 'ADMIN'
    }
  });
  console.log('✓ Admin:', admin.email);

  const contents = [
    {
      type: 'VIDEO',
      title: 'Inflação em Angola',
      body: 'Vídeo explicativo sobre a evolução da inflação em Angola, com dados históricos e atuais.',
      theme: 'Inflação',
      region: 'Nacional'
    },
    {
      type: 'TEXT',
      title: 'Comércio no período colonial',
      body: 'Artigo sobre as dinâmicas do comércio angolano durante o período colonial.',
      theme: 'História Económica',
      region: 'Luanda'
    },
    {
      type: 'PODCAST',
      title: 'Mulheres nos negócios',
      body: 'Episódio sobre o papel das mulheres no empreendedorismo e comércio angolano.',
      theme: 'Empreendedorismo',
      region: 'Nacional'
    },
    {
      type: 'TEXT',
      title: 'História da moeda angolana',
      body: 'Do Escudo Angolano ao Kwanza: a evolução da moeda nacional ao longo da história.',
      theme: 'Reformas Monetárias',
      region: 'Nacional'
    }
  ];

  for (const c of contents) {
    const existing = await prisma.content.findFirst({ where: { title: c.title } });
    if (!existing) {
      await prisma.content.create({ data: { ...c, authorId: admin.id } });
      console.log('✓ Conteúdo:', c.title);
    }
  }

  const existingQuiz = await prisma.quiz.findFirst({ where: { title: 'Economia e História de Angola' } });
  if (!existingQuiz) {
    await prisma.quiz.create({
      data: {
        title: 'Economia e História de Angola',
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
      }
    });
    console.log('✓ Quiz: Economia e História de Angola');
  }

  const existingTopic = await prisma.forumTopic.findFirst({ where: { title: 'Exportação de petróleo' } });
  if (!existingTopic) {
    await prisma.forumTopic.create({
      data: {
        title: 'Exportação de petróleo',
        description: 'Qual o impacto da exportação de petróleo na economia angolana ao longo das décadas?',
        theme: 'Economia',
        authorId: admin.id
      }
    });
    console.log('✓ Tópico de fórum: Exportação de petróleo');
  }

  console.log('\nSeed concluído!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
