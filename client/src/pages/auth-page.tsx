import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form";

export default function AuthPage() {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (user && !isLoading) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-neutral-lightest flex flex-col md:flex-row">
      {/* Left Side - Forms */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="flex justify-center">
              <span className="bg-primary rounded-full w-12 h-12 flex items-center justify-center mb-3">
                <i className="ri-fire-fill text-white text-xl"></i>
              </span>
            </div>
            <h1 className="text-3xl font-bold font-heading">Studio Gatas Saradas</h1>
            <p className="text-neutral-medium mt-2">Plataforma de Treino Online</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Cadastro</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Side - Hero */}
      <div className="flex-1 bg-gradient-to-br from-primary to-secondary text-white p-10 hidden md:flex md:flex-col md:justify-center">
        <div className="max-w-lg">
          <h2 className="text-4xl font-bold mb-6 font-heading">
            Transforme seu corpo e sua vida com treinos personalizados
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Uma plataforma completa para acompanhar seus treinos, 
            agendar sessões e manter seu progresso sob controle.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-white bg-opacity-20 rounded-full p-2 mr-4">
                <i className="ri-video-line text-xl"></i>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Vídeos demonstrativos</h3>
                <p className="opacity-90">Acesse vídeos detalhados para cada exercício e treino</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-white bg-opacity-20 rounded-full p-2 mr-4">
                <i className="ri-calendar-line text-xl"></i>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Agendamento fácil</h3>
                <p className="opacity-90">Agende suas sessões de treino através do calendário integrado</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-white bg-opacity-20 rounded-full p-2 mr-4">
                <i className="ri-bar-chart-line text-xl"></i>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Acompanhe seu progresso</h3>
                <p className="opacity-90">Visualize métricas e resultados para otimizar seu desempenho</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
