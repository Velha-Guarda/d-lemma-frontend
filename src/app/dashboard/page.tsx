"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Heart, User, Monitor, Trophy } from "lucide-react"
import { listarDilemasUsuario, DilemmaStatusResponseDTO } from "@/lib/api"

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [dilemas, setDilemas] = useState<DilemmaStatusResponseDTO[]>([])
  const [loadingDilemas, setLoadingDilemas] = useState(true)
  const [erroDilemas, setErroDilemas] = useState<string | null>(null)

  useEffect(() => {
    // Log para debug do objeto user
    console.log("Objeto user no dashboard:", user);

    // Redirecionar para login se não estiver autenticado
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }

    if (!isLoading && isAuthenticated) {
      setLoadingDilemas(true)
      listarDilemasUsuario()
        .then(setDilemas)
        .catch((err) => setErroDilemas(err instanceof Error ? err.message : 'Erro ao buscar dilemas'))
        .finally(() => setLoadingDilemas(false))
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
            {loadingDilemas ? (
              <div className="col-span-3 text-center text-white text-xl">Carregando dilemas...</div>
            ) : erroDilemas ? (
              <div className="col-span-3 text-center text-red-400 text-xl">{erroDilemas}</div>
            ) : dilemas.length === 0 ? (
              <div className="col-span-3 text-center text-white text-xl">Nenhum dilema encontrado.</div>
            ) : (
              dilemas.map((dilema) => (
                <div key={dilema.idDilemma} className="bg-white rounded-xl p-6 shadow-lg relative">
                  {/* Heart Icon */}
                  <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  {/* Dilema Title */}
                  <h3 className="text-[#000000] font-bold text-3xl mb-4">{dilema.title}</h3>
                  <div className="flex justify-between mt-20">
                    {/* Status Section */}
                    <div className="mb-6">
                      <div className="text-base font-semibold text-[#000000]">
                        Status: {dilema.invitationStatus === 'ACCEPTED' ? 'Aceito' : dilema.invitationStatus}
                      </div>
                      <div className="text-gray-500 text-sm">{dilema.isClosed ? 'Encerrado' : 'Aberto'}</div>
                    </div>
                    {/* Visualizar Button */}
                    <div className="flex justify-end">
                      <Button className="bg-[#2D4A77] hover:bg-[#4B5563] text-white text-1xl px-4 py-2 w-28 h-9">
                        Visualizar
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 