# RutaIA

Plataforma web inteligente para recomendar cursos de formación tecnológica a partir de consultas en lenguaje natural.

RutaIA combina un frontend en Next.js, un backend REST en Spring Boot, una base de datos relacional MySQL, automatizaciones en n8n y una base de datos vectorial Qdrant para realizar búsqueda semántica mediante embeddings. El sistema permite que un usuario describa qué desea aprender y reciba una recomendación basada en cursos existentes, usando un flujo RAG (Retrieval-Augmented Generation).

## Índice

- [Características](#características)
- [Arquitectura general](#arquitectura-general)
- [Flujo principal de recomendación](#flujo-principal-de-recomendación)
- [Componentes del proyecto](#componentes-del-proyecto)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Seguridad](#seguridad)
- [Autores](#autores)

## Características

- Autenticación y registro de usuarios mediante JWT.
- Consulta de cursos en lenguaje natural.
- Búsqueda semántica mediante embeddings almacenados en Qdrant.
- Flujo RAG automatizado con n8n.
- Recomendación de un curso a partir de candidatos recuperados, con manejo explícito de "sin resultados".
- Registro de recomendaciones, fuentes utilizadas y su similitud.
- Calificación de recomendaciones de 1 a 5.
- Estadísticas globales y por usuario.
- Documentación de la API mediante Swagger / OpenAPI.
- Manejo estructurado de errores en toda la plataforma.

## Arquitectura general

```
  ┌────────────────────┐
  │      Frontend      │
  │     Next.js        │
  │   Puerto 3000      │
  └─────────┬──────────┘
            │ REST / JWT
            ▼
  ┌────────────────────┐
  │      Backend       │
  │    Spring Boot     │
  │   Puerto 8080      │
  └───────┬──────┬─────┘
          │      │
          ▼      └──────────────────┐
  ┌───────────────┐         ┌─────────────────┐
  │    MySQL      │         │      n8n        │
  │  proyectoia2  │         │ Automatización  │
  └───────────────┘         └────────┬────────┘
                                     │
                       ┌────────────┼─────────────┐
                       ▼            ▼             ▼
                   OpenRouter     Qdrant       Backend API
                   Embeddings   Base vectorial
```

## Flujo principal de recomendación

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
Validación → Embedding → Búsqueda semántica en Qdrant
  ↓
Recuperación de cursos candidatos
  ↓
LLM evalúa los candidatos
  ↓
Spring Boot guarda la recomendación y sus fuentes
  ↓
Frontend navega a /result/{idConsulta}
```

Cuando ningún curso supera el umbral de relevancia, n8n devuelve un resultado válido de "sin coincidencia", no un error técnico.

## Componentes del proyecto

Cada componente tiene su propio README con el detalle de instalación, configuración y ejecución:

| Componente | Descripción | Documentación |
|---|---|---|
| Backend | API REST en Spring Boot, JWT, MySQL, Swagger | [`backend/README.md`](./backend/README.md) |
| Frontend | Interfaz en Next.js (rutas, flujo de consulta, resultados) | [`frontend/README.md`](./frontend/README.md) |
| Automatización | Workflows de n8n y base de datos vectorial Qdrant | [`automatizacion/README.md`](./automatizacion/README.md) |

## Tecnologías utilizadas

| Área | Tecnologías |
|---|---|
| Frontend | Next.js, React, TypeScript, Tailwind CSS, App Router, GSAP, Lucide React |
| Backend | Java 21, Spring Boot, Spring Web, Spring Data JPA, Spring Validation, Spring Security, MySQL 8, JWT, Lombok, Swagger/OpenAPI |
| IA y automatización | n8n, OpenRouter, modelo de embeddings `liquid/lfm-2.5-embedding-350m:free`, Qdrant, ngrok (solo desarrollo) |

## Seguridad

No se sube al repositorio ningún secreto: contraseñas de MySQL, secretos JWT, API keys de OpenRouter o de n8n, tokens JWT ni credenciales de servicios externos. Todo se maneja mediante variables de entorno y archivos locales excluidos con `.gitignore`. El detalle de cada variable está en el README de cada componente.

## Autores

🌐 [Karina Mendez](https://github.com/sixthdam) — n8n, automatización del flujo RAG y base de datos vectorial

💻 [Juan Jose Mora](https://github.com/Monometra) — Diseño y desarrollo del frontend con Next.js

🗄️ [Santiago Dominguez](https://github.com/Shiroses) — Desarrollo del backend y diseño de la base de datos
