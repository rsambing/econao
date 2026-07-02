# EconAO — Economia com História: Angola

Aplicação educativa sobre economia e história de Angola (ISPTEC, Engenharia de Software II). Conteúdos (vídeo/texto/podcast), quiz interactivo, fórum de discussão e comentários, com painel público e backoffice de gestão.

## Estrutura

```
economia/
  docs/       Documentação do projecto (enunciado, fundamentação pedagógica)
  backend/    API REST — Node + Express + Prisma + PostgreSQL (NeonDB)
  frontend/   Painel web — React (público + /admin)
  mobile/     App mobile — Expo + React Native
```

## Correr localmente

**Backend**
```bash
cd backend
cp .env.example .env   # preencher DATABASE_URL (NeonDB) e JWT_SECRET
npm install
npx prisma migrate dev
npm run seed
npm run dev             # http://localhost:3000
```

**Web**
```bash
cd frontend
npm install
npm start                # http://localhost:3001 (definir REACT_APP_API_URL se o backend não estiver em localhost:3000)
```

**Mobile**
```bash
cd mobile
npm install
npx expo start           # definir EXPO_PUBLIC_API_URL no .env (IP da rede local, não localhost, para testar num dispositivo físico)
```

## Stack

- Backend: Node.js, Express, Prisma ORM, PostgreSQL (NeonDB), JWT
- Web: React (Vite/CRA), sem framework adicional
- Mobile: Expo, React Native, Expo Router
