import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import { swaggerSpec } from './docs/swagger.js';
import authRouter from './src/routes/auth.route.js';
import userRouter from './src/routes/user.route.js';
import contentRouter from './src/routes/content.route.js';
import quizRouter from './src/routes/quiz.route.js';
import forumRouter from './src/routes/forum.route.js';
import uploadRouter from './src/routes/upload.route.js';
import searchRouter from './src/routes/search.route.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Em serverless (Vercel), os ficheiros estáticos do swagger-ui-dist (CSS/JS)
// nem sempre são incluídos no bundle da função — os pedidos acabam a cair no
// handler do setup() e a devolver a própria página HTML em vez do ficheiro,
// deixando a página em branco. Carregamos CSS/JS a partir de um CDN (fixado à
// versão do swagger-ui-dist instalada) para funcionar da mesma forma local e
// em produção.
const SWAGGER_UI_VERSION = '5.32.6';
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCssUrl: `https://unpkg.com/swagger-ui-dist@${SWAGGER_UI_VERSION}/swagger-ui.css`,
    customJs: [
      `https://unpkg.com/swagger-ui-dist@${SWAGGER_UI_VERSION}/swagger-ui-bundle.js`,
      `https://unpkg.com/swagger-ui-dist@${SWAGGER_UI_VERSION}/swagger-ui-standalone-preset.js`
    ]
  })
);

// Registar rotas
app.use(authRouter);
app.use(userRouter);
app.use(contentRouter);
app.use(quizRouter);
app.use(forumRouter);
app.use(uploadRouter);
app.use(searchRouter);

app.get('/', (req, res) => {
  res.send('EconAO API — Economia com História: Angola');
});

// Vercel serverless skips listen(); Render and local dev need it
if (!process.env.VERCEL) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    const env = process.env.NODE_ENV || 'development';
    console.log(`[EconAO API] a correr em http://localhost:${port} (ambiente: ${env})`);
    console.log(`[EconAO API] documentação Swagger em http://localhost:${port}/docs`);
  });
}

export default app;