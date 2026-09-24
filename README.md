# RutaIA

**AI-powered route planning platform** — Next.js 16 + Spring Boot 3 + MySQL 8.4

## Quick Start (3 Terminals)

```bash
# Terminal 1: MySQL (port 3307)
docker run -d --name rutaia-mysql -e MYSQL_ROOT_PASSWORD=root -p 3307:3306 -v ./database/Database.sql:/docker-entrypoint-initdb.d/Database.sql mysql:8.0

# Terminal 2: Backend (port 8080)
cd backend && ./mvnw spring-boot:run

# Terminal 3: Frontend (port 3000)
cd frontend && npm install && npm run dev
```

## Database (Docker)

### Create Container with Auto-Init

```bash
docker run -d \
  --name rutaia-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -p 3307:3306 \
  -v ./database/Database.sql:/docker-entrypoint-initdb.d/Database.sql \
  mysql:8.0
```

### Verify

```bash
# Wait ~15s for init
sleep 15

# Check user and tables
docker exec rutaia-mysql mysql -u root -proot -e "SELECT user, host FROM mysql.user WHERE user = 'usr_api_service'; SHOW TABLES FROM proyectoia2;"

# Test from host
mysql -h 127.0.0.1 -P 3307 -u usr_api_service -pBackendPass123! -e "USE proyectoia2; SHOW TABLES;"
```

### Troubleshooting Commands

```bash
# Container status
docker ps -a
docker port rutaia-mysql

# Logs
docker logs rutaia-mysql

# Connect to MySQL
docker exec -it rutaia-mysql mysql -u root -proot

# Manual SQL init if needed
docker exec -i rutaia-mysql mysql -u root -proot < ./database/Database.sql

# Verify grants
docker exec rutaia-mysql mysql -u root -proot -e "SHOW GRANTS FOR 'usr_api_service'@'%';"

# Stop/remove
docker stop rutaia-mysql && docker rm rutaia-mysql

# Fresh start (removes volumes)
docker rm -f rutaia-mysql
```

## Docker Compose (Full Stack)

```bash
docker-compose up --build
```

**Services:**
- `mysql` — MySQL 8.0 on port 3307 (host) / 3306 (container)
- `backend` — Spring Boot on port 8080
- `frontend` — Next.js on port 3000

**Note:** Requires `Dockerfile` in `./backend` and `./frontend` to build images. For local development without Dockerfiles, use the 3-terminal method above.

### docker-compose.yml

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    container_name: rutaia-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: proyectoia2
    ports:
      - "3307:3306"
    volumes:
      - ./database/Database.sql:/docker-entrypoint-initdb.d/Database.sql
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    container_name: rutaia-backend
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/proyectoia2
      SPRING_DATASOURCE_USERNAME: usr_api_service
      SPRING_DATASOURCE_PASSWORD: BackendPass123!
    depends_on:
      mysql:
        condition: service_healthy

  frontend:
    build: ./frontend
    container_name: rutaia-frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://backend:8080
      NEXT_PUBLIC_N8N_WEBHOOK_URL: https://your-n8n-instance.com/webhook/consulta
    depends_on:
      - backend

volumes:
  mysql_data:
```

## Backend (Spring Boot 3)

### Run

```bash
cd backend
./mvnw spring-boot:run          # Dev server on http://localhost:8080
./mvnw clean package              # Build JAR
```

### Swagger UI
```
http://localhost:8080/swagger-ui.html
```

### Configuration
`backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3307/proyectoia2
spring.datasource.username=usr_api_service
spring.datasource.password=BackendPass123!
```

## Frontend (Next.js 16, App Router, TypeScript, Tailwind CSS v4)

### Commands

```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Dev server on http://localhost:3000
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint check
```

### Environment Variables

Create `.env.local` in `frontend/` if needed:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/consulta
```

### n8n Integration

The frontend triggers n8n webhook after creating a consulta:

1. User submits query → `POST /api/consultas` → returns `idConsulta`
2. Frontend shows "Procesando con IA..." banner
3. Calls `POST <N8N_WEBHOOK_URL>` with payload:
   ```json
   {
     "mensaje": "user query",
     "idConsulta": "123",
     "idUsuario": "456",
     "experiencia": "PRINCIPIANTE"
   }
   ```
4. n8n processes asynchronously (backend handles auth via `n8n.api-key`)
5. Frontend shows success/error alerts with auto-dismiss (10s)
6. Navigates to `/result/{idConsulta}` — polls/awaits recommendation from backend

