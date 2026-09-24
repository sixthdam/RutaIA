import { CONFIG } from "./config";

interface RequestOptions extends RequestInit {
  auth?: boolean;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = CONFIG.API_BASE_URL;
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
  }

  private setToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, token);
  }

  private clearToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
  }

  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { auth = true, headers, ...fetchOptions } = options;
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      ...fetchOptions,
      headers: {
        ...this.getHeaders(auth),
        ...headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 401 && auth) {
        this.clearToken();
        if (typeof window !== "undefined") {
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.href = "/login";
        }
        throw new Error("Sesión expirada. Por favor inicia sesión nuevamente.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        (error as Error & { status?: number; data?: unknown }).status = response.status;
        (error as Error & { status?: number; data?: unknown }).data = errorData;
        throw error;
      }

      if (response.status === 204) {
        return null as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("No se pudo conectar al servidor. Verifica tu conexión.");
      }
      throw error;
    }
  }

  get<T>(endpoint: string, auth = true): Promise<T> {
    return this.request<T>(endpoint, { method: "GET", auth });
  }

  post<T>(endpoint: string, data: unknown, auth = true): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      auth,
    });
  }

  put<T>(endpoint: string, data: unknown, auth = true): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
      auth,
    });
  }

  delete<T>(endpoint: string, auth = true): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE", auth });
  }

  async login(correo: string, password: string): Promise<LoginResponse> {
    const data = await this.post<LoginResponse>(CONFIG.ENDPOINTS.AUTH.LOGIN, { correo, password }, false);
    if (data.token) {
      this.setToken(data.token);
      if (typeof window !== "undefined") {
        localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify({
          idUsuario: data.idUsuario,
          role: data.role,
          nombre: "",
          correo: "",
        }));
      }
    }
    return data;
  }

  async register(usuario: RegisterRequest): Promise<AuthResponse> {
    return this.post<AuthResponse>(CONFIG.ENDPOINTS.AUTH.REGISTER, usuario, false);
  }

  logout(): void {
    this.clearToken();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUser(): UserData | null {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  }

  getUserRole(): string | null {
    const user = this.getUser();
    return user?.role || null;
  }

  getUserId(): number | null {
    const user = this.getUser();
    return user?.idUsuario || null;
  }

  getUserName(): string | null {
    const user = this.getUser();
    return user?.nombre || null;
  }

  async getDificultades(): Promise<string[]> {
    return this.get<string[]>(CONFIG.ENDPOINTS.ENUMS.DIFICULTADES);
  }

  async getRoles(): Promise<string[]> {
    return this.get<string[]>(CONFIG.ENDPOINTS.ENUMS.ROLES);
  }

  async getExperiencias(): Promise<string[]> {
    return this.get<string[]>(CONFIG.ENDPOINTS.ENUMS.EXPERIENCIAS);
  }

  async getEstados(): Promise<string[]> {
    return this.get<string[]>(CONFIG.ENDPOINTS.ENUMS.ESTADOS);
  }

  async getUsuario(id: number): Promise<UserResponse> {
    return this.get<UserResponse>(`${CONFIG.ENDPOINTS.USUARIOS}/${id}`);
  }

  async getCursos(): Promise<Course[]> {
    return this.get<Course[]>(CONFIG.ENDPOINTS.CURSOS);
  }

  async getCurso(id: number): Promise<Course> {
    return this.get<Course>(`${CONFIG.ENDPOINTS.CURSOS}/${id}`);
  }

  async getCursosByCategoria(categoriaId: number): Promise<Course[]> {
    return this.get<Course[]>(`${CONFIG.ENDPOINTS.CURSOS}?categoriaId=${categoriaId}`);
  }

  async getCursosByDificultad(dificultad: string): Promise<Course[]> {
    return this.get<Course[]>(`${CONFIG.ENDPOINTS.CURSOS}?dificultad=${dificultad}`);
  }

  async getCategorias(): Promise<Category[]> {
    return this.get<Category[]>(CONFIG.ENDPOINTS.CATEGORIAS);
  }

  async createConsulta(consulta: ConsultaRequest): Promise<ConsultaResponse> {
    return this.post<ConsultaResponse>(CONFIG.ENDPOINTS.CONSULTAS, consulta);
  }

  async getConsultas(): Promise<ConsultaResponse[]> {
    return this.get<ConsultaResponse[]>(CONFIG.ENDPOINTS.CONSULTAS);
  }

  async getConsulta(id: number): Promise<ConsultaResponse> {
    return this.get<ConsultaResponse>(`${CONFIG.ENDPOINTS.CONSULTAS}/${id}`);
  }

  async getConsultasByUsuario(idUsuario: number): Promise<ConsultaResponse[]> {
    return this.get<ConsultaResponse[]>(`${CONFIG.ENDPOINTS.CONSULTAS}?idUsuario=${idUsuario}`);
  }

  async getRecomendaciones(): Promise<Recommendation[]> {
    return this.get<Recommendation[]>(CONFIG.ENDPOINTS.RECOMENDACIONES);
  }

  async getRecomendacion(id: number): Promise<Recommendation> {
    return this.get<Recommendation>(`${CONFIG.ENDPOINTS.RECOMENDACIONES}/${id}`);
  }

  async getRecomendacionByConsulta(idConsulta: number): Promise<Recommendation> {
    return this.get<Recommendation>(`${CONFIG.ENDPOINTS.CONSULTAS}/${idConsulta}/recomendacion`);
  }

  async getFuentesByRecomendacion(idRecomendacion: number): Promise<Source[]> {
    return this.get<Source[]>(`${CONFIG.ENDPOINTS.FUENTES}/recomendacion/${idRecomendacion}`);
  }

  async createCalificacion(calificacion: CalificacionRequest): Promise<CalificacionResponse> {
    return this.post<CalificacionResponse>(CONFIG.ENDPOINTS.CALIFICACIONES, calificacion);
  }

  async getCalificacion(idRecomendacion: number): Promise<CalificacionResponse> {
    return this.get<CalificacionResponse>(`${CONFIG.ENDPOINTS.CALIFICACIONES}/${idRecomendacion}`);
  }

  async getCalificaciones(): Promise<CalificacionResponse[]> {
    return this.get<CalificacionResponse[]>(CONFIG.ENDPOINTS.CALIFICACIONES);
  }

  async getStats(): Promise<StatsResponse> {
    return this.get<StatsResponse>(CONFIG.ENDPOINTS.STATS);
  }

  // n8n integration
  async triggerN8n(payload: N8nPayload): Promise<N8nResponse> {
    const response = await fetch(CONFIG.N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || (Array.isArray(data) && data[0]?.estado === "error") || data.estado === "error") {
      const errorData = Array.isArray(data) ? data[0] : data;
      throw new Error(JSON.stringify(errorData));
    }

    return data as N8nResponse;
  }
}

