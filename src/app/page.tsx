// page.tsx
import { Button } from "@/components/ui/button";
import { Users, BookOpen, LucideMessageSquare } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Navbar */}
      <header className="border-b">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white w-8 h-8 rounded-md flex items-center justify-center font-bold">D</div>
            <h1 className="text-xl font-bold">D-Lemma</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#about" className="text-sm font-medium hover:text-blue-600 transition-colors">Sobre</a>
            <a href="#features" className="text-sm font-medium hover:text-blue-600 transition-colors">Funcionalidades</a>
            <a href="#methodology" className="text-sm font-medium hover:text-blue-600 transition-colors">Metodologia</a>
            <a href="#contact" className="text-sm font-medium hover:text-blue-600 transition-colors">Contato</a>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="hidden md:flex">Entrar</Button>
            <Button size="sm">Registrar</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Aprendizagem colaborativa através de dilemas éticos
            </h1>
            <p className="text-lg text-gray-600">
              D-Lemma é um ambiente de aprendizagem colaborativa para estudantes universitários, promovendo a interdisciplinaridade através de discussões éticas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-2">
                Começar agora 
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m9 18 6-6-6-6"/></svg>
              </Button>
              
            </div>
          </div>
          <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-blue-600 bg-opacity-10 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-5/6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Dilema Ético #42</h3>
                    <p className="text-sm text-gray-500">Bioética e Tecnologia</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  &ldquo;Uma empresa de tecnologia desenvolve um algoritmo que pode prever condições médicas com 95% de precisão antes dos sintomas aparecerem. Quem deve ter acesso a essa informação e quais as implicações éticas?&rdquo;
                </p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">12 participantes</span>
                  <span className="text-blue-600 font-medium">Participar da discussão</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Sobre o D-Lemma</h2>
            <p className="text-lg text-gray-600">
              O sistema D-Lemma é um ambiente de aprendizagem colaborativa suportado por computador (CSCL), projetado especificamente para estudantes universitários. Nossa plataforma visa promover a interdisciplinaridade através de discussões de dilemas éticos em um fórum moderado.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Colaboração</h3>
              <p className="text-gray-600">Promovemos um ambiente onde estudantes de diferentes áreas podem compartilhar perspectivas únicas sobre questões éticas complexas.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Aprendizagem</h3>
              <p className="text-gray-600">Desenvolvemos habilidades críticas através da análise de dilemas éticos reais e relevantes para diversas áreas de conhecimento.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <LucideMessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Discussão</h3>
              <p className="text-gray-600">Facilitamos conversas significativas em um fórum moderado que garante um ambiente seguro e respeitoso para todos os participantes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Principais funcionalidades</h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Fórum de discussão moderado</h3>
                  <p className="text-gray-600">Ambiente seguro e estruturado para debates éticos com moderação ativa para garantir discussões construtivas.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Metodologia &ldquo;Caixa de Pandora&rdquo;</h3>
                  <p className="text-gray-600">Sistema único de seleção aleatória de dilemas éticos, trazendo diversidade de temas a cada rodada de discussão.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Interface intuitiva</h3>
                  <p className="text-gray-600">Plataforma web acessível via navegador, com design pensado para facilitar a participação e o engajamento dos usuários.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 border-b flex items-center">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="mx-auto text-sm text-gray-500">D-Lemma - Discussão em andamento</div>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold">MJ</div>
                      <div className="bg-gray-100 rounded-lg p-3 text-sm max-w-xs">
                        <p className="font-semibold text-xs text-gray-600 mb-1">Maria Júlia - Medicina</p>
                        <p>Do ponto de vista médico, acho que o paciente deveria sempre ser o primeiro a saber sobre sua condição.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 justify-end">
                      <div className="bg-blue-100 rounded-lg p-3 text-sm max-w-xs">
                        <p className="font-semibold text-xs text-gray-600 mb-1">Paulo Santos - Direito</p>
                        <p>Mas e as implicações legais? Há leis de privacidade de dados que precisamos considerar nesse caso.</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-xs font-bold">PS</div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-xs font-bold">AT</div>
                      <div className="bg-gray-100 rounded-lg p-3 text-sm max-w-xs">
                        <p className="font-semibold text-xs text-gray-600 mb-1">Ana Teixeira - Filosofia</p>
                        <p>Interessante considerarmos o princípio da autonomia aqui. Quem realmente &ldquo;possui&rdquo; essa informação?</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section id="methodology" className="py-20 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Metodologia &ldquo;Caixa de Pandora&rdquo;</h2>
            <p className="text-lg text-gray-600">
              Nossa abordagem única para seleção de dilemas éticos traz imprevisibilidade e diversidade às discussões, estimulando o pensamento crítico e a capacidade de adaptação.
            </p>
          </div>
          
          <div className="relative max-w-xl mx-auto mt-16 p-6 border-2 border-blue-600 rounded-lg bg-blue-50">
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-md font-bold">
              Como funciona
            </div>
            
            <ol className="space-y-6">
              <li className="flex gap-4">
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">1</div>
                <div>
                  <h3 className="font-semibold mb-1">Curadoria de dilemas</h3>
                  <p className="text-sm text-gray-600">Uma equipe multidisciplinar seleciona dilemas éticos relevantes de diversas áreas do conhecimento.</p>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">2</div>
                <div>
                  <h3 className="font-semibold mb-1">Seleção aleatória</h3>
                  <p className="text-sm text-gray-600">A cada rodada, o sistema escolhe aleatoriamente um dilema da &ldquo;Caixa de Pandora&rdquo; para ser discutido pelos participantes.</p>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">3</div>
                <div>
                  <h3 className="font-semibold mb-1">Discussão moderada</h3>
                  <p className="text-sm text-gray-600">Estudantes de diferentes cursos participam do debate, trazendo perspectivas únicas de suas áreas de formação.</p>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">4</div>
                <div>
                  <h3 className="font-semibold mb-1">Síntese e reflexão</h3>
                  <p className="text-sm text-gray-600">Ao final de cada rodada, é criado um resumo das principais perspectivas e aprendizados gerados pela discussão.</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para participar?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Junte-se a outros estudantes universitários e amplie seus horizontes através de discussões éticas interdisciplinares.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              Criar uma conta
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700">
              Saiba mais
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-600 text-white w-8 h-8 rounded-md flex items-center justify-center font-bold">D</div>
                <h1 className="text-xl font-bold text-white">D-Lemma</h1>
              </div>
              <p className="text-sm text-gray-400">
                Plataforma de aprendizagem colaborativa para discussão de dilemas éticos em ambiente universitário.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Início</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">Sobre</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Funcionalidades</a></li>
                <li><a href="#methodology" className="hover:text-white transition-colors">Metodologia</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
            
            <div id="contact">
              <h3 className="font-semibold text-white mb-4">Contato</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  <span>contato@d-lemma.edu.br</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <span>(00) 1234-5678</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>Campus Universitário, Bloco B</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-gray-400 text-center">
            <p>&copy; {new Date().getFullYear()} D-Lemma. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}