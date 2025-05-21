"use client"

import { createContext, useContext, ReactNode, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Usuario } from "@/types/usuario"
import { loginUsuario, isAutenticado, logout } from "@/lib/api"

type AuthContextType = {
  user: Usuario | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, senha: string) => Promise<void>
  logout: () => void
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<Usuario | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Verificar autenticação ao carregar a página
  useEffect(() => {
    // Função para verificar se o usuário já está autenticado
    async function checkAuth() {
      if (isAutenticado()) {
        try {
          // Recuperar dados do usuário do localStorage
          const userDataString = localStorage.getItem('userData')
          if (userDataString) {
            const userData = JSON.parse(userDataString)
            console.log("Dados recuperados do localStorage:", userData);
            console.log("Role recuperado do localStorage:", userData.role);
            setUser(userData)
          }
        } catch (error) {
          console.error("Erro ao recuperar dados do localStorage:", error);
          // Se houver erro, faz logout
          logout()
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [])
  
  // Função para normalizar os dados do usuário
  function normalizeUserData(data: Usuario | Record<string, unknown>): Usuario {
    console.log("Dados recebidos para normalização:", data);
    
    // Extrair o role do token JWT, se disponível
    let roleFromToken: string | undefined;
    if (typeof data.token === 'string') {
      try {
        // O token JWT tem três partes separadas por pontos
        const tokenParts = data.token.split('.');
        if (tokenParts.length === 3) {
          // A segunda parte do token (índice 1) contém os dados (payload)
          const payload = JSON.parse(atob(tokenParts[1]));
          roleFromToken = payload.role;
          console.log("Role extraído do token:", roleFromToken);
        }
      } catch (error) {
        console.error("Erro ao extrair role do token:", error);
      }
    }
    
    // Se a resposta tiver a estrutura { user: {...}, token: "..." }
    if ('user' in data && 'token' in data && typeof data.user === 'object') {
      const user = data.user as Record<string, unknown>;
      console.log("Estrutura user encontrada:", user);
      const role = user.role as string || roleFromToken;
      console.log("Role final a ser usado:", role);
      
      return {
        id: user.id as string | number,
        nome: (user.name as string) || (user.nome as string),
        name: user.name as string,
        email: user.email as string,
        graduation: user.graduation as string,
        role: role || "STUDENT", // Usar role do token se não estiver no objeto
        token: data.token as string
      };
    }
    
    // Se a resposta for o próprio usuário
    const role = (data.role as string) || roleFromToken;
    console.log("Role final a ser usado:", role);
    
    return {
      id: data.id as string | number,
      nome: (data.name as string) || (data.nome as string),
      name: data.name as string,
      email: data.email as string,
      graduation: data.graduation as string, 
      role: role || "STUDENT", // Usar role do token se não estiver no objeto
      token: data.token as string
    };
  }
  
  // Função de login
  async function handleLogin(email: string, senha: string) {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await loginUsuario({ email, senha })
      
      // Normalizar os dados do usuário
      const userData = normalizeUserData(response)
      
      // Salvar dados do usuário no localStorage
      localStorage.setItem('userData', JSON.stringify(userData))
      setUser(userData)
      
      // Redirecionar para dashboard após login bem-sucedido
      router.push('/dashboard')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Erro ao fazer login')
      }
      console.error('Erro de login:', err)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Função de logout
  function handleLogout() {
    logout() // Usa a função de logout da API
    setUser(null)
    router.push('/login')
  }
  
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: handleLogin,
    logout: handleLogout,
    error
  }
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
} 