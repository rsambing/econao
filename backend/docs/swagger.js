import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EconAO API',
      version: '1.0.0',
      description: 'Documentação da API REST do EconAO — Economia com História: Angola'
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Local' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },

apis: ['./server.js', './src/routes/*.js', './src/controllers/*.js']
};

export const swaggerSpec = swaggerJsdoc(options);