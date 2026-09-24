export const CONFIG = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  STORAGE_KEYS: {
    TOKEN: "rutaia_token",
    USER: "rutaia_user",
  },
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
    },
    USUARIOS: "/api/usuarios",
    CURSOS: "/api/cursos",
    CATEGORIAS: "/api/categorias",
    CONSULTAS: "/api/consultas",
    RECOMENDACIONES: "/api/recomendaciones",
    FUENTES: "/api/fuentes",
    CALIFICACIONES: "/api/calificaciones",
    ENUMS: {
      DIFICULTADES: "/api/enums/dificultades",
      ROLES: "/api/enums/roles",
      EXPERIENCIAS: "/api/enums/experiencias",
      ESTADOS: "/api/enums/estados",
    },
  },
};