**Auth:** Frontend sends NO token to n8n. Backend configures `n8n.api-key` in n8n node.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MYSQL_ROOT_PASSWORD` | `root` | MySQL root password |
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://localhost:3307/proyectoia2` | Backend DB URL |
| `SPRING_DATASOURCE_USERNAME` | `usr_api_service` | DB user |
| `SPRING_DATASOURCE_PASSWORD` | `BackendPass123!` | DB password |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | Frontend → Backend API base |
| `NEXT_PUBLIC_N8N_WEBHOOK_URL` | `https://your-n8n-instance.com/webhook/consulta` | n8n webhook for AI processing |

## Project Structure

```
RutaIA/
├── backend/           # Spring Boot 3 (Maven)
│   ├── src/main/java/...
│   ├── pom.xml
│   └── mvnw
├── frontend/          # Next.js 16 (App Router, TS, Tailwind v4)
│   ├── app/           # Routes & Server Components
│   │   ├── query/            # AI query form + n8n trigger
│   │   ├── result/[id]/      # Recommendation + sources + rating
│   │   ├── history/          # User consultation history
│   │   ├── stats/            # Personal statistics (via /api/stats)
│   │   ├── catalog/          # Course catalog with filters
│   │   ├── login/            # Login form
│   │   └── register/         # Registration (POST /auth/register)
│   ├── components/
│   │   ├── ui/               # shadcn/ui primitives (Button, etc.)
│   │   ├── layout/           # Header, Footer, MainLayout
│   │   ├── loading/          # Skeleton, InitialLoader
│   │   └── ErrorBoundary.tsx # Global error boundary
│   ├── lib/
│   │   ├── api/
│   │   │   ├── service.ts    # ApiService (JWT, interceptors, n8n trigger)
│   │   │   └── config.ts     # Endpoints & constants
│   │   ├── auth/AuthContext.tsx # Auth state (React Context + useSyncExternalStore)
│   │   ├── gsap.ts           # Centralized GSAP + ScrollTrigger
│   │   └── utils/            # date, cn (clsx + tailwind-merge)
│   ├── package.json
│   └── tsconfig.json
├── database/
│   └── Database.sql   # MySQL 8.4 init script
├── docker-compose.yml # Full stack (requires Dockerfiles)
├── .env.example       # Frontend env template
└── README.md
```

## API Endpoints (Frontend)

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/login` | ❌ | Login, returns JWT + user ID + role |
| POST | `/auth/register` | ❌ | Register student (role defaults to ESTUDIANTE) |

### Consultas
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/consultas` | ✅ | Create consulta (triggers n8n) |
| GET | `/api/consultas` | ✅ | List all (admin) |
| GET | `/api/consultas?idUsuario={id}` | ✅ | **TODO** — List by user (history/stats) |
| GET | `/api/consultas/{id}` | ✅ | Get single consulta |
| GET | `/api/consultas/{id}/recomendacion` | ✅ | **TODO** — Get recommendation for consulta |

### Recomendaciones
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/recomendaciones` | ✅ | List all |
| GET | `/api/recomendaciones/{id}` | ✅ | Get single |

### Fuentes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/fuentes/recomendacion/{id}` | ✅ | Sources for recommendation |

### Calificaciones
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/calificaciones` | ✅ | Create/update rating |
| GET | `/api/calificaciones/{id}` | ✅ | Get rating |

### Enums
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/enums/dificultades` | ❌ | Course difficulties |
| GET | `/api/enums/roles` | ❌ | User roles |
| GET | `/api/enums/experiencias` | ❌ | Experience levels |
| GET | `/api/enums/estados` | ❌ | Consulta states |

### Stats
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/stats` | ✅ | **TODO** — Personal statistics |

## Troubleshooting

- **Port 3307** — Host port for MySQL (container internal 3306). Change if occupied.
- **MySQL 8.4 grants** — `Database.sql` uses `CREATE USER + GRANT` (not legacy roles).
- **Enum typo fixed** — `'AVANZADO'` (was `'AVANZADO\t'`).
- **Access denied** — Ensure container has `-p 3307:3306` and user `usr_api_service@'%'` exists.
- **Frontend can't reach backend** — Verify `NEXT_PUBLIC_API_URL` and backend running on 8080.
- **n8n webhook fails** — Check `NEXT_PUBLIC_N8N_WEBHOOK_URL`, ensure backend configured `n8n.api-key` in n8n node.
- **Stats/History empty** — Backend endpoints `GET /api/stats`, `GET /api/consultas?idUsuario={id}`, `GET /api/consultas/{id}/recomendacion` not yet implemented (ETA ~3h).