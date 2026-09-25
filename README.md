# RutaIA
---

<div align="justify">
  Plataforma web inteligente para recomendar cursos de formación tecnológica a partir de consultas en lenguaje natural.
  
  RutaIA combina un frontend desarrollado con Next.js, un backend REST con Spring Boot, una base de datos relacional MySQL, automatizaciones mediante n8n y una base de datos vectorial Qdrant para realizar búsquedas semánticas mediante embeddings.

  El sistema permite que un usuario describa qué desea aprender y reciba una recomendación basada en cursos existentes en la base de datos, utilizando un flujo RAG (Retrieval-Augmented Generation).
</div>

---

## Características

- Autenticación y registro de usuarios mediante JWT.
- Consulta de cursos en lenguaje natural.
- Búsqueda semántica mediante embeddings.
- Almacenamiento de embeddings en Qdrant.
- Flujo RAG automatizado con n8n.
- Recomendación de un curso a partir de candidatos recuperados.
- Manejo de consultas sin resultados.
- Registro de recomendaciones y fuentes utilizadas.
- Calificación de recomendaciones de 1 a 5 estrellas.
- Documentación de la API mediante Swagger / OpenAPI.
- Manejo estructurado de errores.

---

## Tecnologías utilizadas

### Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- App Router
- GSAP
- Lucide React

### Backend
- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Validation
- Spring Security
- MySQL 8
- JWT
- Lombok
- Swagger / OpenAPI

### Inteligencia artificial y automatización
- n8n
- OpenRouter
- Modelo de embeddings liquid/lfm-2.5-embedding-350m:free
- Qdrant
- ngrok para exposición temporal del webhook durante desarrollo

---

## Arquitectura general

<div align="justify">
El sistema está compuesto por cuatro componentes principales:

```
  ┌────────────────────┐
  │      Frontend      │
  │     Next.js        │
  │   Puerto 3000      │
  └─────────┬──────────┘
            │
            │ REST / JWT
            ▼
  ┌────────────────────┐
  │      Backend       │
  │    Spring Boot     │
  │   Puerto 8080      │
  └───────┬──────┬─────┘
          │      │
          │      └──────────────────────┐
          │                             │
          ▼                             ▼
  ┌───────────────┐             ┌─────────────────┐
  │    MySQL      │             │      n8n        │
  │  proyectoia2  │             │ Automatización  │
  └───────────────┘             └────────┬────────┘
                                        │
                          ┌────────────┼─────────────┐
                          │            │             │
                          ▼            ▼             ▼
                      OpenRouter     Qdrant       Backend API
                      Embeddings   Base vectorial
```
El flujo principal de recomendación utiliza la siguiente secuencia:

```
  Usuario
    ↓
  Frontend
    ↓
  POST /api/consultas
    ↓
  Spring Boot crea la consulta
    ↓
  Frontend obtiene idConsulta
    ↓
  Webhook /buscar de n8n
    ↓
  Validación de entrada
    ↓
  Generación de embedding
    ↓
  Búsqueda semántica en Qdrant
    ↓
  Recuperación de cursos candidatos
    ↓
  LLM evalúa los candidatos
    ↓
  Recomendación
    ↓
  Spring Boot guarda la recomendación y sus fuentes
    ↓
  Frontend navega a /result/{idConsulta}
    ↓
  Muestra recomendación o mensaje de ausencia de resultados
```
</div>

---

## Base de datos relacional
<div align="justify">
  RutaIA utiliza MySQL para almacenar la información estructurada de la aplicación.

  Entre las entidades principales se encuentran:

  - Usuarios
  - Categorías
  - Cursos
  - Consultas
  - Recomendaciones
  - Fuentes
  - Calificaciones
  
  La información estructurada permanece en MySQL, mientras que los embeddings y metadatos utilizados para la búsqueda semántica se almacenan en Qdrant.
</div>

---

## Base de datos vectorial
<div align="justify">
  Qdrant se utiliza como base de datos vectorial para almacenar las representaciones numéricas de los cursos.

  La colección utilizada por el proyecto es:

```
  cursos
```

  La configuración de la colección es:

