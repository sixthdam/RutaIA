This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


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
