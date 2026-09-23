# RutaIA

**AI-powered route planning platform** — Next.js 14 + Spring Boot 3 + MySQL 8.4

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

## Frontend (Next.js 14, App Router, TypeScript, Tailwind)

### Commands

```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Dev server on http://localhost:3000
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint check
```

### Environment Variable

Create `.env.local` in `frontend/` if needed:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MYSQL_ROOT_PASSWORD` | `root` | MySQL root password |
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://localhost:3307/proyectoia2` | Backend DB URL |
| `SPRING_DATASOURCE_USERNAME` | `usr_api_service` | DB user |
| `SPRING_DATASOURCE_PASSWORD` | `BackendPass123!` | DB password |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | Frontend → Backend API base |

## Project Structure

```
RutaIA/
├── backend/           # Spring Boot 3 (Maven)
│   ├── src/main/java/...
│   ├── pom.xml
│   └── mvnw
├── frontend/          # Next.js 14 (App Router, TS, Tailwind)
│   ├── app/           # Routes & Server Components
│   ├── components/    # UI (shadcn/ui)
│   ├── lib/           # API, auth, utils
│   ├── package.json
│   └── tsconfig.json
├── database/
│   └── Database.sql   # MySQL 8.4 init script
├── docker-compose.yml # Full stack (requires Dockerfiles)
└── README.md
```

## Troubleshooting

- **Port 3307** — Host port for MySQL (container internal 3306). Change if occupied.
- **MySQL 8.4 grants** — `Database.sql` uses `CREATE USER + GRANT` (not legacy roles).
- **Enum typo fixed** — `'AVANZADO'` (was `'AVANZADO\t'`).
- **Access denied** — Ensure container has `-p 3307:3306` and user `usr_api_service@'%'` exists.
- **Frontend can't reach backend** — Verify `NEXT_PUBLIC_API_URL` and backend running on 8080.