```json
  {
    "vectors": {
      "size": 1024,
      "distance": "Cosine"
    }
  }
```

  Cada punto almacenado en Qdrant contiene:

```json
  {
    "id": 1,
    "vector": [ ... ],
    "payload": {
      "id_curso": 1,
      "nombre": "Introducción a Python",
      "descripcion": "...",
      "categoria": "Programación",
      "dificultad": "BASICO",
      "duracion": 40,
      "activo": true
    }
  }
```
  Qdrant se ejecuta mediante Docker y utiliza un volumen persistente:

```yaml
  services:
    qdrant:
      image: qdrant/qdrant:latest
      container_name: qdrant
      ports:
        - "6333:6333"
        - "6334:6334"
      volumes:
        - qdrant_data:/qdrant/storage
  volumes:
    qdrant_data:
```

La carpeta de almacenamiento del volumen no debe subirse al repositorio.
La métrica de similitud utilizada es la distancia del coseno.
</div>

---

## Flujo de almacenamiento en Qdrant

<div align="justify">
  El workflow guardar-qdrant.json se ejecuta mediante:

  On clicking "Execute Workflow"

  Su propósito es obtener los cursos de MySQL, generar sus embeddings y almacenarlos en Qdrant.

```
  Execute Workflow
        ↓
  Consulta a la base de datos
        ↓
  Consultar colecciones
        ↓
      If
    ↙     ↘
  Existe    No existe
    ↓          ↓
  Loop     Crear colección
    │          ↓
    └────→ Loop de cursos
              ↓
        Generar embedding
              ↓
        Preparar puntos
              ↓
        Guardar en Qdrant
              ↓
          Espera 2s
              ↓
        Loop de cursos
              ↓
              Done
```

  El texto utilizado para generar cada embedding es:

  - nombre + descripción

  El modelo utilizado es:

  - liquid/lfm-2.5-embedding-350m:free

  Este workflow no utiliza Webhook ni Respond to Webhook, ya que se ejecuta manualmente desde n8n.

  Las ramas de error terminan en sus respectivos nodos Code, que generan mensajes estructurados para identificar problemas de MySQL, Qdrant, embeddings o preparación de datos.
</div>

--- 

## Flujo RAG de búsqueda

<div align="justify">
  El workflow buscar-rag.json se ejecuta mediante un Webhook.

  Endpoint utilizado durante el desarrollo:

```
  POST /webhook/buscar
```

  La URL completa depende de la instancia de n8n y, durante el desarrollo, puede exponerse mediante ngrok.

  El frontend envía:

```json
  {
    "pregunta": "Quiero aprender Python desde cero",
    "idConsulta": "5",
    "idUsuario": "4",
    "nivel": "BASICO"
  }
```

  El flujo general es:

```
  Frontend
    ↓
  Webhook de n8n
    ↓
  Validación de la consulta
    ↓
  Generación del embedding
    ↓
  Búsqueda semántica en Qdrant
    ↓
  Recuperación de candidatos
    ↓
  Evaluación mediante LLM
    ↓
  Recomendación
    ↓
  Persistencia en el backend
    ↓
  Respuesta al frontend
  ```

  El LLM recibe únicamente los cursos recuperados como candidatos y debe seleccionar como máximo uno.

  No debe inventar cursos, identificadores ni información externa.

  Cuando existe una coincidencia adecuada, la respuesta contiene una recomendación.

  Cuando no existe un curso suficientemente relevante, n8n devuelve una respuesta válida como:

```json
  {
    "ok": true,
    "recomienda": false,
    "mensaje": "No encontramos un curso que se ajuste a lo que estás buscando.",
    "contactar_asesor": true
  }
```
  Esto se considera un resultado válido y no un error técnico.
</div>

---

## Manejo de errores

<div align="justify">
  Los workflows de n8n convierten los errores técnicos en respuestas estructuradas.

  Ejemplo:

