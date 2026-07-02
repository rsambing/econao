# EconAO — comandos úteis
# Uso: make <alvo>   (ex: make back, make front, make db-seed)
# No Windows precisas de ter o "make" instalado (scoop install make | choco install make).

.PHONY: help install install-back install-front install-mobile \
        back front mobile dev \
        db-migrate db-seed db-studio db-generate db-reset \
        build ip

help: ## Mostra esta ajuda
	@echo EconAO - alvos disponiveis:
	@echo   make install        - instala dependencias (back + front + mobile)
	@echo   make back           - corre o backend (Express) em http://localhost:3000
	@echo   make front          - corre o frontend web (React)
	@echo   make mobile         - corre a app mobile (Expo)
	@echo   make db-migrate     - aplica migracoes Prisma na NeonDB
	@echo   make db-seed        - popula a BD com dados de exemplo
	@echo   make db-studio      - abre o Prisma Studio
	@echo   make db-generate    - regenera o Prisma Client
	@echo   make db-reset       - APAGA e recria a BD (cuidado!)
	@echo   make ip             - mostra o IP local (para o Expo Go)

# ---- Instalacao ----
install: install-back install-front install-mobile ## Instala tudo

install-back: ## Instala dependencias do backend
	cd backend && npm install

install-front: ## Instala dependencias do frontend
	cd frontend && npm install

install-mobile: ## Instala dependencias do mobile
	cd mobile && npm install

# ---- Desenvolvimento ----
back: ## Corre o backend (http://localhost:3000)
	cd backend && npm run dev

front: ## Corre o frontend web
	cd frontend && npm start

mobile: ## Corre a app mobile (Expo)
	cd mobile && npx expo start

# ---- Base de dados (Prisma / NeonDB) ----
db-migrate: ## Aplica migracoes Prisma
	cd backend && npx prisma migrate dev

db-seed: ## Popula a BD com dados de exemplo
	cd backend && npm run seed

db-studio: ## Abre o Prisma Studio
	cd backend && npx prisma studio

db-generate: ## Regenera o Prisma Client
	cd backend && npx prisma generate

db-reset: ## APAGA e recria a BD (destrutivo)
	cd backend && npx prisma migrate reset

# ---- Utilitarios ----
build: ## Faz build de producao do frontend
	cd frontend && npm run build

ip: ## Mostra o IP local (para configurar EXPO_PUBLIC_API_URL no mobile)
	@powershell -NoProfile -Command "Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $$_.IPAddress -notlike '127.*' -and $$_.IPAddress -notlike '169.254.*' } | Select-Object IPAddress, InterfaceAlias | Format-Table -AutoSize"
