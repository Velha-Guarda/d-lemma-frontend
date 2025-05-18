"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Form, FormControl, FormItem, FormMessage } from "@/components/ui/form"
import { User, Mail, Lock, GraduationCap } from "lucide-react"

export default function CadastroPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    instituicao: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Limpar erro deste campo quando o usuário começa a digitar novamente
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
    
    // Validar nome
    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório"
    }
    
    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Formato de email inválido"
    }
    
    // Validar instituição
    if (!formData.instituicao) {
      newErrors.instituicao = "Selecione uma instituição"
    }
    
    // Validar senha
    if (!formData.senha) {
      newErrors.senha = "Senha é obrigatória"
    } else if (formData.senha.length < 6) {
      newErrors.senha = "A senha deve ter pelo menos 6 caracteres"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      // Simulação de cadastro (substituir por chamada API depois de pronto o backend)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirecionar para a página de login após cadastro com sucesso
      router.push("/login?cadastro=success")
    } catch (error) {
      console.error("Erro ao cadastrar:", error)
      setErrors({
        form: "Ocorreu um erro ao tentar cadastrar. Tente novamente."
      })
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
          {/* Coluna da esquerda (Bem-vindo) */}
          <div className="w-full bg-white p-8 text-black md:w-1/3">
            <div className="flex h-full flex-col justify-center">
              <h2 className="mb-2 text-4xl font-bold">Bem-vindo, <br />de volta!</h2>
              <p className="mb-6 text-gray-600">Acesse sua conta agora mesmo</p>
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
          
          {/* Coluna da direita (Cadastro) */}
          <div className="w-full bg-[#203D68] p-8 md:w-2/3">
            <h2 className="mb-2 text-center text-3xl font-semibold">Cadastre-se com o seu email institucional</h2>
            <p className="mb-6 text-center text-sm opacity-80">Preencha seus dados</p>
            
            <Form className="space-y-4" onSubmit={handleSubmit}>
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <User className="h-5 w-5" />
                    </div>
                    <Input
                      placeholder="Nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      className="border-gray-300 bg-white pl-10 text-slate-800 placeholder:text-gray-400"
                    />
                  </div>
                </FormControl>
                {errors.nome && <FormMessage>{errors.nome}</FormMessage>}
              </FormItem>
              
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
              
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <Select
                      name="instituicao"
                      value={formData.instituicao}
                      onChange={handleChange}
                      className="border-gray-300 bg-white pl-10 text-slate-800 appearance-none"
                    >
                      <option value="" disabled className="text-gray-500">Curso de graduação</option>
                      <option value="uesb">Universidade Estadual do Sudoeste da Bahia</option>
                      <option value="outras">Outras instituições</option>
                    </Select>
                  </div>
                </FormControl>
                {errors.instituicao && <FormMessage>{errors.instituicao}</FormMessage>}
              </FormItem>
              
              {errors.form && <FormMessage className="text-center">{errors.form}</FormMessage>}
              
              <div className="pt-4 text-center">
                <Button 
                  className="w-60 bg-[#091429] text-white hover:bg-[#091429]/90"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "CADASTRANDO..." : "CADASTRAR"}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
} 