import { useEffect, useRef, useState } from "react"
import SockJS from "sockjs-client"
import * as StompJs from "@stomp/stompjs"

export type ChatMessage = {
  senderId: string
  senderName?: string
  dilemmaId: string
  content: string
}

export function useChat(dilemmaId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const clientRef = useRef<StompJs.Client | null>(null)
  const subscriptionRef = useRef<StompJs.StompSubscription | null>(null)

  // 1️⃣ Carrega histórico via rota local (Next.js proxy)
  useEffect(() => {
    if (!dilemmaId || dilemmaId === "undefined") return

    const token = localStorage.getItem("token") || ""

    fetch(`/api/chats/${dilemmaId}`, {
      headers: {
        Authorization: token,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao buscar histórico")
        return res.json()
      })
      .then((data: ChatMessage[]) => {
        setMessages(data)
      })
      .catch(err => {
        console.error("Erro ao carregar histórico do chat:", err)
      })
  }, [dilemmaId])

  // 2️⃣ Conecta ao WebSocket e escuta mensagens em tempo real
  useEffect(() => {
    if (!dilemmaId || dilemmaId === "undefined") return

    const sock = new SockJS(`${process.env.NEXT_PUBLIC_API_URL}/ws`)
    const client = new StompJs.Client({
      webSocketFactory: () => sock,
      reconnectDelay: 5000,
    })

    client.onConnect = () => {
      subscriptionRef.current = client.subscribe(
        `/topic/dilemma.${dilemmaId}`,
        (message: StompJs.IMessage) => {
          const chatMessage = JSON.parse(message.body)
          setMessages(prev => [...prev, chatMessage])
        }
      )
    }

    client.activate()
    clientRef.current = client

    return () => {
      subscriptionRef.current?.unsubscribe()
      client.deactivate()
    }
  }, [dilemmaId])

  // 3️⃣ Envia nova mensagem pelo STOMP
  function sendMessage(message: ChatMessage) {
    if (!clientRef.current?.connected) {
      console.warn("STOMP não está conectado.")
      return
    }

    clientRef.current.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(message),
    })
  }

  return { messages, sendMessage }
}
