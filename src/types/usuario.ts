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
  id: string | number;
  nome?: string;
  name?: string; // API pode retornar name em vez de nome
  email: string;
  graduation: string;
  role: string; // ex: 'ALUNO', 'PROFESSOR', 'ADMIN'
  token?: string;
}

// Interface para resposta de autenticação
export interface AuthResponse {
  user: Usuario;
  token: string;
  refreshToken?: string;
} 