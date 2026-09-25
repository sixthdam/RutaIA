# RutaIA — Frontend

Interfaz web desarrollada con Next.js (App Router) que consume exclusivamente la API REST del backend. El frontend nunca llama directamente a n8n, Qdrant u OpenRouter (RF 06).

## Índice

- [Stack técnico](#stack-técnico)
- [Rutas principales](#rutas-principales)
- [Flujo de consulta](#flujo-de-consulta)
- [Resultados](#resultados)
- [Calificaciones](#calificaciones)
- [Variables de entorno](#variables-de-entorno)
- [Ejecución local](#ejecución-local)
- [Troubleshooting](#troubleshooting)

## Stack técnico

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- GSAP
- Lucide React

## Rutas principales

| Ruta | Descripción |
|---|---|
| `/login` | Inicio de sesión |
| `/register` | Registro de estudiantes |
| `/query` | Formulario de consulta en lenguaje natural |
| `/result/[id]` | Resultado de una consulta específica |
| `/history` | Historial de consultas del estudiante |
| `/stats` | Estadísticas de la plataforma |
| `/catalog` | Catálogo de cursos |

## Flujo de consulta

La página `/query` realiza, en orden:

1. Valida la pregunta (no vacía).
2. Registra la consulta en el backend: `POST /api/consultas`.
3. Obtiene el `idConsulta` de la respuesta.
4. Envía la pregunta al webhook de n8n (`NEXT_PUBLIC_N8N_WEBHOOK_URL`).
5. Redirige a `/result/{idConsulta}`.

La página de resultados consulta al backend (`GET /api/consultas/{id}/recomendacion`) para obtener la recomendación generada.

## Resultados

La página `/result/[id]` muestra:

- La pregunta realizada.
- La recomendación generada.
- Los cursos utilizados como fuentes.
- La similitud de cada fuente.
- La calificación de la recomendación, si ya fue calificada.

Cuando no existe un curso adecuado, se muestra el mensaje generado por n8n en lugar de un error.

## Calificaciones

Las recomendaciones pueden calificarse con valores de 1 a 5, una sola vez por recomendación.

**Ejemplo de solicitud** (`POST /api/calificaciones`):

```json
{
  "idRecomendacion": 10,
  "calificacion": 5
}
```

> El campo `comentario` mostrado en versiones anteriores de este README no está soportado actualmente por el backend; confirmar con el equipo de backend antes de enviarlo.

La interfaz utiliza estrellas para seleccionar la valoración y conserva visualmente el estado seleccionado antes del envío.

## Variables de entorno

Crear `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://TU-DOMINIO/webhook/buscar
```

Después de modificar las variables, reiniciar Next.js.

> No almacenar secretos ni claves de servicios externos en este archivo más allá de la URL pública del webhook.

## Ejecución local

Requisitos: Node.js y npm, y el backend corriendo en `http://localhost:8080` (ver [`backend/README.md`](../backend/README.md)).

```bash
npm install
npm run dev
```

Aplicación disponible en `http://localhost:3000`.

## Troubleshooting

### El frontend no llega a n8n

Verificar:

```bash
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://TU-DOMINIO/webhook/buscar
```

Comprobar además que:

- n8n esté ejecutándose y el workflow esté activo.
- la URL de ngrok (si se usa) siga vigente.
- el endpoint sea `/webhook/buscar`.
- el navegador no esté bloqueando la petición por CORS.

### La consulta llega a n8n pero no hay recomendación

Ver la sección de Troubleshooting en [`automatizacion/README.md`](../automatizacion/README.md), ya que el problema suele estar en Qdrant, MySQL o el LLM, no en el frontend.
