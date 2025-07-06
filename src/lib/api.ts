// URL base da API - usa a variável de ambiente
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Modo de API - "proxy" ou "direct"
export const API_MODE = process.env.NEXT_PUBLIC_API_MODE || "proxy";

// URL base para o proxy local
export const PROXY_URL = "/api/proxy"; 

import { CadastroUsuario, Usuario } from "@/types/usuario";

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
  // Garantir que o role seja mantido
  const role = dados.role || "STUDENT";
  console.log("Role original no cadastro:", role);
  
  // Mapeando os nomes dos campos para o formato esperado pelo backend
  const dadosParaEnvio = {
    name: dados.name,
    email: dados.email,
    password: dados.password,
    graduation: dados.graduation,
    role: role
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
    } catch {
      // Se não conseguir analisar a resposta como JSON
      const text = await response.text().catch(() => "");
      console.error("Resposta não-JSON:", text);
      throw new Error("Erro ao conectar com o servidor");
    }
  }

  const userData = await response.json();
  console.log("Resposta da API após cadastro:", userData);
  console.log("Role na resposta da API:", userData.role);
  
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
    // Se receber um 401 (Não autorizado), apenas lança o erro, não desloga
    const errorData = await response.json().catch(() => ({}));
    let errorMsg = errorData.message || `Erro na requisição: ${response.status}`;
    if (errorMsg === 'Invalid or missing token') {
      errorMsg = 'E-mail não existe ou erro inesperado';
    }
    throw new Error(errorMsg);
  }

  // Tenta parsear como JSON, se falhar retorna como texto
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
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

// Função para solicitar recuperação de senha
export async function solicitarRecuperacaoSenha(email: string): Promise<void> {
  const response = await fetch(getApiUrl('/auth/request-password-reset'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erro ao solicitar recuperação de senha');
  }
}

// Função para redefinir a senha
export async function redefinirSenha(token: string, newPassword: string): Promise<void> {
  const response = await fetch(getApiUrl('/auth/reset-password'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, newPassword })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erro ao redefinir a senha');
  }
}

// Buscar dilemas do usuário logado
export async function listarDilemasUsuario(): Promise<DilemmaStatusResponseDTO[]> {
  const response = await fetchAutenticado('/dilemmas/me');
  return response as DilemmaStatusResponseDTO[];
}

// Tipagem do retorno
export interface DilemmaStatusResponseDTO {
  idDilemma: number;
  title: string;
  professorId: string;
  invitationStatus: string;
  isClosed: boolean;
  closedAt: string | null;
}

// Criar dilema
export async function criarDilema({ title, professorId }: { title: string; professorId: string }): Promise<DilemmaStatusResponseDTO> {
  const response = await fetchAutenticado('/dilemmas', {
    method: 'POST',
    body: JSON.stringify({ title, professorId }),
  });
  return response as DilemmaStatusResponseDTO;
}

// Responder convite
export async function responderConvite({ chatId, response }: { chatId: number; response: 'ACCEPTED' | 'DECLINED' }): Promise<{ success: boolean }> {
  const res = await fetchAutenticado('/invitations/respond', {
    method: 'POST',
    body: JSON.stringify({ chatId, response }),
  });
  return res as { success: boolean };
}

// Convidar usuário para um chat
export async function convidarUsuarioParaChat({ email, chatId }: { email: string; chatId: number }): Promise<{ success: boolean }> {
  const res = await fetchAutenticado('/invitations/invite', {
    method: 'POST',
    body: JSON.stringify({ email, chatId }),
  });
  return res as { success: boolean };
} 

export interface ParticipantDTO {
  userId: string
  userName: string
  email: string
  invitationStatus: string
  joinedAt: string
  score: number
}

export async function listParticipants(dilemmaId: number): Promise<ParticipantDTO[]> {
  const token = localStorage.getItem("token") || ""
  const res = await fetch(`/api/dilemmas/${dilemmaId}/participants`, {
    headers: { Authorization: token }
  })
  if (!res.ok) throw new Error("Erro ao listar participantes")
  return res.json()
}

export async function removeParticipant(dilemmaId: number, userId: string): Promise<void> {
  const token = localStorage.getItem("token") || ""
  const res = await fetch(
    `/api/dilemmas/${dilemmaId}/participants/${userId}`,
    { method: "DELETE", headers: { Authorization: token } }
  )
  if (!res.ok) throw new Error("Erro ao remover participante")
}