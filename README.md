<div align="center">
<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Chess%20Pawn.png" alt="Chess" width="80" />
# Chess App
 
**A production-grade, real-time multiplayer chess platform**
 
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=flat-square&logo=turborepo&logoColor=white)](https://turbo.build/)
[![License: ISC](https://img.shields.io/badge/License-ISC-green?style=flat-square)](./LICENSE)
 
<p>Play chess against anyone in the world — instantly, in real-time.</p>
[Features](#-features) · [Architecture](#-architecture) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Roadmap](#-roadmap)
 
---
 
</div>
<h1>Overview :</h1>
Chess App is a full-stack multiplayer chess platform built on a **monorepo architecture**. It leverages WebSockets for sub-100ms move synchronization, `chess.js` for bulletproof move validation, and PostgreSQL for persistent game state — all orchestrated with Turborepo across three independent services.
 
<br />
<h1>Architecture</h1>
 
### Current System
 
<img src="https://github.com/user-attachments/assets/c5e92ca6-7401-4af7-9c0d-194b6d13d2dd" alt="Current Architecture" width="100%" />
The current architecture uses a **single WebSocket server** that handles all real-time game logic. The HTTP backend manages authentication and user data independently, while both services share types and database access via monorepo packages.
 
### Future Resilient System
 
<img src="https://github.com/user-attachments/assets/efa32804-3ac3-4dc1-8927-d31944911a58" alt="Future Architecture" width="100%" />
The V2 architecture introduces **horizontal scaling** via a message broker (Redis/Kafka) between WebSocket nodes, a dedicated presence service, and read replicas — enabling zero-downtime deployments and handling thousands of concurrent games.
 
<br />
## Tech Stack
 
| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Lucide React |
| **HTTP API** | Express.js, TypeScript, JWT Auth |
| **Game Server** | Node.js WebSockets (`ws`), `chess.js` |
| **Database** | PostgreSQL, Prisma ORM |
| **Monorepo** | Turborepo, pnpm workspaces |
 
<br />
## Project Structure
 
```
chess-app/
├── apps/
│   ├── frontend/          # React 19 + Vite client
│   ├── backend/           # Express REST API (auth, users)
│   └── ws/                # WebSocket game server
│
├── packages/
│   ├── db/                # Prisma schema + generated client
│   ├── backend-common/    # Shared JWT utils, middleware
│   ├── ui/                # Shared React component library
│   ├── eslint-config/     # Unified lint rules
│   └── typescript-config/ # Base tsconfig
│
├── turbo.json
└── pnpm-workspace.yaml
```
 
<br />
## Getting Started
 
### Prerequisites
 
- **Node.js** >= 18
- **pnpm** >= 9 — `npm install -g pnpm`
- **PostgreSQL** >= 14
### 1 · Clone & Install
 
```bash
git clone <your-repo-url>
cd chess-app
pnpm install
```
 
### 2 · Configure Environment
 
Create the database env file:
 
```bash
# packages/db/.env
DATABASE_URL="postgresql://user:password@localhost:5432/chessapp"
```
 
Create env files for each app:
 
```bash
# apps/backend/.env
PORT=4000
JWT_SECRET=your_super_secret_key
DATABASE_URL="postgresql://user:password@localhost:5432/chessapp"
 
# apps/ws/.env
PORT=3000
JWT_SECRET=your_super_secret_key
DATABASE_URL="postgresql://user:password@localhost:5432/chessapp"
```
 
### 3 · Set Up Database
 
```bash
cd packages/db
npx prisma migrate dev --name init
npx prisma generate
cd ../..
```
 
### 4 · Run All Services
 
```bash
pnpm dev
```
 
Turborepo starts all three services in parallel:
 
| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| HTTP API | http://localhost:4000 |
| WebSocket | ws://localhost:3000 |
 
<br />
## Features
 
### Live
 
- ♟ **Real-time gameplay** — moves sync in under 100ms via WebSockets
- ✅ **Move validation** — server-side enforcement via `chess.js` (no cheating)
- 🔐 **Authentication** — JWT-based sign up / sign in
- 💾 **Game persistence** — full game state saved to PostgreSQL
- 📱 **Responsive UI** — works on mobile and desktop
### Roadmap (V2)
 
- [ ] In-game chat
- [ ] Video call integration
- [ ] Engine analysis & accuracy detection
- [ ] ELO rating & leaderboard
- [ ] Spectator mode
- [ ] Horizontal WebSocket scaling (Redis pub/sub)
- [ ] Reconnection handling & game resumption
<br />
## How a Game Works
 
```
1. Player A opens the app → connects via WebSocket with JWT
2. Player A clicks "New Game" → server creates a game room
3. Player B joins the room → server pairs them, assigns colors
4. Player A moves e2→e4:
     Client → WS Server → chess.js validates → broadcasts to Player B
                                              → persists to PostgreSQL
5. Player B sees the move instantly (<100ms)
6. Game over → result saved, players disconnected
```
 
<br />
## Contributing
 
```bash
# Run lint across all packages
pnpm lint
 
# Type check
pnpm typecheck
 
# Build all packages
pnpm build
```
 
All PRs should target the `main` branch. Please open an issue before making large changes.
 
<br />
<div>
</div>

___

<h3>License </h3>
 
ISC License — see [`package.json`](./package.json) for details.
 
---
 