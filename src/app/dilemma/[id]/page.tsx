"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { Monitor, Heart, User, Trophy } from "lucide-react"
import { convidarUsuarioParaChat } from "@/lib/api"
import React from "react"
import { useAuth } from "@/contexts/AuthContext"

export default function DilemmaDetailPage({ params }: { params?: Promise<{ id: string }> }) {
  const searchParams = useSearchParams()
  const getParams = useCallback(async () => (params ? await params : undefined), [params]);
  const [id, setId] = useState<string | undefined>(undefined)
  const [titulo, setTitulo] = useState<string>("Título Dilemma")
  const [modalOpen, setModalOpen] = useState(false)
  const [emailConvite, setEmailConvite] = useState("")
  const [loadingConvite, setLoadingConvite] = useState(false)
  const [erroConvite, setErroConvite] = useState<string | null>(null)
  const [sucessoConvite, setSucessoConvite] = useState<string | null>(null)
  const { user, logout } = useAuth()

  useEffect(() => {
    getParams().then(p => setId(p?.id))
  }, [getParams])

  useEffect(() => {
    if (!id) return;
    // 1. Tenta pegar da query string
    const tituloQuery = searchParams.get("titulo")
    if (tituloQuery) {
      setTitulo(tituloQuery)
      // Salva no localStorage para navegação direta depois
      localStorage.setItem(`dilemma-title-${id}`, tituloQuery)
      return
    }
    // 2. Tenta pegar do localStorage
    const tituloLocal = localStorage.getItem(`dilemma-title-${id}`)
    if (tituloLocal) {
      setTitulo(tituloLocal)
    }
  }, [id, searchParams])

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
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
        <div className="w-full px-6 flex-1 flex flex-col">
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
          {/* Botão de logout no final do menu */}
          <div className="mt-auto w-full flex flex-col pb-4">
            <button
              onClick={logout}
              className="w-14 h-14 flex items-center justify-center bg-[#2D4A77] rounded-md hover:bg-[#1A2A4B] transition-colors"
              title="Sair"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="16" rx="2" fill="#2D4A77" stroke="white" />
                <path d="M12 16l4-4-4-4" />
                <path d="M16 12H8" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-[#1A2A4B] px-12 py-6">
          <h1 className="text-white text-4xl font-extrabold tracking-tight overflow-hidden line-clamp-2 max-h-[3.2em] max-w-[500px]">{titulo}</h1>
          {user?.role === 'PROFESSOR' && (
            <div className="flex gap-4">
              <Button className="bg-white px-4 py-2 rounded-lg shadow flex items-center gap-3 border-0 hover:bg-gray-100" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                <span className="flex items-center justify-center w-6 h-6 bg-[#2e4f92] rounded-md">
                  <span className="text-white text-xl font-bold" style={{ lineHeight: '1' }} >+</span>
                </span>
                <span className="text-black text-2xl font-extrabold" style={{ fontFamily: 'Poppins, sans-serif' }}>Iniciar Chat</span>
              </Button>

              <Button
                className="bg-white text-[#1A2A4B] font-semibold px-6 py-2 rounded-lg shadow hover:bg-gray-100 text-2xl flex items-center gap-3"
                onClick={() => {
                  setErroConvite(null)
                  setModalOpen(true)
                }}
              >
                <span className="flex items-center justify-center w-6 h-6 bg-[#2e4f92] rounded-md">
                  <span className="text-white text-xl font-bold" style={{ lineHeight: '1' }} >+</span>
                </span>
                <span className="text-black text-2xl font-extrabold" style={{ fontFamily: 'Poppins, sans-serif' }}>Adicionar Participantes</span>
              </Button>

              <Button className="bg-white text-[#1A2A4B] font-semibold px-6 py-2 rounded-lg shadow hover:bg-gray-100 text-2xl">
                <span className="flex items-center justify-center w-6 h-6 bg-[#2e4f92] rounded-md">
                  <span className="text-white text-xl font-bold" style={{ lineHeight: '1' }} >+</span>
                </span>
                <span className="text-black text-2xl font-extrabold" style={{ fontFamily: 'Poppins, sans-serif' }}>Encerrar Dlemma</span>
              </Button>
            </div>
          )}
        </header>

        {/* Chat area (mock) */}
        <section className="flex-1 flex flex-col bg-white mx-8 my-6 rounded-lg shadow p-8">
          {/* Mensagens mockadas */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col">
              <span className="bg-[#31446B] text-white px-4 py-2 rounded-lg w-fit font-semibold">Gil: Primeira Mensagem do dilema</span>
              <span className="bg-[#31446B] text-white px-4 py-2 rounded-lg w-fit font-semibold mt-2">Kaian Gonçalves: HEHEHÉ é u gil o melhor scrum master</span>
            </div>
            <div className="flex flex-col">
              <span className="bg-[#31446B] text-white px-4 py-2 rounded-lg w-fit font-semibold">Gil: Primeira Mensagem do dilema</span>
              <span className="bg-[#31446B] text-white px-4 py-2 rounded-lg w-fit font-semibold mt-2">Kaian Gonçalves: HEHEHÉ é u gil o melhor scrum master</span>
            </div>
          </div>
          {/* Input de mensagem (desabilitado) */}
          <div className="flex items-center mt-auto">
            <input
              type="text"
              placeholder="Digite sua mensagem para o chat..."
              className="flex-1 border border-gray-300 rounded-full px-6 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1A2A4B] bg-[#F8FAFC]"
              disabled
            />
            <Button className="ml-4 bg-[#1A2A4B] text-white rounded-full px-6 py-3" disabled>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Button>
          </div>
        </section>

        {/* Modal de convite */}
        {modalOpen && (
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

              {/* Texto "E-mail do participante" */}
              <div
                className="
                  absolute
                  left-[95px] top-[64px]
                  text-white text-[20px] font-bold
                "
                style={{
                  fontFamily: "Poppins, sans-serif",
                  width: "300px",
                  height: "29px",
                  lineHeight: "29px",
                }}
              >
                E-mail do participante
              </div>

              {/* Campo de Input */}
              <input
                type="email"
                placeholder="Digite o e-mail do participante"
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
                value={emailConvite}
                onChange={e => setEmailConvite(e.target.value)}
                disabled={loadingConvite || user?.role !== "PROFESSOR"}
                required
              />
              {/* Mensagem de erro/sucesso */}
              {erroConvite && (
                <div className="absolute left-[97px] top-[150px] text-red-500 bg-white bg-opacity-80 rounded px-2 py-1 text-sm font-medium">{erroConvite}</div>
              )}
              {sucessoConvite && (
                <div className="absolute left-[97px] top-[150px] text-green-600 bg-white bg-opacity-80 rounded px-2 py-1 text-sm font-medium">{sucessoConvite}</div>
              )}

              {/* Botão "Enviar convite" dentro do popup (205×71) */}
              <button
                className="
                  absolute
                  left-[343px] top-[229px]
                  w-[205px] h-[71px]
                  bg-[#FBF9F9]
                  rounded-[5px]
                  flex items-center justify-center gap-1
                  cursor-pointer
                  disabled:opacity-60
                "
                onClick={async (e) => {
                  e.preventDefault()
                  setErroConvite(null)
                  setSucessoConvite(null)
                  if (user?.role !== "PROFESSOR") {
                    setErroConvite("Apenas professores podem convidar participantes.")
                    return
                  }
                  if (!emailConvite.trim()) {
                    setErroConvite("Digite o e-mail do participante.")
                    return
                  }
                  setLoadingConvite(true)
                  try {
                    await convidarUsuarioParaChat({ email: emailConvite, chatId: Number(id) })
                    setSucessoConvite("Convite enviado com sucesso!")
                    setEmailConvite("")
                    setTimeout(() => setModalOpen(false), 1200)
                  } catch (err) {
                    setErroConvite(err instanceof Error ? err.message : "Erro ao enviar convite")
                  } finally {
                    setLoadingConvite(false)
                  }
                }}
                disabled={loadingConvite || user?.role !== "PROFESSOR"}
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
                  {loadingConvite ? "Enviando..." : "Enviar convite"}
                </span>
              </button>

              {/* Botão de Saída (ícone da portinha, 82×54) */}
              <div className="absolute left-[404px] top-[315px] w-[82px] h-[54px] cursor-pointer">
                <Image
                  src="/images/ClosePane.png" // caminho da sua imagem 82×54
                  alt="Fechar Popup"
                  width={82}
                  height={54}
                  onClick={() => setModalOpen(false)}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 