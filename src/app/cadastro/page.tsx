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

// Adicionar estilos customizados com alta especificidade
const selectStyles = `
  select {
    background-color: white !important;
    color: #1e293b !important;
    appearance: none;
    padding-left: 2.5rem;
    width: 100%;
    height: 40px;
    border-radius: 0.375rem;
    border: 1px solid #e2e8f0;
  }
  
  select option {
    background-color: white !important;
    color: #1e293b !important;
    padding: 8px;
  }
  
  select:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
`

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
      {/* Adicionar estilos CSS customizados */}
      <style jsx global>{selectStyles}</style>
      
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
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 z-10">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <select
                      name="instituicao"
                      value={formData.graduation}
                      onChange={handleChange}
                      style={{
                        backgroundColor: 'white',
                        color: '#1e293b',
                        paddingLeft: '2.5rem',
                        width: '100%',
                        height: '40px',
                        borderRadius: '0.375rem',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      <option value="" disabled style={{backgroundColor: 'white', color: '#94a3b8'}}>Curso de graduação</option>
                      <option value="ciencia_computacao" style={{backgroundColor: 'white', color: '#1e293b'}}>Ciência da Computação</option>
                      <option value="engenharia_software" style={{backgroundColor: 'white', color: '#1e293b'}}>Engenharia de Software</option>
                      <option value="sistemas_informacao" style={{backgroundColor: 'white', color: '#1e293b'}}>Sistemas de Informação</option>
                      <option value="analise_sistemas" style={{backgroundColor: 'white', color: '#1e293b'}}>Análise e Desenvolvimento de Sistemas</option>
                      <option value="engenharia_computacao" style={{backgroundColor: 'white', color: '#1e293b'}}>Engenharia da Computação</option>
                      <option value="direito" style={{backgroundColor: 'white', color: '#1e293b'}}>Direito</option>
                      <option value="medicina" style={{backgroundColor: 'white', color: '#1e293b'}}>Medicina</option>
                      <option value="enfermagem" style={{backgroundColor: 'white', color: '#1e293b'}}>Enfermagem</option>
                      <option value="fisioterapia" style={{backgroundColor: 'white', color: '#1e293b'}}>Fisioterapia</option>
                      <option value="psicologia" style={{backgroundColor: 'white', color: '#1e293b'}}>Psicologia</option>
                      <option value="nutricao" style={{backgroundColor: 'white', color: '#1e293b'}}>Nutrição</option>
                      <option value="farmacia" style={{backgroundColor: 'white', color: '#1e293b'}}>Farmácia</option>
                      <option value="odontologia" style={{backgroundColor: 'white', color: '#1e293b'}}>Odontologia</option>
                      <option value="engenharia_civil" style={{backgroundColor: 'white', color: '#1e293b'}}>Engenharia Civil</option>
                      <option value="engenharia_mecanica" style={{backgroundColor: 'white', color: '#1e293b'}}>Engenharia Mecânica</option>
                      <option value="engenharia_eletrica" style={{backgroundColor: 'white', color: '#1e293b'}}>Engenharia Elétrica</option>
                      <option value="engenharia_quimica" style={{backgroundColor: 'white', color: '#1e293b'}}>Engenharia Química</option>
                      <option value="administracao" style={{backgroundColor: 'white', color: '#1e293b'}}>Administração</option>
                      <option value="economia" style={{backgroundColor: 'white', color: '#1e293b'}}>Economia</option>
                      <option value="contabilidade" style={{backgroundColor: 'white', color: '#1e293b'}}>Ciências Contábeis</option>
                      <option value="pedagogia" style={{backgroundColor: 'white', color: '#1e293b'}}>Pedagogia</option>
                      <option value="letras" style={{backgroundColor: 'white', color: '#1e293b'}}>Letras</option>
                      <option value="historia" style={{backgroundColor: 'white', color: '#1e293b'}}>História</option>
                      <option value="geografia" style={{backgroundColor: 'white', color: '#1e293b'}}>Geografia</option>
                      <option value="arquitetura" style={{backgroundColor: 'white', color: '#1e293b'}}>Arquitetura e Urbanismo</option>
                      <option value="design" style={{backgroundColor: 'white', color: '#1e293b'}}>Design</option>
                      <option value="jornalismo" style={{backgroundColor: 'white', color: '#1e293b'}}>Jornalismo</option>
                      <option value="publicidade" style={{backgroundColor: 'white', color: '#1e293b'}}>Publicidade e Propaganda</option>
                      <option value="agronomia" style={{backgroundColor: 'white', color: '#1e293b'}}>Agronomia</option>
                      <option value="veterinaria" style={{backgroundColor: 'white', color: '#1e293b'}}>Medicina Veterinária</option>
                      <option value="zootecnia" style={{backgroundColor: 'white', color: '#1e293b'}}>Zootecnia</option>
                      <option value="biologia" style={{backgroundColor: 'white', color: '#1e293b'}}>Ciências Biológicas</option>
                      <option value="fisica" style={{backgroundColor: 'white', color: '#1e293b'}}>Física</option>
                      <option value="quimica" style={{backgroundColor: 'white', color: '#1e293b'}}>Química</option>
                      <option value="matematica" style={{backgroundColor: 'white', color: '#1e293b'}}>Matemática</option>
                      <option value="estatistica" style={{backgroundColor: 'white', color: '#1e293b'}}>Estatística</option>
                      <option value="gestao_ambiental" style={{backgroundColor: 'white', color: '#1e293b'}}>Gestão Ambiental</option>
                      <option value="turismo" style={{backgroundColor: 'white', color: '#1e293b'}}>Turismo</option>
                      <option value="gastronomia" style={{backgroundColor: 'white', color: '#1e293b'}}>Gastronomia</option>
                      <option value="educacao_fisica" style={{backgroundColor: 'white', color: '#1e293b'}}>Educação Física</option>
                      <option value="outras" style={{backgroundColor: 'white', color: '#1e293b'}}>Outras graduações</option>
                    </select>
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