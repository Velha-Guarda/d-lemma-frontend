"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Heart, User, BarChart3, Settings, MapPin, Monitor, Trophy } from "lucide-react"

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Log para debug do objeto user
    console.log("Objeto user no dashboard:", user);

    // Redirecionar para login se não estiver autenticado
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router, user])

  // Mostra um loader enquanto verifica a autenticação
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#2D4A6B]">
        <p className="text-xl text-white">Carregando...</p>
      </div>
    )
  }

  // Se o usuário não estiver autenticado, não renderiza nada (o useEffect vai redirecionar)
  if (!isAuthenticated || !user) {
    return null
  }

  // Função para converter o role para um formato amigável
  const formatRole = (role: string): string => {
    if (!role) return '';

    switch (role.toUpperCase()) {
      case 'PROFESSOR':
        return 'Professor';
      case 'STUDENT':
        return 'Estudante';
      default:
        return role;
    }
  };

  // Função para formatar o nome do curso
  const formatGraduation = (graduation: string): string => {
    if (!graduation) return '';

    // Mapear cursos específicos que precisam de tratamento especial
    const coursesMap: Record<string, string> = {
      'ciencia_computacao': 'Ciência da Computação',
      'engenharia_software': 'Engenharia de Software',
      'sistemas_informacao': 'Sistemas de Informação',
      'analise_sistemas': 'Análise e Desenvolvimento de Sistemas',
      'engenharia_computacao': 'Engenharia da Computação',
      'engenharia_civil': 'Engenharia Civil',
      'engenharia_mecanica': 'Engenharia Mecânica',
      'engenharia_eletrica': 'Engenharia Elétrica',
      'engenharia_quimica': 'Engenharia Química',
      'gestao_ambiental': 'Gestão Ambiental',
      'educacao_fisica': 'Educação Física'
    };

    // Se o curso está no mapeamento, retorna o valor formatado
    if (graduation in coursesMap) {
      return coursesMap[graduation];
    }

    // Caso contrário, formata substituindo underscores por espaços
    // e colocando primeira letra de cada palavra em maiúsculo
    return graduation
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-80 bg-[#2D4A77] flex flex-col items-center py-8">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="relative mb-4">
            <Image
              src="/images/logodlemma.png"
              alt="D-LEMMA Logo"
              width={128}
              height={128}

            />
          </div>
        </div>

        {/* Menu */}
        <div className="w-full px-6">
          <div className="mb-6">
            <h3 className="text-white/80 text-sm font-medium mb-4">Menu Principal</h3>
          </div>

          <nav className="space-y-3">
            <button className="flex items-center gap-4 w-full p-3 text-white hover:bg-white/10 rounded-lg transition-colors text-left">
              <Monitor className="w-5 h-5" />
              <span className="font-medium">dLemmas</span>
            </button>

            <button className="flex items-center gap-4 w-full p-3 text-white hover:bg-white/10 rounded-lg transition-colors text-left">
              <Heart className="w-5 h-5" />
              <span className="font-medium">Favoritos</span>
            </button>

            <button className="flex items-center gap-4 w-full p-3 text-white hover:bg-white/10 rounded-lg transition-colors text-left">
              <User className="w-5 h-5" />
              <span className="font-medium">Perfil</span>
            </button>

            <button className="flex items-center gap-4 w-full p-3 text-white hover:bg-white/10 rounded-lg transition-colors text-left">
              <Trophy className="w-5 h-5" />
              <span className="font-medium">Ranking</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/images/background.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>

        {/* Content with overlay */}
        <div className="relative z-10 p-20 mt-10">
          {/* Header */}
          <div className="flex items-center mb-8">
            <h1 className="text-white text-6xl font-bold drop-shadow-lg mr-10">Seus dLemmas</h1>
            <Button className="bg-white text-[#2D4A6B] hover:bg-gray-100 font-medium px-6 text-2xl h-12">
              📝 Novo Dilema
            </Button>
          </div>

          {/* Dilemas Grid */}
          <div className="grid grid-cols-3 gap-6">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg relative">
                {/* Heart Icon */}
                <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>

                {/* Dilema Title */}
                <h3 className="text-[#000000] font-bold text-3xl mb-4">Dilema 01</h3>

                <div className="flex justify-between mt-20">
                  {/* Comments Section */}
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-[#000000]">22</div>
                    <div className="text-gray-500 text-sm">Respostas</div>
                  </div>

                  {/* Visualizar Button */}
                  <div className="flex justify-end">
                    <Button className="bg-[#2D4A77] hover:bg-[#4B5563] text-white text-1xl px-4 py-2 w-28 h-9">
                      Visualizar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 