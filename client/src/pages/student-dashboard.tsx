import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import MobileNavigation from "@/components/layout/mobile-navigation";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Calendar, Heart, Play, BarChart2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fetch student dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/dashboard"],
    queryFn: async () => {
      // Mock data for initial design
      return {
        workouts: [
          {
            id: 1,
            title: "Treino A - Pernas e Glúteos",
            level: "Intermediário",
            duration: "45 min",
            category: "lower",
            image: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
            description: "Treino focado em hipertrofia para pernas e glúteos com alta intensidade.",
            completionStatus: "completed",
            lastCompleted: "Hoje, 10:30",
            progress: 100
          },
          {
            id: 2,
            title: "Treino B - Core e Abdômen",
            level: "Básico",
            duration: "30 min",
            category: "core",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
            description: "Treino para fortalecimento do core e definição abdominal.",
            completionStatus: "in-progress",
            lastCompleted: "2 dias atrás",
            progress: 60
          },
          {
            id: 3,
            title: "Treino C - Braços e Costas",
            level: "Intermediário",
            duration: "40 min",
            category: "upper",
            image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
            description: "Treino para hipertrofia de braços e costas com foco em definição muscular.",
            completionStatus: "not-started",
            lastCompleted: "Nunca",
            progress: 0
          }
        ],
        sessions: [
          {
            id: 1,
            date: "Hoje, 15:00",
            title: "Treino Personal",
            subtitle: "Com Daniela Lopes",
            type: "training",
            status: "scheduled"
          },
          {
            id: 2,
            date: "Amanhã, 10:30",
            title: "Aula de Yoga",
            subtitle: "Grupo (3 alunas)",
            type: "group",
            status: "scheduled"
          },
          {
            id: 3,
            date: "23/04, 16:00",
            title: "Avaliação Física",
            subtitle: "Com Daniela Lopes",
            type: "evaluation",
            status: "scheduled"
          }
        ],
        progress: {
          weight: [
            { date: "Jan", value: 68 },
            { date: "Fev", value: 67 },
            { date: "Mar", value: 65.5 },
            { date: "Abr", value: 64 }
          ],
          bodyFat: [
            { date: "Jan", value: 28 },
            { date: "Fev", value: 27 },
            { date: "Mar", value: 25.5 },
            { date: "Abr", value: 24 }
          ],
          weeklyWorkouts: 4,
          monthlyWorkouts: 16,
          streak: 5,
          goals: [
            { name: "Treinos Semanais", current: 4, target: 5, progress: 80 },
            { name: "Perda de Peso", current: 4, target: 5, progress: 80 },
            { name: "Redução de % Gordura", current: 4, target: 8, progress: 50 }
          ]
        },
        payments: {
          nextPayment: {
            dueDate: "20/04/2023",
            amount: "R$ 280,00",
            status: "upcoming"
          }
        }
      };
    }
  });

  const handleViewWorkout = (id: number) => {
    toast({
      title: "Visualizar Treino",
      description: `Abrindo detalhes do treino ID: ${id}`,
    });
  };

  const handleStartWorkout = (id: number) => {
    toast({
      title: "Iniciar Treino",
      description: `Iniciando o treino ID: ${id}`,
    });
  };

  const handleViewProgress = () => {
    toast({
      title: "Ver Progresso",
      description: "Abrindo página detalhada de progresso",
    });
  };

  const handleViewSession = (id: number) => {
    toast({
      title: "Ver Agendamento",
      description: `Abrindo detalhes da sessão ID: ${id}`,
    });
  };

  const getStatusBadge = (status: string) => {
    const statuses = {
      scheduled: { label: "Agendado", variant: "primary" },
      completed: { label: "Concluído", variant: "success" },
      canceled: { label: "Cancelado", variant: "destructive" }
    };
    
    const config = statuses[status as keyof typeof statuses] || { label: status, variant: "secondary" };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  const getWorkoutStatusBadge = (status: string) => {
    const statuses = {
      "completed": { label: "Concluído", variant: "success" },
      "in-progress": { label: "Em Andamento", variant: "warning" },
      "not-started": { label: "Não Iniciado", variant: "secondary" }
    };
    
    const config = statuses[status as keyof typeof statuses] || { label: status, variant: "secondary" };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-lightest">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 overflow-y-auto">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <header className="flex justify-between items-center mb-6">
            <div>
              <h1 className="font-heading font-bold text-xl md:text-2xl">Meu Painel</h1>
              <p className="text-neutral-medium text-sm">Bem-vinda, {user?.name}</p>
            </div>
          </header>
          
          {/* Progress Summary */}
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Meu Progresso</CardTitle>
                <CardDescription>
                  Acompanhe sua evolução
                </CardDescription>
              </div>
              <Button variant="outline" onClick={handleViewProgress}>
                <BarChart2 className="mr-2 h-4 w-4" /> Ver Detalhes
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Estatísticas</h3>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-neutral-lightest rounded-lg p-3 text-center">
                      <p className="text-neutral-medium text-xs mb-1">Sequência</p>
                      <p className="font-heading font-bold text-xl">{dashboardData?.progress.streak}</p>
                      <p className="text-neutral-medium text-xs">dias</p>
                    </div>
                    <div className="bg-neutral-lightest rounded-lg p-3 text-center">
                      <p className="text-neutral-medium text-xs mb-1">Semana</p>
                      <p className="font-heading font-bold text-xl">{dashboardData?.progress.weeklyWorkouts}</p>
                      <p className="text-neutral-medium text-xs">treinos</p>
                    </div>
                    <div className="bg-neutral-lightest rounded-lg p-3 text-center">
                      <p className="text-neutral-medium text-xs mb-1">Mês</p>
                      <p className="font-heading font-bold text-xl">{dashboardData?.progress.monthlyWorkouts}</p>
                      <p className="text-neutral-medium text-xs">treinos</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium text-sm">Metas</h3>
                    {dashboardData?.progress.goals.map((goal, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{goal.name}</span>
                          <span>
                            {goal.current}/{goal.target}
                          </span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Evolução</h3>
                    <div className="flex gap-2 text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-primary mr-1"></div>
                        <span>Peso (kg)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-accent mr-1"></div>
                        <span>Gordura (%)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={dashboardData?.progress.weight.map((item, index) => ({
                          date: item.date,
                          weight: item.value,
                          bodyFat: dashboardData.progress.bodyFat[index].value
                        }))}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" />
                        <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--accent))" />
                        <Tooltip />
                        <Line 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="weight" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          activeDot={{ r: 8 }} 
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="bodyFat" 
                          stroke="hsl(var(--accent))" 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Current Workouts */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Meus Treinos Atuais</CardTitle>
              <CardDescription>
                Veja seus treinos programados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dashboardData?.workouts.map(workout => (
                  <div 
                    key={workout.id} 
                    className="bg-white rounded-xl shadow-sm overflow-hidden border border-neutral-light"
                  >
                    <div className="relative overflow-hidden h-32">
                      <img 
                        src={workout.image} 
                        alt={workout.title} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary to-transparent opacity-70"></div>
                      <div className="absolute bottom-0 left-0 p-3 text-white">
                        <h3 className="font-heading font-semibold text-sm">{workout.title}</h3>
                        <p className="text-xs">Nível {workout.level}</p>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs flex items-center">
                          <i className="ri-time-line mr-1"></i> {workout.duration}
                        </span>
                        {getWorkoutStatusBadge(workout.completionStatus)}
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-neutral-medium mb-1">
                          <span>Progresso</span>
                          <span>{workout.progress}%</span>
                        </div>
                        <Progress value={workout.progress} className="h-1.5" />
                      </div>
                      
                      <div className="flex mt-2 space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleViewWorkout(workout.id)}
                        >
                          Ver
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleStartWorkout(workout.id)}
                        >
                          <Play className="mr-1 h-3 w-3" /> Iniciar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Upcoming Sessions and Payment Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming Sessions */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Próximas Sessões</CardTitle>
                  <CardDescription>
                    Seus próximos agendamentos
                  </CardDescription>
                </div>
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" /> Ver Agenda
                </Button>
              </CardHeader>
              <CardContent>
                {dashboardData?.sessions.length ? (
                  <div className="space-y-3">
                    {dashboardData.sessions.map(session => (
                      <div 
                        key={session.id}
                        className="flex justify-between items-center p-3 bg-neutral-lightest rounded-lg hover:bg-neutral-light/50 transition-colors cursor-pointer"
                        onClick={() => handleViewSession(session.id)}
                      >
                        <div className="flex items-center">
                          <div className="bg-primary bg-opacity-10 rounded-full p-2 mr-3">
                            {session.type === "training" && <Heart className="h-5 w-5 text-primary" />}
                            {session.type === "evaluation" && <BarChart2 className="h-5 w-5 text-primary" />}
                            {session.type === "group" && <i className="ri-group-line text-primary text-xl"></i>}
                          </div>
                          <div>
                            <h4 className="font-medium">{session.title}</h4>
                            <div className="flex items-center text-neutral-medium text-sm">
                              <span className="mr-2">{session.date}</span>
                              <span className="mr-2">•</span>
                              <span>{session.subtitle}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          {getStatusBadge(session.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="bg-neutral-light bg-opacity-30 rounded-full p-6 mb-4 w-fit mx-auto">
                      <i className="ri-calendar-line text-4xl text-neutral-medium"></i>
                    </div>
                    <h3 className="text-xl font-medium mb-2">Nenhum agendamento</h3>
                    <p className="text-neutral-medium max-w-md mx-auto mb-6">
                      Você não tem sessões agendadas no momento.
                    </p>
                    <Button>
                      <Calendar className="mr-2 h-4 w-4" /> Agendar Sessão
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Pagamento</CardTitle>
                <CardDescription>
                  Informações de pagamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData?.payments.nextPayment && (
                  <div>
                    <div className="p-4 bg-neutral-lightest rounded-lg">
                      <h3 className="font-medium mb-3">Próximo Pagamento</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-neutral-medium">Vencimento:</span>
                          <span className="font-medium">{dashboardData.payments.nextPayment.dueDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-medium">Valor:</span>
                          <span className="font-medium">{dashboardData.payments.nextPayment.amount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-medium">Status:</span>
                          <Badge variant="warning">Pendente</Badge>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Button className="w-full">
                          Realizar Pagamento
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-center">
                      <Button variant="link">
                        Ver histórico de pagamentos
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <MobileNavigation />
    </div>
  );
}
