"use client"

import { useParams, useSearchParams } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Monitor, User, Trophy } from "lucide-react"
import { convidarUsuarioParaChat, listParticipants, ParticipantDTO, removeParticipant } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import { useChat, ChatMessage } from "@/hooks/useChat"
import { useRouter } from 'next/navigation'

export default function DilemmaDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = typeof params.id === "string" ? params.id : ""
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
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [participants, setParticipants] = useState<ParticipantDTO[]>([])
  const [loadingPart, setLoadingPart] = useState(false)
  const [errorPart, setErrorPart] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  // Move all useEffect hooks before any conditional returns
  useEffect(() => {
    if (id) {
      const tituloQuery = searchParams.get("titulo")
      if (tituloQuery) {
        setTitulo(tituloQuery)
        localStorage.setItem(`dilemma-title-${id}`, tituloQuery)
        return
      }
      const tituloLocal = localStorage.getItem(`dilemma-title-${id}`)
      if (tituloLocal) setTitulo(tituloLocal)
    }
  }, [id, searchParams])

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [chat.messages])

  useEffect(() => {
    if (id) {
      const token = localStorage.getItem("token") || "";
      fetch(`/api/dilemmas/${id}`, {
        headers: { Authorization: token },
      })
        .then(async res => {
          if (!res.ok) throw new Error("Falha ao carregar dilema");
          const d = await res.json();
          console.log("⮞ dilema payload:", d);
          return d;
        })
        .then((d: { closed: boolean }) => setIsClosed(d.closed))
        .catch(console.error);
    }
  }, [id]);

  // Now place the conditional return AFTER all hooks
  if (!id) return <p>Carregando dilema…</p>

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
    } catch (e: unknown) {
      setCloseError(e instanceof Error ? e.message : "Erro ao encerrar dlemma.")
    } finally {
      setClosing(false)
    }
  }
  
  // chama o backend e preenche `participants`
  async function fetchParticipants() {
    setLoadingPart(true)
    try {
      const list = await listParticipants(Number(id))
      setParticipants(list)
    } catch (e: unknown) {
      setErrorPart(e instanceof Error ? e.message : "Erro ao carregar participantes.")
    } finally {
      setLoadingPart(false)
    }
  }
  
  // wrapper para remoção + reload
  async function handleRemoveParticipant(userId: string) {
    try {
      await removeParticipant(Number(id), userId)
      fetchParticipants()
    } catch (e: unknown) {
      alert("Erro ao remover participante: " + (e instanceof Error ? e.message : "Erro ao remover participante."))
    }
  }

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
            <Image src="/images/logodlemma.png" alt="D-LEMMA Logo" width={128} height={128} />
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
          <h1 className="text-white text-4xl font-extrabold tracking-tight overflow-hidden line-clamp-2 max-h-[3.2em] max-w-[500px]">
            {titulo}
          </h1>

          {user?.role === "PROFESSOR" && isClosed === false && (
            <div className="flex gap-4">
              {/* Botão de adicionar participantes */}
              <Button
                onClick={() => {
                  setEmailConvite("");
                  setErroConvite(null);
                  setSucessoConvite(null);
                  setModalOpen(true);
                  fetchParticipants();
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
                <span className="text-black text-lg font-extrabold whitespace-nowrap" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Participantes
                </span>
              </Button>

              {/* Botão de encerrar dilema */}
              <Button
                onClick={() => setConfirmOpen(true)}
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
                  Encerrar Dlemma
                </span>
              </Button>
              {closeError && <p className="text-red-500 text-sm">{"Erro ao encerrar dlemma."}</p>}

              {/* Modal de confirmação de encerramento */}
              {confirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-6 rounded-[10px] border-[7px] border-[#2D4A77] w-[400px]">
                    <p className="text-lg font-medium mb-4">
                      Um dilema encerrado <strong>NÃO</strong> poderá ser reaberto.
                      <br />
                      Deseja mesmo encerrar?
                    </p>
                    <div className="flex justify-end gap-3">
                      <Button
                        onClick={() => {
                          setConfirmOpen(false);
                          handleCloseDilemma();
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                      >
                        Sim, encerrar
                      </Button>
                      <Button onClick={() => setConfirmOpen(false)} className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg">
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </header>

        {/* Chat Area */}
        <section className="flex flex-col bg-white mx-8 my-6 rounded-lg shadow p-8 flex-1 overflow-hidden">
          <div className="flex flex-col overflow-y-auto gap-4 px-2 pb-2 pt-2 h-full">
            {chat.messages.map((msg, idx) => {
              const isMine = msg.senderId === user?.id || msg.senderId === `${user?.id}`;
              return (
                <div key={idx} className={`flex ${isMine ? "justify-end" : "justify-start"} flex-col`}>
                  {!isMine && <div className="text-xs text-gray-500 mb-1 pl-1">{msg.senderName || "Usuário"}</div>}
                  <div
                    className={`px-4 py-2 rounded-lg max-w-[70%] text-sm font-medium ${isMine ? "bg-gray-200 text-black self-end" : "bg-[#203D68] text-white self-start"
                      }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          <div className="flex items-center pt-4">
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              className="flex-1 border border-gray-300 rounded-full px-6 py-3 text-gray-700 focus:outline-none focus:ring-0 bg-[#F8FAFC]"
              value={novaMensagem}
              onChange={(e) => setNovaMensagem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleEnviarMensagem();
              }}
              disabled={isClosed === true}
            />
            <Button className="ml-4 bg-[#1A2A4B] text-white rounded-full px-6 py-3" onClick={handleEnviarMensagem} disabled={isClosed === true}>
              Enviar
            </Button>
          </div>
        </section>

        {/* Modal de Participantes */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 pt-10 w-[800px] relative">
              {/* Adicionar participante */}
              <div className="flex gap-2 mb-4">
                <input
                  type="email"
                  placeholder="Digite o e-mail do participante"
                  className="flex-1 border rounded px-3 py-2"
                  value={emailConvite}
                  onChange={(e) => setEmailConvite(e.target.value)}
                />
                <Button
                  onClick={async () => {
                    setErroConvite(null);
                    setSucessoConvite(null);
                    if (!emailConvite.trim()) {
                      setErroConvite("Digite o e-mail do participante.");
                      return;
                    }
                    setLoadingConvite(true);
                    try {
                      await convidarUsuarioParaChat({ email: emailConvite, chatId: Number(id) });
                      setSucessoConvite("Convite enviado!");
                      setEmailConvite("");
                      fetchParticipants();
                    } catch (err: unknown) {
                      setErroConvite(err instanceof Error ? err.message : "Erro ao enviar convite.")
                    } finally {
                      setLoadingConvite(false);
                    }
                  }}
                  disabled={loadingConvite}
                >
                  {loadingConvite ? "Enviando…" : "Adicionar"}
                </Button>
              </div>
              {erroConvite && <p className="text-red-500 mb-2">{erroConvite}</p>}
              {sucessoConvite && <p className="text-green-600 mb-2">{sucessoConvite}</p>}

              <hr className="my-4" />

              {/* Lista de participantes */}
              {loadingPart ? (
                <p>Carregando participantes…</p>
              ) : errorPart ? (
                <p className="text-red-500">{errorPart}</p>
              ) : (
                <ul className="space-y-2 max-h-60 overflow-auto">
                  {participants.length > 0 ? (
                    participants.map((p) => {
                      const isMe = p.userId === user?.id.toString()
                      const statusText =
                        p.invitationStatus === 'PENDING' ? 'Aguardando aceitação' :
                          p.invitationStatus === 'DECLINED' ? 'Convite recusado' :
                            p.invitationStatus === 'ACCEPTED' ? 'Participante ativo' :
                              p.invitationStatus

                      return (
                        <li key={p.userId} className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{p.userName}</span>
                            <span className="text-sm text-gray-500 ml-2">
                              ({p.email}{isMe ? ' • Você' : ''})
                            </span>
                            <div className="text-xs text-gray-400">{statusText}</div>
                          </div>

                          {/* só mostra o Remover se NÃO for você e não estiver com convite recusado */}
                          {(!isMe && p.invitationStatus !== 'DECLINED') && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveParticipant(p.userId)}
                            >
                              Remover
                            </Button>
                          )}
                        </li>
                      )
                    })
                  ) : (
                    <p className="text-gray-500">Nenhum participante.</p>
                  )}
                </ul>
              )}

              {/* Fechar modal */}
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl leading-none"
                onClick={() => setModalOpen(false)}
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}