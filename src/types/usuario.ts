// Interface de dados do usuário para cadastro
export interface CadastroUsuario {
  name: string;
  email: string;
  password: string;
  graduation: string;
  role?: string;
}

// Interface para dados do usuário após login
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  graduation: string;
  role: string; // ex: 'ALUNO', 'PROFESSOR', 'ADMIN'
  token: string;
}

// Interface para resposta de autenticação
export interface AuthResponse {
  usuario: Usuario;
  token: string;
  refreshToken?: string;
} 