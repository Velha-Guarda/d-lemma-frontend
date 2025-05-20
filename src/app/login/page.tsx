"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormItem, FormMessage } from "@/components/ui/form"
import { Mail, Lock } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

function LoginFormContent() {
  const searchParams = useSearchParams()
  const { login, isLoading: authLoading, error: authError } = useAuth()
  
  const [formData, setFormData] = useState({
    email: "",
    senha: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    // Verifica se o usuário acabou de se cadastrar com sucesso
    if (searchParams.get('cadastro') === 'success') {
      setSuccessMessage("Cadastro realizado com sucesso! Faça login para continuar.")
    }
  }, [searchParams])
  
  // Atualiza erros quando houver erro de autenticação
  useEffect(() => {
    if (authError) {
      setErrors({ form: authError })
    }
  }, [authError])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Limpa o erro deste campo quando o usuário começa a digitar novamente
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev}
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório"
    }
    
    // Validar senha
    if (!formData.senha) {
      newErrors.senha = "Senha é obrigatória"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      // Usar a função de login do contexto de autenticação
      await login(formData.email, formData.senha)
      // Não precisa redirecionar aqui, o contexto já faz isso
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      // Erros de autenticação são tratados pelo useEffect que monitora authError
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center py-12 text-white">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/background.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Logo acima do retângulo */}
      <div className="relative z-10 mb-8 flex flex-col items-center">
        <Image 
          src="/images/logodlemma.png" 
          alt="D-LEMMA" 
          width={120} 
          height={120}
          className="mb-2"
        />
      </div>
      
      {/* Retângulo centralizado com o formulário */}
      <div className="relative z-10 mx-auto w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="flex flex-col md:flex-row">
          {/* Coluna da esquerda (Novo por aqui?) */}
          <div className="w-full bg-white p-8 text-black md:w-1/3">
            <div className="flex h-full flex-col justify-center">
              <h2 className="mb-2 text-2xl font-bold">Novo por aqui?</h2>
              <p className="mb-6 text-gray-600">Crie sua conta para participar das discussões éticas</p>
              <Link href="/cadastro">
                <Button 
                  className="w-full bg-[#203D68] hover:bg-[#203D68]/90"
                  variant="default"
                >
                  <span className="font-bold text-white">CADASTRAR</span>
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Coluna da direita (Login) */}
          <div className="w-full bg-[#203D68] p-8 md:w-2/3">
            <h2 className="mb-2 text-center text-xl font-semibold">Bem-vindo de volta!</h2>
            <p className="mb-6 text-center text-sm opacity-80">Acesse sua conta agora mesmo</p>
            
            {successMessage && (
              <div className="mb-6 rounded-md bg-green-500/20 p-3 text-center text-sm text-white">
                {successMessage}
              </div>
            )}
            
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
                      value={formData.email}
                      onChange={handleChange}
                      className="border-gray-300 bg-white pl-10 text-slate-800 placeholder:text-gray-400"
                    />
                  </div>
                </FormControl>
                {errors.email && <FormMessage>{errors.email}</FormMessage>}
              </FormItem>
              
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <Lock className="h-5 w-5" />
                    </div>
                    <Input
                      placeholder="Senha"
                      name="senha"
                      type="password"
                      value={formData.senha}
                      onChange={handleChange}
                      className="border-gray-300 bg-white pl-10 text-slate-800 placeholder:text-gray-400"
                    />
                  </div>
                </FormControl>
                {errors.senha && <FormMessage>{errors.senha}</FormMessage>}
              </FormItem>
              
              <div className="text-right">
                <Link href="/recuperar-senha" className="text-sm text-white/70 hover:text-white">
                  Esqueceu sua senha?
                </Link>
              </div>
              
              {errors.form && <FormMessage className="text-center">{errors.form}</FormMessage>}
              
              <div className="pt-4 text-center">
                <Button 
                  className="w-60 bg-[#091429] text-white hover:bg-[#091429]/90"
                  type="submit"
                  disabled={isSubmitting || authLoading}
                >
                  {isSubmitting || authLoading ? "ENTRANDO..." : "ENTRAR"}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Carregando...</p>
    </div>}>
      <LoginFormContent />
    </Suspense>
  )
} 