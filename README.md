# Full-Stack Portfolio (Golang Gin + Next.js TypeScript React)

A modern, high-performance portfolio application featuring a **Golang Gin** RESTful backend and a **React 19 / Next.js 15 App Router** frontend styled with **Tailwind CSS**.

---

## 🌟 Architecture & Tech Stack

```
                               ┌─────────────────────────────┐
                               │     Next.js 15 Frontend     │
                               │ React 19 + TypeScript + TW  │
                               │    (Port 3000 / App Router) │
                               └──────────────┬──────────────┘
                                              │ HTTP / JSON
                                              ▼
                               ┌─────────────────────────────┐
                               │     Golang Gin Backend      │
                               │ Clean Architecture + GORM   │
                               │         (Port 8080)         │
                               └──────────────┬──────────────┘
                                              │ GORM Driver
                                              ▼
                               ┌─────────────────────────────┐
                               │      Database Layer         │
                               │  PostgreSQL 15 (Docker)     │
                               │  SQLite (Zero-Config Dev)   │
                               └─────────────────────────────┘
```

- **Backend**:
  - **Golang 1.24** with **Gin Web Framework**
  - **GORM** ORM with support for PostgreSQL and automatic SQLite fallback for zero-configuration local runs
  - Auto-migrations and rich seed data on initial startup (Profile, Projects, Skills, Experiences, Admin account)
  - **JWT Authentication** (`golang-jwt/jwt/v5`) and **Bcrypt** password hashing
  - Structured error envelopes and CORS middleware
- **Frontend**:
  - **Next.js 15 (App Router)** & **React 19**
  - **TypeScript** with strict typing and API interfaces
  - **Tailwind CSS v4** with glassmorphism, glowing accents, and responsive layout
  - Interactive sections: Hero with simulated architecture terminal, Skills filter matrix, Featured Works, Experience timeline, and live Contact dispatch
  - Admin & API verification modal with instant JWT test login
- **DevOps & Infrastructure**:
  - Multi-stage **Dockerfiles** for both backend and frontend
  - **Docker Compose** orchestration with PostgreSQL container healthcheck
  - **GitHub Actions CI** pipeline (`.github/workflows/ci.yml`)
  - `Makefile` for developer workflow convenience

---

## 📁 Repository Structure

```
portfolio/
├── backend/                         # Golang Gin API
│   ├── cmd/
│   │   └── main.go                  # Server entrypoint & graceful shutdown
│   ├── internal/
│   │   ├── api/                     # HTTP handlers & route registration
│   │   │   ├── handler.go
│   │   │   └── handler_test.go      # Go unit & integration tests
│   │   ├── config/                  # Environment variable configuration
│   │   ├── middleware/              # CORS, JWT auth, request logger
│   │   ├── model/                   # GORM database models
│   │   ├── repository/              # Database connection, migrations & seed
│   │   └── service/                 # Business logic & JWT services
│   ├── pkg/
│   │   └── utils/                   # Password bcrypt, JWT helpers, JSON envelopes
│   ├── Dockerfile                   # Multi-stage Alpine container
│   ├── go.mod
│   └── go.sum
├── frontend/                        # Next.js React TypeScript Web App
│   ├── src/
│   │   ├── app/                     # Next.js App Router (layout, page, globals.css)
│   │   ├── components/              # Reusable UI components (Navbar, Hero, etc.)
│   │   ├── lib/                     # API client & fallback data
│   │   └── types/                   # TypeScript interfaces
│   ├── Dockerfile                   # Production Node.js runner
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml               # PostgreSQL + Backend + Frontend
├── Makefile                         # Shortcuts for dev, test, and build
├── .github/workflows/ci.yml         # CI pipeline for automated testing
└── README.md
```

---

## 🚀 Quick Start

### Option 1: Run with Docker Compose (Recommended for Full Stack)

1. Make sure Docker is running on your machine.
2. Start all services:
   ```bash
   docker compose up --build
   # or run in background:
   make docker-up
   ```
3. Open your browser:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:8080/health](http://localhost:8080/health)
4. To stop services:
   ```bash
   make docker-down
   ```

---

### Option 2: Run Locally (Zero-Config Development)

The backend is configured with **automatic SQLite fallback**. If PostgreSQL is not running locally, it creates and uses `portfolio.db` automatically!

#### 1. Start the Go Backend:
```bash
cd backend
go run cmd/main.go
```
The server will start on `http://localhost:8080`.

#### 2. Start the Next.js Frontend:
In a separate terminal:
```bash
cd frontend
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## 🔐 Default Admin Account

Initial database migrations automatically seed a default administrator for testing API authentication:

| Field | Value |
| --- | --- |
| **Email** | `admin@portfolio.dev` |
| **Username** | `admin` |
| **Password** | `Admin@123456` |

*Click the Shield icon in the top right navbar to test JWT authentication and view submitted contact messages.*

---

## 📡 API Endpoints Reference

### Public Routes
- `GET /health` – Service health status
- `GET /api/v1/profile` – Public developer profile
- `GET /api/v1/projects` – List all projects (`?featured=true` filter supported)
- `GET /api/v1/projects/:slug` – Single project details
- `GET /api/v1/skills` – List categorized skills
- `GET /api/v1/experiences` – List career history
- `POST /api/v1/contact` – Submit contact message
- `POST /api/v1/auth/login` – Authenticate admin & receive JWT

### Protected Routes (`Authorization: Bearer <JWT>`)
- `GET /api/v1/auth/me` – Current authenticated user
- `PUT /api/v1/admin/profile` – Update profile details
- `POST /api/v1/admin/projects` – Create project
- `PUT /api/v1/admin/projects/:id` – Update project
- `DELETE /api/v1/admin/projects/:id` – Delete project
- `POST /api/v1/admin/skills` – Create skill
- `PUT /api/v1/admin/skills/:id` – Update skill
- `DELETE /api/v1/admin/skills/:id` – Delete skill
- `POST /api/v1/admin/experiences` – Create experience
- `PUT /api/v1/admin/experiences/:id` – Update experience
- `DELETE /api/v1/admin/experiences/:id` – Delete experience
- `GET /api/v1/admin/messages` – View contact messages
- `PATCH /api/v1/admin/messages/:id/read` – Mark message read
- `DELETE /api/v1/admin/messages/:id` – Delete message

---

## 🧪 Testing & Verification

- **Run Go Unit Tests**:
  ```bash
  cd backend && go test -v ./...
  # or
  make test-backend
  ```
- **Build Next.js Frontend**:
  ```bash
  cd frontend && npm run build
  # or
  make build-frontend
  ```