```json
  {
    "estado": "error",
    "titulo": "No se pudo conectar con Qdrant",
    "mensaje": "No fue posible establecer la conexión con el servicio.",
    "accion_recomendada": "Verifica que Qdrant esté disponible e inténtalo nuevamente.",
    "puede_reintentar": true,
    "error_tecnico": "ECONNREFUSED"
  }
  ```

  Se contemplan errores relacionados con:

  - MySQL
  - Qdrant
  - Embeddings
  - Conectividad
  - Timeouts
  - Autorización
  - Colecciones inexistentes
  - Vectores inválidos
  - Límites de servicio
  - Errores internos

  El flujo de búsqueda utiliza Respond to Webhook para devolver la respuesta correspondiente al frontend.
</div>

---

## Backend
### Estructura principal

```
  com.rutaia.backend
    ├── auth
    ├── config
    ├── controller
    ├── service
    ├── service.impl
    ├── repositorio
    ├── modelo
    ├── modelo.enums
    ├── dto.request
    ├── dto.response
    ├── mapper
    └── 
```

### Responsabilidades

- auth: registro, login y autenticación.
- config: seguridad, JWT, CORS y OpenAPI.
- controller: endpoints REST.
- service: lógica de negocio.
- service.impl: implementaciones de servicios.
- repositorio: acceso a datos mediante Spring Data JPA.
- modelo: entidades JPA.
- dto: solicitudes y respuestas.
- mapper: conversión entre entidades y DTOs.
- exceptions: manejo de excepciones y errores globales.

---

### Autenticación

El backend utiliza JWT.

```
  Registro:

  POST /auth/register

  Login:

  POST /auth/login
```

Respuesta de ejemplo:

```json
{
  "token": "...",
  "role": "ESTUDIANTE",
  "idUsuario": 1
}
```

Las peticiones protegidas utilizan:

- Authorization: Bearer <TOKEN>
- Roles
- Rol	Descripción
- ESTUDIANTE	Usuario de la plataforma
- ADMIN	Gestión administrativa
- AUTOMATION	Operaciones utilizadas por automatizaciones

Los usuarios nuevos se registran como ESTUDIANTE.

---


## API principal

```
  Autenticación
  POST /auth/register
  POST /auth/login
  Cursos
  GET    /api/cursos
  GET    /api/cursos/{id}
  POST   /api/cursos
  PUT    /api/cursos/{id}
  DELETE /api/cursos/{id}
  Categorías
  GET    /api/categorias
  GET    /api/categorias/{id}
  POST   /api/categorias
  PUT    /api/categorias/{id}
  DELETE /api/categorias/{id}
  Consultas
  GET  /api/consultas
  GET  /api/consultas/{id}
  GET  /api/consultas?idUsuario={idUsuario}
  POST /api/consultas
  Recomendaciones
  GET    /api/recomendaciones
  GET    /api/recomendaciones/{id}
  POST   /api/recomendaciones
  PUT    /api/recomendaciones/{id}
  DELETE /api/recomendaciones/{id}

  GET /api/consultas/{id}/recomendacion
  Fuentes
  GET    /api/fuentes/recomendacion/{idRecomendacion}
  POST   /api/fuentes
  DELETE /api/fuentes/{id}
  Calificaciones
  GET    /api/calificaciones/{idRecomendacion}
  POST   /api/calificaciones
  PUT    /api/calificaciones/{idRecomendacion}
  DELETE /api/calificaciones/{idRecomendacion}
  Estadísticas
  GET /api/stats
  GET /api/stats?userId={idUsuario}
  Frontend
```

El frontend utiliza Next.js con App Router.

---

## Rutas principales:

/login
/register
/query
/result/[id]
/history
/stats
/catalog
Flujo de consulta

La página /query:

Valida la pregunta.
Registra la consulta en Spring Boot.
Obtiene el idConsulta.
Envía la pregunta al webhook de n8n.
Redirige a /result/{idConsulta}.
La página de resultados consulta al backend para obtener la recomendación.
Resultados

La página /result/[id] muestra:

La pregunta realizada.
La recomendación generada.
Los cursos utilizados como fuentes.
La similitud de las fuentes.
La calificación de la recomendación.

Cuando no existe un curso adecuado, se muestra el mensaje generado por n8n.

Calificaciones

Las recomendaciones pueden calificarse con valores de 1 a 5.

Ejemplo de solicitud:

