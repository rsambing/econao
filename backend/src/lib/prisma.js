import * as PrismaPkg from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// Support environments where @prisma/client is provided as named exports
// or as a CommonJS default export (serverless/platforms may differ).
const PrismaClient = PrismaPkg.PrismaClient ?? PrismaPkg.default?.PrismaClient ?? PrismaPkg.default ?? PrismaPkg;

const connectionString = process.env.DATABASE_URL;

const pool = new pg.Pool({ connectionString });

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export default prisma;