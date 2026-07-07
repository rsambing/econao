// Gera docs/openapi.json a partir dos comentários @openapi nas rotas/controllers.
// Corre em "postinstall" (local e na Vercel) para que o servidor tenha sempre
// um spec estático disponível, sem depender de ler os ficheiros de rotas por
// glob em tempo de execução — o que falha em ambientes serverless onde esses
// ficheiros podem não ir no bundle da função.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { swaggerSpec } from '../docs/swagger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, '../docs/openapi.json');

fs.writeFileSync(outPath, JSON.stringify(swaggerSpec, null, 2));

const pathCount = Object.keys(swaggerSpec.paths || {}).length;
console.log(`✓ OpenAPI spec gerado em docs/openapi.json (${pathCount} caminhos documentados)`);
