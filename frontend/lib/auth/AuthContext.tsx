"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useSyncExternalStore } from "react";
import { api, UserData } from "@/lib/api/service";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (correo: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => void;
  userName: string | null;
  getUserId: () => number | null;
}

interface RegisterData {
  nombre: string;
  correo: string;
  contrasenia: string;
  experiencia: string;
  areaInteres?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function createAuthStore() {
  let user: UserData | null = null;
  const subscribers = new Set<() => void>();

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("rutaia_user");
    if (stored) {
      try {
        user = JSON.parse(stored);
      } catch {
        user = null;
      }
    }
  }

  return {
    getSnapshot: () => user,
    getServerSnapshot: () => null,
    subscribe: (callback: () => void) => {
      subscribers.add(callback);
      return () => subscribers.delete(callback);
    },
    setUser: (newUser: UserData | null) => {
      user = newUser;
      subscribers.forEach((cb) => cb());
    },
  };
}

const authStore = createAuthStore();

async function fetchUserDetails(idUsuario: number): Promise<UserData> {
  try {
    const userDetails = await api.getUsuario(idUsuario);
    return {
      idUsuario: userDetails.idUsuario,
      role: userDetails.role,
      nombre: userDetails.nombre,
      correo: userDetails.correo,
      experiencia: userDetails.experiencia || "PRINCIPIANTE",
    };
  } catch {
    return {
      idUsuario,
      role: "ESTUDIANTE",
      nombre: "Usuario",
      correo: "",
      experiencia: "PRINCIPIANTE",
    };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useSyncExternalStore(
    authStore.subscribe,
    authStore.getSnapshot,
    authStore.getServerSnapshot
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const refreshUser = useCallback(() => {
    const userData = api.getUser();
    if (userData?.idUsuario) {
      fetchUserDetails(userData.idUsuario).then((fullUser) => {
        authStore.setUser(fullUser);
      });
    } else {
      authStore.setUser(userData);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 150);
    return () => clearTimeout(timer);
  }, []);

  const login = async (correo: string, password: string) => {
    const response = await api.login(correo, password);
    const userData = await fetchUserDetails(response.idUsuario);
    authStore.setUser(userData);
  };

  const register = async (data: RegisterData) => {
    const response = await api.register(data);
    const userData = await fetchUserDetails(response.idUsuario);
    authStore.setUser(userData);
  };

  const logout = () => {
    api.logout();
    authStore.setUser(null);
    router.push("/");
  };

  const getUserId = () => user?.idUsuario || null;

  const userName = user?.nombre || null;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, refreshUser, userName, getUserId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}