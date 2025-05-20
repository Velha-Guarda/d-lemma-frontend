"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    // Redirecionar para login se não estiver autenticado
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])
  
  // Mostra um loader enquanto verifica a autenticação
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl">Carregando...</p>
      </div>
    )
  }
  
  // Se o usuário não estiver autenticado, não renderiza nada (o useEffect vai redirecionar)
  if (!isAuthenticated || !user) {
    return null
  }
  
  // Função para converter o role para um formato amigável
  const formatRole = (role: string): string => {
    switch (role?.toUpperCase()) {
      case 'PROFESSOR':
        return 'Professor';
      case 'STUDENT':
        return 'Estudante';
      default:
        return role || '';
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      {/* Header */}
      <header className="bg-[#203D68] py-4 text-white">
        <div className="container mx-auto flex items-center justify-between px-4">
          <div className="flex items-center">
            <Image 
              src="/images/logodlemma.png"
              alt="D-LEMMA"
              width={50}
              height={50}
              className="mr-3"
            />
            <h1 className="text-xl font-bold">D-LEMMA</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm">Olá, {user.nome || user.name}</span>
            <Button 
              variant="outline" 
              size="sm"
              className="border-white bg-transparent text-white hover:bg-white/20"
              onClick={logout}
            >
              Sair
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-black">Bem-vindo ao D-LEMMA!</h2>
          <p className="mb-2 text-gray-600">Você está logado como:</p>
          
          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            <p className="text-black"><strong>Nome:</strong> {user.nome || user.name}</p>
            <p className="text-black"><strong>Email:</strong> {user.email}</p>
            <p className="text-black"><strong>Curso:</strong> {user.graduation}</p>
            <p className="text-black"><strong>Perfil:</strong> {formatRole(user.role)}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-3 text-xl font-medium text-black">Minhas Discussões</h3>
            <p className="text-gray-600">Acesse as discussões éticas em andamento.</p>
            <Button className="mt-4 bg-[#203D68] text-white">Ver Discussões</Button>
          </div>
          
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-3 text-xl font-medium text-black">Dilemas Éticos</h3>
            <p className="text-gray-600">Explore os dilemas éticos disponíveis.</p>
            <Button className="mt-4 bg-[#203D68] text-white">Explorar Dilemas</Button>
          </div>
          
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-3 text-xl font-medium text-black">Meu Perfil</h3>
            <p className="text-gray-600">Visualize e edite suas informações.</p>
            <Button className="mt-4 bg-[#203D68] text-white">Editar Perfil</Button>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-[#091429] py-4 text-center text-white">
        <p className="text-sm">© {new Date().getFullYear()} D-LEMMA - Todos os direitos reservados</p>
      </footer>
    </div>
  )
} 