"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormItem, FormMessage } from "@/components/ui/form"
import { Mail } from "lucide-react"
import { solicitarRecuperacaoSenha } from "@/lib/api"

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if (!email.trim()) {
      setError("Email é obrigatório")
      return
    }
    setIsSubmitting(true)
    try {
      await solicitarRecuperacaoSenha(email)
      setSuccess("Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao solicitar recuperação de senha")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center py-12 text-white">
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/background.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="relative z-10 mb-8 flex flex-col items-center">
        <Image 
          src="/images/logodlemma.png" 
          alt="D-LEMMA" 
          width={120} 
          height={120}
          className="mb-2"
        />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="flex flex-col md:flex-row">
          <div className="w-full bg-white p-8 text-black md:w-1/3">
            <div className="flex h-full flex-col justify-center">
              <h2 className="mb-2 text-2xl font-bold">Lembrou a senha?</h2>
              <p className="mb-6 text-gray-600">Volte para o login</p>
              <Link href="/login">
                <Button 
                  className="w-full bg-[#203D68] hover:bg-[#203D68]/90"
                  variant="default"
                >
                  <span className="font-bold text-white">ENTRAR</span>
                </Button>
              </Link>
            </div>
          </div>
          <div className="w-full bg-[#203D68] p-8 md:w-2/3">
            <h2 className="mb-2 text-center text-xl font-semibold">Recuperar senha</h2>
            <p className="mb-6 text-center text-sm opacity-80">Informe seu e-mail para receber o link de redefinição</p>
            <Form className="space-y-4" onSubmit={handleSubmit}>
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <Mail className="h-5 w-5" />
                    </div>
                    <Input
                      placeholder="Email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="border-gray-300 bg-white pl-10 text-slate-800 placeholder:text-gray-400"
                    />
                  </div>
                </FormControl>
                {error && <FormMessage>{error}</FormMessage>}
              </FormItem>
              {success && (
                <div className="mb-4 rounded-md bg-green-500/20 p-3 text-center text-sm text-white">
                  {success}
                </div>
              )}
              <div className="pt-4 text-center">
                <Button 
                  className="w-60 bg-[#091429] text-white hover:bg-[#091429]/90"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "ENVIANDO..." : "ENVIAR LINK"}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
} 