import { create } from 'zustand';
import { authAPI } from './api';

interface User {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  perfil: 'admin' | 'passageiro' | 'motorista' | 'cobrador';
  foto?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (cpf: string, senha: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,

  login: async (cpf: string, senha: string) => {
    set({ isLoading: true });
    try {
      const response = await authAPI.login(cpf, senha);
      const { token, usuario } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(usuario));
      
      set({
        user: usuario,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  loadUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    set({ isLoading: true });
    try {
      const response = await authAPI.getProfile();
      const usuario = response.data.data;
      
      localStorage.setItem('user', JSON.stringify(usuario));
      
      set({
        user: usuario,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));

