"use client"

import { useParams, useSearchParams } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Monitor, Heart, User, Trophy } from "lucide-react"
import { convidarUsuarioParaChat } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import { useChat, ChatMessage } from "@/hooks/useChat"
import { useRouter } from 'next/navigation'

export default function DilemmaDetailPage() {
  const router = useRouter()

  const params = useParams()
  const id = typeof params.id === "string" ? params.id : ""
  if (!id) return <p>Carregando dilema…</p>
  const searchParams = useSearchParams()
  const chat = useChat(id)

  const [titulo, setTitulo] = useState<string>("Título Dilemma")
  const [novaMensagem, setNovaMensagem] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [emailConvite, setEmailConvite] = useState("")
  const [loadingConvite, setLoadingConvite] = useState(false)
  const [erroConvite, setErroConvite] = useState<string | null>(null)
  const [sucessoConvite, setSucessoConvite] = useState<string | null>(null)
  const { user, logout } = useAuth()

  const [closing, setClosing] = useState(false)
 const [closeError, setCloseError] = useState<string | null>(null)

 const [isClosed, setIsClosed] = useState<boolean | null>(null)

  async function handleCloseDilemma() {
    setClosing(true)
    setCloseError(null)
    try {
      const token = localStorage.getItem("token") || ""
      const res = await fetch(`/api/dilemmas/${id}/close`, {
        method: "PUT",
        headers: {
          Authorization: token,
        },
      })
      if (!res.ok) {
        const err = await res.text()
        throw new Error(err || `Status ${res.status}`)
      }
      router.push("/dashboard")
    } catch (e: any) {
      setCloseError(e.message)
    } finally {
      setClosing(false)
    }
  }

  const bottomRef = useRef<HTMLDivElement | null>(null)


  useEffect(() => {
    if (!id) return
    const tituloQuery = searchParams.get("titulo")
    if (tituloQuery) {
      setTitulo(tituloQuery)
      localStorage.setItem(`dilemma-title-${id}`, tituloQuery)
      return
    }
    const tituloLocal = localStorage.getItem(`dilemma-title-${id}`)
    if (tituloLocal) setTitulo(tituloLocal)
  }, [id, searchParams])


  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [chat.messages])

  // ► novo useEffect só para buscar isClosed
useEffect(() => {
  if (!id) return;
  const token = localStorage.getItem("token") || "";
  fetch(`/api/dilemmas/${id}`, {
    headers: { Authorization: token },
  })
    // ► aqui começa a versão com o console.log
    .then(async res => {
      if (!res.ok) throw new Error("Falha ao carregar dilema");
      const d = await res.json();
      console.log("⮞ dilema payload:", d);
      return d;
    })
  .then((d: any) => setIsClosed(d.closed))
    .catch(console.error);
}, [id]);

  function handleEnviarMensagem() {
    if (!novaMensagem.trim() || !user?.id || !id) return

    const msg: ChatMessage = {
      content: novaMensagem.trim(),
      senderId: `${user.id}`,
      dilemmaId: `${id}`
    }

    chat.sendMessage(msg)
    setNovaMensagem("")
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <div className="w-80 bg-[#2D4A77] flex flex-col items-center py-8">
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
        <div className="w-full px-6 flex-1 flex flex-col">
          <div className="mb-6">
            <h3 className="text-white/80 text-sm font-medium mb-4">Menu Principal</h3>
          </div>
          <nav className="space-y-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-4 w-full p-3 text-white hover:bg-white/10 rounded-lg transition-colors text-left"
            >
              <Monitor className="w-5 h-5" />
              <span className="font-medium">dLemmas</span>
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
      <main className="flex-1 flex flex-col h-full">
        <header className="flex items-center justify-between bg-[#1A2A4B] px-12 py-6">
          <h1 className="text-white text-4xl font-extrabold tracking-tight overflow-hidden line-clamp-2 max-h-[3.2em] max-w-[500px]">{titulo}</h1>
          {user?.role === 'PROFESSOR' && isClosed === false && (
            <div className="flex gap-4">
              {/* Botão de adicionar participantes (mantém) */}
                <Button
                  onClick={() => {
                    setEmailConvite("")
                setErroConvite(null)
                setSucessoConvite(null)
                setModalOpen(true) 
              }}
                  className="
                    bg-white text-[#1A2A4B] font-semibold
                    px-3 py-1.5 rounded-lg shadow
                    hover:bg-gray-100 text-lg
                    flex items-center gap-2
                  "
                >
                  <span className="flex items-center justify-center w-5 h-5 bg-[#2e4f92] rounded-md">
                    <span className="text-white text-base font-bold leading-none">+</span>
                  </span>
                  <span
                    className="text-black text-lg font-extrabold whitespace-nowrap"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Participantes
                  </span>
                </Button>
              {/* Botão de encerrar dilema (mantém) */}
                <Button
                  onClick={handleCloseDilemma}
                  disabled={closing}
                  className="
                    bg-white text-[#1A2A4B] font-semibold
                    px-3 py-1.5 rounded-lg shadow
                    hover:bg-gray-100 text-lg
                    flex items-center gap-2
                    disabled:opacity-50
                  "
                >
                  <span className="flex items-center justify-center w-5 h-5 bg-[#2e4f92] rounded-md">
                    <span className="text-white text-base font-bold leading-none">+</span>
                  </span>
                  <span className="text-black text-lg font-extrabold whitespace-nowrap">
                    {closing ? "Encerrando…" : "Encerrar Dlemma"}
                  </span>
                </Button>
              {closeError && (
                <p className="text-red-500 text-sm">{"Erro ao encerrar dlemma."}</p>
              )}
            </div>
          )}

        </header>

        {/* Chat Area */}
        <section className="flex flex-col bg-white mx-8 my-6 rounded-lg shadow p-8 flex-1 overflow-hidden">
          <div className="flex flex-col overflow-y-auto gap-4 px-2 pb-2 pt-2 h-full">
            {chat.messages.map((msg, idx) => {
              const isMine = msg.senderId === user?.id || msg.senderId === `${user?.id}`
              return (
                <div key={idx} className={`flex ${isMine ? "justify-end" : "justify-start"} flex-col`}>
                  {!isMine && (
                    <div className="text-xs text-gray-500 mb-1 pl-1">
                      {msg.senderName || "Usuário"}
                    </div>
                  )}
                  <div className={`px-4 py-2 rounded-lg max-w-[70%] text-sm font-medium ${isMine ? "bg-gray-200 text-black self-end" : "bg-[#203D68] text-white self-start"}`}>
                    {msg.content}
                  </div>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>

          <div className="flex items-center pt-4">
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              className="flex-1 border border-gray-300 rounded-full px-6 py-3 text-gray-700 focus:outline-none focus:ring-0 bg-[#F8FAFC]"
              value={novaMensagem}
              onChange={e => setNovaMensagem(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleEnviarMensagem() }}
              disabled={isClosed === true}
            />
            <Button className="ml-4 bg-[#1A2A4B] text-white rounded-full px-6 py-3" onClick={handleEnviarMensagem}disabled={isClosed === true}>
              Enviar
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
                  left-[310px] top-[235px]    
                  w-[270px] h-[71px]            
                  bg-[#FBF9F9]
                  rounded-[8px]                  
                  flex items-center justify-center gap-2
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
                  } catch (err) {
                    if (
                      err instanceof SyntaxError &&
                      (err.message.includes('Unexpected token') || err.message.includes('JSON'))
                    ) {
                      setSucessoConvite("Convite enviado!")
                    } else {
                      setErroConvite(err instanceof Error ? err.message : "Erro ao enviar convite")
                    }
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
