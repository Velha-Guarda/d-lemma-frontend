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
import { Checkbox } from "@/components/ui/checkbox"

import { cadastrarUsuario } from "@/lib/api"
import { CadastroUsuario } from "@/types/usuario"

export default function CadastroPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<CadastroUsuario>({
    name: "",
    email: "",
    password: "",
    graduation: "",
    role: "STUDENT"
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    // Mapeamento dos nomes dos campos para as propriedades do estado
    const fieldMapping: Record<string, string> = {
      nome: 'name',
      senha: 'password',
      instituicao: 'graduation',
      email: 'email'
    }
    
    const stateField = fieldMapping[name] || name
    setFormData(prev => ({ ...prev, [stateField]: value }))
    
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
    if (!formData.name.trim()) {
      newErrors.nome = "Nome é obrigatório"
    }
    
    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Formato de email inválido"
    }
    
    // Validar instituição
    if (!formData.graduation) {
      newErrors.instituicao = "Selecione uma instituição"
    }
    
    // Validar senha
    if (!formData.password) {
      newErrors.senha = "Senha é obrigatória"
    } else if (formData.password.length < 6) {
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
      // Usa a função do serviço API para fazer o cadastro
      const data = await cadastrarUsuario(formData);
      console.log("Usuário cadastrado com sucesso:", data);
      
      // Redirecionar para a página de login após cadastro com sucesso
      router.push("/login?cadastro=success");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      
      // Verifica se é um erro específico da API
      if (error instanceof Error) {
        setErrors({
          form: error.message || "Ocorreu um erro ao tentar cadastrar. Tente novamente."
        });
      } else {
        setErrors({
          form: "Ocorreu um erro de conexão. Verifique sua internet e tente novamente."
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      role: checked ? "PROFESSOR" : "STUDENT"
    }))
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
                      value={formData.name}
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
                      value={formData.password}
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
                      value={formData.graduation}
                      onChange={handleChange}
                      className="border-gray-300 bg-white pl-10 text-slate-800 appearance-none"
                    >
                      <option value="" disabled className="text-gray-500">Curso de graduação</option>
                      <option value="ciencia_computacao">Ciência da Computação</option>
                      <option value="engenharia_software">Engenharia de Software</option>
                      <option value="sistemas_informacao">Sistemas de Informação</option>
                      <option value="analise_sistemas">Análise e Desenvolvimento de Sistemas</option>
                      <option value="engenharia_computacao">Engenharia da Computação</option>
                      <option value="direito">Direito</option>
                      <option value="medicina">Medicina</option>
                      <option value="enfermagem">Enfermagem</option>
                      <option value="fisioterapia">Fisioterapia</option>
                      <option value="psicologia">Psicologia</option>
                      <option value="nutricao">Nutrição</option>
                      <option value="farmacia">Farmácia</option>
                      <option value="odontologia">Odontologia</option>
                      <option value="engenharia_civil">Engenharia Civil</option>
                      <option value="engenharia_mecanica">Engenharia Mecânica</option>
                      <option value="engenharia_eletrica">Engenharia Elétrica</option>
                      <option value="engenharia_quimica">Engenharia Química</option>
                      <option value="administracao">Administração</option>
                      <option value="economia">Economia</option>
                      <option value="contabilidade">Ciências Contábeis</option>
                      <option value="pedagogia">Pedagogia</option>
                      <option value="letras">Letras</option>
                      <option value="historia">História</option>
                      <option value="geografia">Geografia</option>
                      <option value="arquitetura">Arquitetura e Urbanismo</option>
                      <option value="design">Design</option>
                      <option value="jornalismo">Jornalismo</option>
                      <option value="publicidade">Publicidade e Propaganda</option>
                      <option value="agronomia">Agronomia</option>
                      <option value="veterinaria">Medicina Veterinária</option>
                      <option value="zootecnia">Zootecnia</option>
                      <option value="biologia">Ciências Biológicas</option>
                      <option value="fisica">Física</option>
                      <option value="quimica">Química</option>
                      <option value="matematica">Matemática</option>
                      <option value="estatistica">Estatística</option>
                      <option value="gestao_ambiental">Gestão Ambiental</option>
                      <option value="turismo">Turismo</option>
                      <option value="gastronomia">Gastronomia</option>
                      <option value="educacao_fisica">Educação Física</option>
                      <option value="outras">Outras graduações</option>
                    </Select>
                  </div>
                </FormControl>
                {errors.instituicao && <FormMessage>{errors.instituicao}</FormMessage>}
              </FormItem>

              {/* Checkbox: Sou professor */}
              <FormItem>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="professor"
                      checked={formData.role === "PROFESSOR"}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <label htmlFor="professor" className="text-white text-sm">
                      Sou professor
                    </label>
                  </div>
                </FormControl>
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