export const api = new ApiService();
export { CONFIG } from "./config";

export interface LoginResponse {
  token: string;
  idUsuario: number;
  role: string;
}

export type AuthResponse = LoginResponse;

export interface RegisterRequest {
  nombre: string;
  correo: string;
  contrasenia: string;
  experiencia: string;
  areaInteres?: string;
}

export interface UserData {
  idUsuario: number;
  role: string;
  nombre: string;
  correo: string;
  experiencia: string;
}

export interface UserResponse {
  idUsuario: number;
  nombre: string;
  correo: string;
  experiencia: string;
  areaInteres?: string;
  role: string;
  fechaRegistro: string;
}

export interface Course {
  idCurso: number;
  nombre: string;
  descripcion: string;
  categoria: Category;
  dificultad: string;
  duracion: number;
  activo: boolean;
  url?: string;
}

export interface Category {
  idCategoria: number;
  nombre: string;
}

export interface ConsultaRequest {
  idUsuario: number;
  pregunta: string;
  fecha?: string;
  estado?: string;
}

export interface ConsultaResponse {
  idConsulta: number;
  usuario: UserResponse;
  pregunta: string;
  fecha: string;
  estado: string;
}

export interface Recommendation {
  idRecomendacion: number;
  idConsulta: number;
  contenido: string;
  fechaGeneracion: string;
}

export interface Source {
  idFuente: number;
  idRecomendacion: number;
  idCurso: number;
  similitud: number;
  curso?: Course;
}

export interface CalificacionRequest {
  idRecomendacion: number;
  calificacion: number;
  comentario?: string;
}

export interface CalificacionResponse {
  idRecomendacion: number;
  recomendacion: Recommendation;
  calificacion: number;
  comentario?: string;
  fecha?: string;
}

export interface StatsResponse {
  totalConsultas: number;
  consultasRespondidas: number;
  consultasSinResultados: number;
  calificacionPromedio: number;
  cursoMasRecomendado: string;
  distribucionEstados: Record<string, number>;
  actividadReciente: ConsultaResponse[];
}

// n8n types
export interface N8nPayload {
  mensaje: string;
  idConsulta: string;
  idUsuario: string;
  experiencia: string;
}

export interface N8nSuccessResponse {
  ok: true;
  recomienda: boolean;
  mensaje: string;
  contactar_asesor: boolean;
}

export interface N8nErrorResponse {
  estado: "error";
  titulo: string;
  mensaje: string;
  curso: null | unknown;
  accion_recomendada: string;
  puede_reintentar: boolean;
  error_tecnico: string;
}

export type N8nResponse = N8nSuccessResponse | N8nErrorResponse | (N8nSuccessResponse | N8nErrorResponse)[];