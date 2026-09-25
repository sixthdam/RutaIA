# RutaIA — Automatización (n8n + Qdrant)
 
Documentación de los workflows de n8n y la configuración de Qdrant usados para la indexación de cursos y el flujo RAG de búsqueda.
 
## Índice
 
- [Base de datos vectorial (Qdrant)](#base-de-datos-vectorial-qdrant)
- [Flujo de almacenamiento en Qdrant](#flujo-de-almacenamiento-en-qdrant)
- [Flujo RAG de búsqueda](#flujo-rag-de-búsqueda)
- [Manejo de errores](#manejo-de-errores)
- [Ejecución local](#ejecución-local)
- [Troubleshooting](#troubleshooting)
## Base de datos vectorial (Qdrant)
 
Qdrant almacena las representaciones numéricas (embeddings) de los cursos. Colección utilizada:
 
```
cursos
```
 
Configuración de la colección:
 
```json
{
  "vectors": {
    "size": 1024,
    "distance": "Cosine"
  }
}
```
 
Cada punto almacenado contiene:
 
```json
{
  "id": 1,
  "vector": [ ... ],
  "payload": {
    "id_curso": 1,
    "nombre": "Introducción a Python",
    "descripcion": "...",
    "categoria": "Programación",
    "dificultad": "BASICA",
    "duracion": 40,
    "activo": true
  }
}
```
 
> La métrica de similitud utilizada es la distancia del coseno.
 
Qdrant se ejecuta mediante Docker con volumen persistente:
 
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
 
> La carpeta de almacenamiento del volumen no debe subirse al repositorio.
 
## Flujo de almacenamiento en Qdrant
 
Workflow: `guardar-qdrant.json`. Se ejecuta manualmente desde n8n (**Execute Workflow**), no usa Webhook.
 
Propósito: obtener los cursos de MySQL, generar sus embeddings y almacenarlos en Qdrant.
 
![Flujo de adiciones](./img/Flujo_Adiciones.png)
 
```
Execute Workflow
      ↓
Consulta a la base de datos
      ↓
Consultar colecciones
      ↓
    ¿Existe?
   ↙        ↘
 Sí           No
  ↓            ↓
Loop      Crear colección
  │            ↓
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
        (repite el loop)
              ↓
            Done
```
 
- Texto usado para el embedding: `nombre + descripción`.
- Modelo: `liquid/lfm-2.5-embedding-350m:free`.
- Las ramas de error terminan en nodos `Code` que generan mensajes estructurados para identificar problemas de MySQL, Qdrant, embeddings o preparación de datos.
- Se debe evitar duplicar cursos ya indexados y trabajar con un mínimo de 20 cursos (RF 05).
## Flujo RAG de búsqueda
 
Workflow: `buscar-rag.json`. Se ejecuta mediante un Webhook.
 
Endpoint (desarrollo):
 
```
POST /webhook/buscar
```
 
La URL completa depende de la instancia de n8n; en desarrollo puede exponerse con ngrok.
 
**Payload enviado por el frontend:**
 
```json
{
  "pregunta": "Quiero aprender Python desde cero",
  "idConsulta": "5",
  "idUsuario": "4",
  "nivel": "BASICO"
}
```
 
**Flujo general:**
 
![Flujo de consultas](./img/Flujo_Consultas.png)
 
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
Recuperación de candidatos (3 a 5, solo cursos activos, ordenados por similitud)
  ↓
Evaluación mediante LLM
  ↓
Recomendación
  ↓
Persistencia en el backend (POST /api/recomendaciones, POST /api/fuentes)
  ↓
Respuesta al frontend
```
 
El LLM recibe únicamente los cursos recuperados como candidatos y debe seleccionar como máximo uno. No debe inventar cursos, identificadores ni información externa.
 
Cuando no existe un curso suficientemente relevante (por debajo del umbral de similitud), la respuesta es válida, no un error técnico:
 
```json
{
  "ok": true,
  "recomienda": false,
  "mensaje": "No encontramos un curso que se ajuste a lo que estás buscando.",
  "contactar_asesor": true
}
```
 
## Manejo de errores
 
Los workflows convierten los errores técnicos en respuestas estructuradas, por ejemplo:
 
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
 
Casos contemplados: errores de MySQL, Qdrant, embeddings, conectividad, timeouts, autorización, colecciones inexistentes, vectores inválidos, límites de servicio y errores internos. El flujo de búsqueda usa **Respond to Webhook** para devolver siempre una respuesta al frontend.
 
## Ejecución local
 
Requisitos: Docker Desktop, n8n en ejecución (local o en la nube).
 
**Levantar Qdrant** desde `qdrant/`:
 
```bash
docker compose up -d
docker ps   # confirmar que el contenedor está activo
```
 
Qdrant queda disponible en `http://localhost:6333`.
 
**Importar workflows** en n8n desde la carpeta `n8n/`. El workflow de búsqueda debe estar **activo** cuando se use la Production URL.
 
## Troubleshooting
 
### Qdrant no responde
 
```bash
docker ps
```
 
Desde n8n, cuando Qdrant corre en Docker, la conexión usa:
 
```
http://host.docker.internal:6333
```
 
### La colección `cursos` no existe
 
Ejecutar el workflow `guardar-qdrant.json` para crearla y poblarla.
 
### La consulta llega a n8n pero no hay recomendación
 
Comprobar en orden:
 
1. Existencia de la colección `cursos` en Qdrant.
2. Cursos activos en MySQL.
3. Embeddings almacenados en Qdrant.
4. Resultados devueltos por la búsqueda semántica.
5. Respuesta del LLM.
6. Registro de la recomendación en el backend (ver [`backend/README.md`](../backend/README.md)).
