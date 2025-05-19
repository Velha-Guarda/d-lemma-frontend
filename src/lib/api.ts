// URL base da API - usa a variável de ambiente se disponível
export const API_URL = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL 
  ? process.env.NEXT_PUBLIC_API_URL 
  : "http://localhost:8080/api"; // URL padrão como fallback

import { CadastroUsuario, Usuario, AuthResponse } from "@/types/usuario";

// Função para fazer o cadastro de usuário
export async function cadastrarUsuario(dados: CadastroUsuario): Promise<Usuario> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao cadastrar usuário");
  }

  return await response.json();
}

// Função para fazer login
export async function loginUsuario(dados: {
  email: string;
  senha: string;
}): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao fazer login");
  }

  const data = await response.json();
  
  // Verifica se há um token JWT na resposta e o armazena
  if (data.token) {
    localStorage.setItem('authToken', data.token);
  }
  
  return data;
}

// Função para fazer requisições autenticadas
export async function fetchAutenticado(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('authToken');
  
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Se receber um 401 (Não autorizado), provavelmente o token expirou
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      // Redirecionar para login em aplicações cliente-side
      if (typeof window !== 'undefined') {
        window.location.href = '/login?expired=true';
      }
    }
    
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erro na requisição: ${response.status}`);
  }

  return await response.json();
}

// Função para verificar se o usuário está autenticado
export function isAutenticado(): boolean {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('authToken');
  return !!token;
}

// Função para fazer logout
export function logout() {
  localStorage.removeItem('authToken');
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
} 