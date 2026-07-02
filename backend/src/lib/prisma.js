import * as PrismaPkg from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// Support environments where @prisma/client is provided as named exports
// or as a CommonJS default export (serverless/platforms may differ).
const PrismaClient = PrismaPkg.PrismaClient ?? PrismaPkg.default?.PrismaClient ?? PrismaPkg.default ?? PrismaPkg;

const connectionString = process.env.DATABASE_URL;

// NeonDB (serverless Postgres) suspende a compute após inatividade. Quando isso
// acontece, ligações TCP em cache no pool morrem silenciosamente. Reciclamos as
// ligações idle rapidamente (antes de a Neon as fechar) para evitar entregar
// sockets mortos, e tratamos erros de ligações idle para não derrubar o processo.
const pool = new pg.Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 10_000,
  allowExitOnIdle: true,
});

pool.on('error', (err) => {
  // Ligação idle fechada pela Neon — descartada pelo pool, não é fatal.
  console.warn('[pg pool] ligação idle terminada:', err.message);
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export default prisma;
