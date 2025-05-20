// URL base da API - usa a variável de ambiente
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Modo de API - "proxy" ou "direct"
export const API_MODE = process.env.NEXT_PUBLIC_API_MODE || "proxy";

// URL base para o proxy local
export const PROXY_URL = "/api/proxy"; 

import { CadastroUsuario, Usuario, AuthResponse } from "@/types/usuario";

// Função utilitária para determinar a URL base
function getApiUrl(endpoint: string): string {
  // Em modo proxy (desenvolvimento), usamos o proxy local
  if (API_MODE === "proxy") {
    return `/api${endpoint}`;
  }
  
  // Em modo direto (produção), usamos a URL completa da API
  return `${API_URL}${endpoint}`;
}

// Função para fazer o cadastro de usuário
export async function cadastrarUsuario(dados: CadastroUsuario): Promise<Usuario> {
  // Mapeando os nomes dos campos para o formato esperado pelo backend
  const dadosParaEnvio = {
    name: dados.name,
    email: dados.email,
    password: dados.password,
    graduation: dados.graduation,
    role: dados.role || "STUDENT"
  };
  
  console.log('Dados para envio:', dadosParaEnvio);
  
  // Usando a URL apropriada para o ambiente
  const response = await fetch(getApiUrl('/auth/register'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dadosParaEnvio)
  });

  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao cadastrar usuário");
    } catch (e) {
      // Se não conseguir analisar a resposta como JSON
      const text = await response.text().catch(() => "");
      console.error("Resposta não-JSON:", text);
      throw new Error("Erro ao conectar com o servidor");
    }
  }

  const userData = await response.json();
  
  // Se o cadastro retornar um token, armazenar
  if (userData.token) {
    localStorage.setItem('authToken', userData.token);
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  return userData;
}

// Função para fazer login
export async function loginUsuario(dados: {
  email: string;
  senha: string;
}): Promise<Usuario> {
  // Adaptando os dados para o formato esperado pelo backend
  const dadosParaEnvio = {
    email: dados.email, 
    password: dados.senha
  };

  // Usando a URL apropriada para o ambiente
  const response = await fetch(getApiUrl('/auth/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(API_MODE === "proxy" ? dados : dadosParaEnvio)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao fazer login");
  }

  const userData = await response.json();
  
  // Verifica se há um token JWT na resposta e o armazena
  if (userData.token) {
    localStorage.setItem('authToken', userData.token);
    localStorage.setItem('userData', JSON.stringify(userData));
  }
  
  return userData;
}

// Função para fazer requisições autenticadas
export async function fetchAutenticado(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('authToken');
  
  // Determina a URL alvo com base no ambiente
  const targetUrl = url.startsWith('http') ? url : getApiUrl(url);
  
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };

  const response = await fetch(targetUrl, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Se receber um 401 (Não autorizado), provavelmente o token expirou
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
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
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  
  window.location.href = '/login';
} 