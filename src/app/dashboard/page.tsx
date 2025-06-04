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
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Se quiser forçar redirecionamento para /login, descomente:
    // if (!isLoading && !isAuthenticated) {
    //   router.push('/login')
    // }
  }, [isLoading, isAuthenticated, router])

  // Se preferir pular autenticação localmente, comente também:
  // if (isLoading) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center bg-[#2D4A6B]">
  //       <p className="text-xl text-white">Carregando...</p>
  //     </div>
  //   )
  // }
  // if (!isAuthenticated || !user) {
  //   return null
  // }
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

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

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
        {/* Background da página */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/images/background.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* Conteúdo do Dashboard */}
        <div className="relative z-10 p-20 mt-10">
          {/* Header */}
          <div className="flex items-center mb-8">
            <h1 className="text-white text-6xl font-bold drop-shadow-lg mr-10">Seus dLemmas</h1>
            <Button
              onClick={openModal}
              className="bg-white text-[#2D4A6B] hover:bg-gray-100 font-medium px-6 text-2xl h-12"
            >
              📝 Novo Dilema
            </Button>
          </div>

          {/* Grid de Dilemas */}
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

        {/* ================= POPUP (MODAL) ================= */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            {/* Container Principal do Popup, agora com backgroundImage */}
            <div
              className="
                relative
                w-[890px] h-[400px]
                rounded-[10px]
                border-[7px] border-[#2D4A77]
              "
              style={{
                backgroundImage: 'url(/images/background.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              {/* Fundo Interno Menor */}
              <div
                className="
                  absolute
                  left-[65px] top-[46px]
                  w-[763px] h-[168px]
                  bg-[#2D4A77]
                  rounded-[20px]
                "
              />

              {/* Texto “Título” */}
              <div
                className="
                  absolute
                  left-[95px] top-[64px]
                  text-white text-[20px] font-bold
                "
                style={{
                  fontFamily: "Poppins, sans-serif",
                  width: "190px",
                  height: "29px",
                  lineHeight: "29px",
                }}
              >
                Título
              </div>

              {/* Campo de Input */}
              <input
                type="text"
                placeholder="Crie um Dlemma ou sorteie um tema com a caixa de pandora"
                className="
                  absolute
                  left-[97px] top-[93px]
                  w-[706px] h-[50px]
                  bg-white
                  rounded-[5px]
                  px-4
                  text-[15px] font-medium text-black
                "
                style={{ fontFamily: "Poppins, sans-serif" }}
              />

              {/* Botão “Sortear com Caixa de Pandora” (233×37) */}
              <button
                className="
                  absolute
                  left-[329px] top-[163px]
                  w-[233px] h-[37px]
                  bg-[#00173B]
                  rounded-[10px]
                  flex items-center justify-center gap-1
                  whitespace-nowrap
                  cursor-pointer
                "
                // onClick para a ação de sortear, se necessário
              >
                {/* Ícone 29×29 */}
                <Image
                  src="/images/dm.png"   // caminho da sua imagem 29×29
                  alt="Ícone Sortear"
                  width={29}
                  height={29}
                  className="flex-shrink-0"
                />
                {/* Texto reduzido para não quebrar */}
                <span
                  className="text-[11px] font-medium text-white leading-none"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Sortear com Caixa de Pandora
                </span>
              </button>

              {/* Botão “Criar Dilema” dentro do popup (205×71) */}
              <button
                className="
                  absolute
                  left-[343px] top-[229px]
                  w-[205px] h-[71px]
                  bg-[#FBF9F9]
                  rounded-[5px]
                  flex items-center justify-center gap-1
                  cursor-pointer
                "
                // onClick para criar o dilema, se necessário
              >
                {/* Ícone 33×71 */}
                <Image
                  src="/images/Add New.png"   // caminho da sua imagem 33×71
                  alt="Ícone +"
                  width={33}
                  height={71}
                  className="flex-shrink-0"
                />
                {/* Texto */}
                <span
                  className="text-[22px] font-semibold text-black leading-none"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Criar Dilema
                </span>
              </button>

              {/* Botão de Saída (ícone da portinha, 82×54) */}
              <div className="absolute left-[404px] top-[315px] w-[82px] h-[54px] cursor-pointer">
                <Image
                  src="/images/ClosePane.png" // caminho da sua imagem 82×54
                  alt="Fechar Popup"
                  width={82}
                  height={54}
                  onClick={closeModal}
                />
              </div>
            </div>
          </div>
        )}
        {/* ================================================ */}
      </div>
    </div>
  )
}
