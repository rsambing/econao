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

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// Registar rotas
app.use(authRouter);
app.use(userRouter);
app.use(contentRouter);
app.use(quizRouter);
app.use(forumRouter);
app.use(uploadRouter);

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