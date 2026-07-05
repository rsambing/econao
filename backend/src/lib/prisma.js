import dns from 'node:dns';
import * as PrismaPkg from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// O endpoint da NeonDB tem endereços IPv4 e IPv6, mas o IPv6 é inalcançável
// nalgumas redes (ex.: routers domésticos sem IPv6 configurado). Isto causa
// ECONNREFUSED/ETIMEDOUT intermitentes ao ligar. `ipv4first` ajuda em geral,
// mas o driver adapter do Prisma (@prisma/adapter-pg) não respeita esta
// preferência global — por isso forçamos `family: 4` directamente no pool
// abaixo, que é o que realmente resolve o problema para as queries Prisma.
dns.setDefaultResultOrder('ipv4first');

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
  family: 4,
});

pool.on('error', (err) => {
  // Ligação idle fechada pela Neon — descartada pelo pool, não é fatal.
  console.warn('[pg pool] ligação idle terminada:', err.message);
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export default prisma;