{
  "idRecomendacion": 10,
  "calificacion": 5,
  "comentario": "La recomendación fue útil."
}

La interfaz utiliza estrellas para seleccionar la valoración y conserva visualmente el estado seleccionado antes del envío.

Variables de entorno
Frontend

Crear:

frontend/.env.local

Ejemplo:

NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://TU-DOMINIO/webhook/buscar

Después de modificar las variables, reiniciar Next.js.

Backend

Ejemplo:

spring.application.name=backend

spring.datasource.url=${DB_URL}
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true

secret=${JWT_SECRET}
n8n.api-key=${N8N_API_KEY}

Variables principales:

Variable	Descripción
DB_URL	URL de conexión a MySQL
DB_PASSWORD	Contraseña de la base de datos
JWT_SECRET	Clave utilizada para firmar JWT
N8N_API_KEY	Clave utilizada para las operaciones autenticadas de automatización

No almacenar secretos, contraseñas o claves API en el repositorio.

Ejecución local
Requisitos
JDK 21
Node.js
npm
Docker Desktop
MySQL
Git
Base de datos

Crear la base:

CREATE DATABASE proyectoia2 CHARACTER SET utf8mb4;

Después ejecutar:

database/Database.sql
Qdrant

Desde qdrant/:

docker compose up -d

Comprobar el contenedor:

docker ps

Qdrant queda disponible en:

http://localhost:6333
Backend

Desde backend/:

./mvnw spring-boot:run

En Windows:

.\mvnw.cmd spring-boot:run

API:

http://localhost:8080
Frontend

Desde frontend/:

npm install
npm run dev

Aplicación:

http://localhost:3000
n8n

Importar los workflows almacenados en:

n8n/

El workflow de búsqueda debe estar activo cuando se utilice la Production URL.

Durante el desarrollo puede utilizarse ngrok para exponer el webhook públicamente.

Swagger

La documentación de la API está disponible mediante Swagger / OpenAPI.

http://localhost:8080/swagger-ui.html

La ruta exacta puede variar según la configuración de OpenAPI.

Troubleshooting
Qdrant no responde

Verificar que el contenedor esté activo:

docker ps

Desde n8n, cuando Qdrant se ejecuta en Docker, la conexión utiliza:

http://host.docker.internal:6333
La colección cursos no existe

Ejecutar el workflow guardar-qdrant.json para crear y poblar la colección.

El frontend no llega a n8n

Verificar:

NEXT_PUBLIC_N8N_WEBHOOK_URL=https://TU-DOMINIO/webhook/buscar

También comprobar que:

n8n esté ejecutándose.
el workflow esté activo.
la URL de ngrok siga vigente.
el endpoint sea /webhook/buscar.
el navegador no esté bloqueando la petición por CORS.
La consulta llega a n8n pero no hay recomendación

Comprobar:

existencia de la colección cursos.
cursos activos en MySQL.
embeddings almacenados en Qdrant.
resultados devueltos por la búsqueda semántica.
respuesta del LLM.
registro de la recomendación en el backend.
Seguridad

No subir al repositorio:

Contraseñas de MySQL.
Secretos JWT.
API keys de OpenRouter.
API keys de n8n.
Tokens JWT.
Credenciales de servicios externos.

Utilizar variables de entorno y archivos locales excluidos mediante .gitignore.

Estado del sistema

RutaIA integra actualmente:

Frontend en Next.js.
API REST en Spring Boot.
Persistencia relacional en MySQL.
Autenticación JWT.
Automatizaciones en n8n.
Generación de embeddings mediante OpenRouter.
Base de datos vectorial Qdrant.
Búsqueda semántica.
Flujo RAG.
Recomendaciones mediante LLM.
Registro de fuentes.
Manejo estructurado de errores.
Sistema de calificaciones.

---

## Autores

🌐 [Karina Mendez](https://github.com/sixthdam) - n8n,  automatización del flujo RAG y base de datos vectorial

💻 [Juan Jose Mora](https://github.com/Monometra) - Diseño y desarrollo del frontend con Next.js

🗄️ [Santiago Dominguez](https://github.com/Shiroses) - Desarrollo del backend y diseño de la base de datos