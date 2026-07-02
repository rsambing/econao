# EconAO — App Mobile

App mobile (Expo + React Native) do EconAO — Economia com História: Angola. Consome a mesma API do painel web (`../backend`).

## Correr localmente

```bash
npm install
npx expo start
```

Configura `EXPO_PUBLIC_API_URL` no `.env` para apontar para o backend (usa o IP da tua máquina na rede local ao testar num dispositivo físico via Expo Go, não `localhost`).

## Ecrãs

- Explorar Conteúdos, Quiz Interactivo, Fórum de Discussão, Perfil (tabs)
- Login / Registo
- Detalhe de conteúdo, quiz e tópico de fórum
