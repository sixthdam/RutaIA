# RutaIA — Backend

API REST desarrollada con Spring Boot para RutaIA. Este README cubre el backend y la base de datos relacional. Qdrant, n8n y el frontend se documentan en sus propios README (ver el [README principal](../README.md)).

## Índice

- [Stack técnico](#stack-técnico)
- [Estructura de paquetes](#estructura-de-paquetes)
- [Base de datos](#base-de-datos)
- [Configuración de la aplicación](#configuración-de-la-aplicación)
- [Ejecución](#ejecución)
- [Autenticación y roles](#autenticación-y-roles)
- [Endpoints](#endpoints)
- [Códigos de error](#códigos-de-error)
- [Reglas de negocio](#reglas-de-negocio)
- [Pendientes conocidos](#pendientes-conocidos)
- [Despliegue](#despliegue)

## Stack técnico

- Java 21
- Spring Boot (Web, Data JPA, Validation, Security)
- MySQL 8
- JWT (io.jsonwebtoken / jjwt)
- Swagger / OpenAPI
- Lombok

## Estructura de paquetes

```
com.rutaia.backend
├── auth            # Login, registro y DTOs de autenticación
├── config           # Seguridad, JWT, API key de automatización, CORS, OpenAPI
├── controller        # Controladores REST
├── service           # Interfaces de lógica de negocio
├── service.impl        # Implementaciones
├── repositorio         # Repositorios Spring Data JPA
├── modelo            # Entidades JPA
├── modelo.enums        # Enums (roles, estados, dificultad, experiencia)
├── dto.request         # DTOs de entrada
├── dto.response        # DTOs de salida
├── mapper            # Conversión entidad ↔ DTO
└── exceptions          # Excepciones personalizadas y manejo global de errores
```

## Base de datos

### Crear la base de datos

```sql
CREATE DATABASE proyectoia2 CHARACTER SET utf8mb4;
```

### Crear roles y usuarios de MySQL

El proyecto usa roles de MySQL 8 para separar permisos: administración total, uso del backend (lectura/escritura sin DDL) y auditoría (solo lectura).

```sql
CREATE ROLE IF NOT EXISTS 'logi_admin', 'logi_backend', 'logi_auditor';

GRANT ALL PRIVILEGES ON proyectoia2.* TO 'logi_admin';
GRANT SELECT, INSERT, UPDATE, DELETE ON proyectoia2.* TO 'logi_backend';
GRANT SELECT ON proyectoia2.* TO 'logi_auditor';

CREATE USER IF NOT EXISTS 'usr_dba'@'%' IDENTIFIED BY 'CAMBIA_ESTA_CLAVE';
CREATE USER IF NOT EXISTS 'usr_api_service'@'%' IDENTIFIED BY 'CAMBIA_ESTA_CLAVE';
CREATE USER IF NOT EXISTS 'usr_auditor_qa'@'%' IDENTIFIED BY 'CAMBIA_ESTA_CLAVE';

GRANT 'logi_admin' TO 'usr_dba'@'%';
GRANT 'logi_backend' TO 'usr_api_service'@'%';
GRANT 'logi_auditor' TO 'usr_auditor_qa'@'%';

SET DEFAULT ROLE 'logi_admin' TO 'usr_dba'@'%';
SET DEFAULT ROLE 'logi_backend' TO 'usr_api_service'@'%';
SET DEFAULT ROLE 'logi_auditor' TO 'usr_auditor_qa'@'%';

FLUSH PRIVILEGES;
```

> El backend se conecta con `usr_api_service`, que solo tiene `SELECT`, `INSERT`, `UPDATE`, `DELETE` (sin DDL), ya que el esquema se administra manualmente (`spring.jpa.hibernate.ddl-auto=none`).

### Crear el esquema

Ejecutar `database/Database.sql` (usuarios, cursos, categorías, consultas, recomendaciones, fuentes, calificaciones) antes de iniciar la aplicación.

### Normalizar datos existentes (si aplica)

```sql
UPDATE usuarios SET correo = LOWER(TRIM(correo));
```

Necesario porque el login compara correos ya normalizados a minúsculas.

## Configuración de la aplicación

`src/main/resources/application.properties`:

```properties
spring.application.name=backend

spring.datasource.url=${DB_URL}
spring.datasource.username=usr_api_service
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true

spring.mvc.throw-exception-if-no-handler-found=true
spring.web.resources.add-mappings=false

secret=${JWT_SECRET}
n8n.api-key=${N8N_API_KEY}
```

### Variables de entorno

| Variable | Descripción |
|---|---|
| `DB_URL` | URL de conexión a MySQL |
| `DB_PASSWORD` | Contraseña de `usr_api_service` |
| `JWT_SECRET` | Clave para firmar los JWT (HS256, mínimo 32 bytes) |
| `N8N_API_KEY` | Clave estática usada por n8n para autenticarse contra la API |

Generar valores seguros:

```bash
openssl rand -hex 32
```

> No almacenar secretos, contraseñas o claves API en el repositorio. Usar variables de entorno o un archivo local excluido en `.gitignore`.

## Ejecución

```bash
./mvnw spring-boot:run
```

En Windows:

```bash
.\mvnw.cmd spring-boot:run
```

API disponible en `http://localhost:8080`. Documentación interactiva:

```
http://localhost:8080/swagger-ui.html
```

## Autenticación y roles

| Rol | Descripción | Cómo se autentica |
|---|---|---|
| `ESTUDIANTE` | Usuario de la plataforma; se asigna automáticamente al registrarse | JWT |
| `ADMIN` | Gestión administrativa (cursos, categorías, usuarios); se asigna manualmente en la base de datos | JWT |
| `AUTOMATION` | Operaciones ejecutadas por n8n | API key estática (no JWT) |

### Registro e inicio de sesión (roles ESTUDIANTE / ADMIN)

```
POST /auth/register
POST /auth/login
```

Respuesta:

```json
{ "token": "...", "role": "ESTUDIANTE", "idUsuario": 1 }
```

El token se envía en cada petición protegida:

```
Authorization: Bearer <token>
```

Duración del token: 7 días.

### Autenticación de n8n (rol AUTOMATION)

n8n no usa JWT: se autentica con una API key estática (`N8N_API_KEY`), enviada de cualquiera de estas dos formas:

```
Authorization: Bearer <N8N_API_KEY>
```
o
```
X-API-Key: <N8N_API_KEY>
```

La key no expira; se rota cambiando la variable de entorno y reiniciando el backend.

## Endpoints

### Autenticación

| Método | Ruta | Acceso |
|---|---|---|
| POST | `/auth/register` | Público |
| POST | `/auth/login` | Público |

### Cursos

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/cursos` · `/api/cursos/{id}` | ESTUDIANTE, ADMIN, AUTOMATION |
| POST / PUT / DELETE | `/api/cursos/{id}` | ADMIN |

### Categorías

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/categorias` · `/api/categorias/{id}` | ESTUDIANTE, ADMIN, AUTOMATION |
| POST / PUT / DELETE | `/api/categorias/{id}` | ADMIN |

### Consultas

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/consultas` | Todas las consultas |
| GET | `/api/consultas?idUsuario={id}` | Consultas de un usuario |
| GET | `/api/consultas/{id}` | Consulta puntual |
| GET | `/api/consultas/{id}/recomendacion` | Recomendación asociada a la consulta |
| POST | `/api/consultas` | Registrar consulta |
| DELETE | `/api/consultas/{id}` | Eliminar consulta |

Acceso: ESTUDIANTE, ADMIN, AUTOMATION.

### Recomendaciones

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/recomendaciones` · `/api/recomendaciones/{id}` | ESTUDIANTE, ADMIN, AUTOMATION |
| POST / PUT / DELETE | `/api/recomendaciones/{id}` | ESTUDIANTE, ADMIN, AUTOMATION |

### Fuentes

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/fuentes` | Todas las fuentes |
| GET | `/api/fuentes/recomendacion/{idRecomendacion}` | Fuentes de una recomendación |
| POST | `/api/fuentes` | Registrar fuente |
| DELETE | `/api/fuentes/{idRecomendacion}/{idCurso}` | Eliminar (clave compuesta) |

Acceso: ESTUDIANTE, ADMIN, AUTOMATION.

### Calificaciones

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/calificaciones` · `/api/calificaciones/{idRecomendacion}` | ESTUDIANTE, ADMIN, AUTOMATION |
| POST | `/api/calificaciones` | Registrar (una sola por recomendación) |
| DELETE | `/api/calificaciones/{idRecomendacion}` | Eliminar |

> No existe endpoint de actualización (`PUT`) para calificaciones.

### Usuarios

| Método | Ruta | Acceso |
|---|---|---|
| GET / PUT / DELETE | `/api/usuarios/**` | ADMIN |

### Estadísticas

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/stats` | Estadísticas globales |
| GET | `/api/stats?userId={id}` | Estadísticas de un usuario específico |

## Códigos de error

Formato estándar de respuesta de error:

```json
{
  "timestamp": "...",
  "status": 404,
  "message": "...",
  "errorCode": "RESOURCE_NOT_FOUND"
}
```

| Código | Cuándo ocurre |
|---|---|
| 400 | Validación fallida, JSON malformado o violación de regla de negocio |
| 401 | Token o API key inválida, expirada o ausente |
| 403 | Autenticado pero sin el rol requerido |
| 404 | Recurso no encontrado |
| 409 | Correo duplicado u otra violación de unicidad |
| 500 | Error interno no controlado |

## Reglas de negocio

- Un correo solo puede pertenecer a un estudiante (normalizado a minúsculas).
- Todo registro nuevo se crea con rol `ESTUDIANTE`; el rol no se recibe desde el cliente.
- Una consulta debe pertenecer a un estudiante existente.
- Una recomendación no puede duplicarse para la misma consulta.
- Una calificación (1 a 5) solo puede registrarse una vez por recomendación.

## Pendientes conocidos

- Las contraseñas de usuario se almacenan en texto plano (sin BCrypt).
- No hay límite de intentos de login (rate limiting).
- No hay refresh token; al expirar el JWT el usuario debe volver a iniciar sesión.

## Despliegue

1. Aprovisionar MySQL 8 accesible desde el servidor de la API.
2. Ejecutar el script de roles/usuarios y el de creación de esquema.
3. Definir `DB_URL`, `DB_PASSWORD`, `JWT_SECRET`, `N8N_API_KEY` en el entorno de ejecución (nunca en el repositorio).
4. Compilar y ejecutar:

```bash
./mvnw clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

5. Restringir CORS al dominio real del frontend antes de exponer la API públicamente (actualmente permite cualquier origen para facilitar el desarrollo).
