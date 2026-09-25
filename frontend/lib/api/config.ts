export const CONFIG = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  N8N_WEBHOOK_URL: process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "https://n8n.example.com/webhook/consulta",
  STORAGE_KEYS: {
    TOKEN: "rutaia_token",
    USER: "rutaia_user",
  },
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
    },
    USUARIOS: "/api/usuarios",
    CURSOS: "/api/cursos",
    CATEGORIAS: "/api/categorias",
    CONSULTAS: "/api/consultas",
    RECOMENDACIONES: "/api/recomendaciones",
    FUENTES: "/api/fuentes",
    CALIFICACIONES: "/api/calificaciones",
    STATS: "/api/stats",
    ENUMS: {
      DIFICULTADES: "/api/enums/dificultades",
      ROLES: "/api/enums/roles",
      EXPERIENCIAS: "/api/enums/experiencias",
      ESTADOS: "/api/enums/estados",
    },
  },
};