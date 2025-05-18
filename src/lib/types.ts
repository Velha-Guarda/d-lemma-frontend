// Tipos de usuário
export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'student' | 'professor' | 'admin';
    course?: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  // Tipos de autenticação
  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
  }
  
  // Tipos para dilemas éticos
  export interface Dilemma {
    id: string;
    title: string;
    description: string;
    area: string[];
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
  }
  
  // Tipos para discussões
  export interface Comment {
    id: string;
    content: string;
    authorId: string;
    author: User;
    dilemmaId: string;
    parentId?: string;
    createdAt: Date;
    updatedAt: Date;
    reactions: Reaction[];
  }
  
  export interface Reaction {
    id: string;
    type: 'like' | 'dislike' | 'heart' | 'thoughtful';
    userId: string;
    commentId: string;
    createdAt: Date;
  }
  
  // Tipos para a Caixa de Pandora
  export interface PandoraBox {
    availableDilemmas: Dilemma[];
    currentDilemma?: Dilemma;
    lastUpdated: Date;
  }
  
  // Tipos para respostas da API
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
  }