import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import MobileNavigation from "@/components/layout/mobile-navigation";
import StatsCard from "@/components/dashboard/stats-card";
import ActivityItem from "@/components/dashboard/activity-item";
import SessionItem from "@/components/dashboard/session-item";
import WorkoutCard from "@/components/dashboard/workout-card";
import PaymentItem from "@/components/dashboard/payment-item";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/dashboard"],
    queryFn: async () => {
      // Mock data for initial design
      return {
        stats: {
          students: { value: 28, trend: { value: "12% desde o mês passado", positive: true } },
          sessions: { value: 16, trend: { value: "4 para esta semana", positive: true } },
          revenue: { value: "R$ 4.250", trend: { value: "8% desde o mês passado", positive: true } }
        },
        activities: [
          {
            id: 1,
            user: { name: "Mariana Silva", profilePicture: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
            action: "Completou o treino \"Pernas e Glúteos - Intenso\"",
            timestamp: "Hoje, 14:30",
            status: "completed"
          },
          {
            id: 2,
            user: { name: "Camila Rocha", profilePicture: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
            action: "Realizou o pagamento da mensalidade (Plano Trimestral)",
            timestamp: "Ontem, 09:15",
            status: "payment"
          },
          {
            id: 3,
            user: { name: "Beatriz Mendes", profilePicture: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
            action: "Iniciou o plano mensal e completou a avaliação inicial",
            timestamp: "20/04/2023, 10:00",
            status: "new"
          },
          {
            id: 4,
            user: { name: "Juliana Costa", profilePicture: "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
            action: "Cancelou a sessão agendada para 22/04",
            timestamp: "19/04/2023, 18:45",
            status: "canceled"
          }
        ],
        sessions: [
          {
            id: 1,
            time: "15:00",
            title: "Avaliação Física",
            subtitle: "Ana Paula Santos",
            variant: "primary"
          },
          {
            id: 2,
            time: "17:30",
            title: "Treino Funcional",
            subtitle: "Grupo (4 alunas)",
            variant: "accent"
          },
          {
            id: 3,
            time: "09:00",
            title: "Consultoria Online",
            subtitle: "Rafaela Mendonça",
            variant: "secondary",
            day: "tomorrow"
          }
        ],
        workouts: [
          {
            id: 1,
            title: "Pernas e Glúteos",
            level: "Intermediário",
            duration: "45 min",
            studentsCount: 14,
            image: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
            tag: { label: "Mais popular", variant: "primary" }
          },
          {
            id: 2,
            title: "Abdômen & Core",
            level: "Básico",
            duration: "30 min",
            studentsCount: 8,
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
            tag: { label: "Novo", variant: "accent" }
          },
          {
            id: 3,
            title: "Braços & Costas",
            level: "Avançado",
            duration: "50 min",
            studentsCount: 6,
            image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
            tag: { label: "Intenso", variant: "secondary" }
          },
          {
            id: 4,
            title: "Full Body",
            level: "Todos os níveis",
            duration: "60 min",
            studentsCount: 10,
            image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
            tag: { label: "Completo", variant: "neutral" }
          }
        ],
        revenueChart: [
          { month: "Jan", value: 2400 },
          { month: "Fev", value: 3100 },
          { month: "Mar", value: 3800 },
          { month: "Abr", value: 4250 },
          { month: "Mai", value: 0 },
          { month: "Jun", value: 0 }
        ],
        payments: [
          {
            id: 1,
            plan: "Plano Trimestral",
            studentName: "Camila Rocha",
            date: "20/04/2023",
            amount: "R$ 720,00",
            status: "paid"
          },
          {
            id: 2,
            plan: "Plano Mensal",
            studentName: "Beatriz Mendes",
            date: "20/04/2023",
            amount: "R$ 280,00",
            status: "paid"
          },
          {
            id: 3,
            plan: "Plano Semestral",
            studentName: "Gabriela Lima",
            date: "18/04/2023",
            amount: "R$ 1.350,00",
            status: "paid"
          },
          {
            id: 4,
            plan: "Plano Mensal",
            studentName: "Fernanda Souza",
            date: "15/04/2023",
            amount: "R$ 280,00",
            status: "pending"
          }
        ]
      };
    }
  });

  const handleWorkoutEdit = (id: number) => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: `Edição do treino ID: ${id} estará disponível em breve`,
    });
  };

  const handleSessionAction = (id: number, action: string) => {
    toast({
      title: `${action} agendamento`,
      description: `Ação ${action.toLowerCase()} para o agendamento ID: ${id}`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
              <h1 className="font-heading font-bold text-xl md:text-2xl">Dashboard da Treinadora</h1>
              <p className="text-neutral-medium text-sm">Bem-vinda de volta, {user?.name}</p>
            </div>
            
            <div className="flex items-center">
              <div className="relative mr-2">
                <button className="p-2 rounded-full hover:bg-neutral-light">
                  <i className="ri-notification-3-line text-lg"></i>
                  <span className="absolute top-1 right-1 bg-primary rounded-full w-2 h-2"></span>
                </button>
              </div>
              <button 
                className="p-2 rounded-full hover:bg-neutral-light md:hidden"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <i className="ri-menu-line text-lg"></i>
              </button>
            </div>
          </header>
          
          {/* Dashboard Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatsCard 
              title="Total de Alunas"
              value={dashboardData?.stats.students.value || 0}
              icon="ri-user-follow-line"
              trend={dashboardData?.stats.students.trend}
              variant="primary"
            />
            
            <StatsCard 
              title="Sessões Agendadas"
              value={dashboardData?.stats.sessions.value || 0}
              icon="ri-calendar-check-line"
              trend={dashboardData?.stats.sessions.trend}
              variant="accent"
            />
            
            <StatsCard 
              title="Faturamento Mensal"
              value={dashboardData?.stats.revenue.value || "R$ 0"}
              icon="ri-money-dollar-circle-line"
              trend={dashboardData?.stats.revenue.trend}
              variant="secondary"
            />
          </div>
          
          {/* Recent Activities and Upcoming Sessions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Recent Activities */}
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-heading font-semibold text-lg">Atividades Recentes</h2>
                <Button variant="link" className="text-primary">
                  Ver todas
                </Button>
              </div>
              
              <Card className="overflow-hidden">
                <div className="divide-y divide-neutral-light">
                  {dashboardData?.activities.map((activity) => (
                    <ActivityItem 
                      key={activity.id}
                      user={activity.user}
                      action={activity.action}
                      timestamp={activity.timestamp}
                      status={activity.status as any}
                    />
                  ))}
                </div>
              </Card>
            </div>
            
            {/* Upcoming Sessions */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-heading font-semibold text-lg">Próximas Sessões</h2>
                <Button variant="link" className="text-primary">
                  Ver agenda
                </Button>
              </div>
              
              <Card className="overflow-hidden">
                <div className="p-4 border-b border-neutral-light bg-neutral-lightest">
                  <div className="flex justify-between items-center">
                    <h3 className="font-heading font-medium">Hoje, 21 Abril</h3>
                    <Button variant="ghost" size="sm" className="text-primary text-sm">
                      <i className="ri-add-line mr-1"></i> Adicionar
                    </Button>
                  </div>
                </div>
                
                <div className="divide-y divide-neutral-light">
                  {dashboardData?.sessions
                    .filter(session => !session.day)
                    .map(session => (
                      <SessionItem 
                        key={session.id}
                        time={session.time}
                        title={session.title}
                        subtitle={session.subtitle}
                        variant={session.variant as any}
                        onEdit={() => handleSessionAction(session.id, "Editar")}
                        onDelete={() => handleSessionAction(session.id, "Cancelar")}
                      />
                    ))}
                </div>
                
                <div className="p-4 border-t border-neutral-light bg-neutral-lightest">
                  <div className="flex justify-between items-center">
                    <h3 className="font-heading font-medium">Amanhã, 22 Abril</h3>
                  </div>
                </div>
                
                <div className="divide-y divide-neutral-light">
                  {dashboardData?.sessions
                    .filter(session => session.day === "tomorrow")
                    .map(session => (
                      <SessionItem 
                        key={session.id}
                        time={session.time}
                        title={session.title}
                        subtitle={session.subtitle}
                        variant={session.variant as any}
                        onEdit={() => handleSessionAction(session.id, "Editar")}
                        onDelete={() => handleSessionAction(session.id, "Cancelar")}
                      />
                    ))}
                </div>
              </Card>
            </div>
          </div>
          
          {/* Workout Programs Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-heading font-semibold text-lg">Programas de Treino</h2>
              <Button variant="link" className="text-primary">
                Gerenciar programas
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {dashboardData?.workouts.map(workout => (
                <WorkoutCard
                  key={workout.id}
                  title={workout.title}
                  level={workout.level}
                  duration={workout.duration}
                  studentsCount={workout.studentsCount}
                  image={workout.image}
                  tag={workout.tag}
                  onEdit={() => handleWorkoutEdit(workout.id)}
                />
              ))}
            </div>
          </div>
          
          {/* Financial Overview Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-heading font-semibold text-lg">Visão Financeira</h2>
              <div className="flex items-center">
                <select className="appearance-none bg-white border border-neutral-light rounded-lg py-1 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary mr-3">
                  <option>Abril 2023</option>
                  <option>Março 2023</option>
                  <option>Fevereiro 2023</option>
                </select>
                <Button variant="link" className="text-primary">
                  Relatórios detalhados
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2 p-4">
                <h3 className="font-heading font-medium mb-3">Receita Mensal</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dashboardData?.revenueChart}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`R$ ${value}`, "Receita"]}
                        labelFormatter={(label) => `Mês: ${label}`}
                      />
                      <Bar dataKey="value" fill="hsl(var(--primary))" barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              
              <Card className="overflow-hidden">
                <div className="p-4 border-b border-neutral-light">
                  <h3 className="font-heading font-medium">Pagamentos Recentes</h3>
                </div>
                
                <div className="divide-y divide-neutral-light">
                  {dashboardData?.payments.map(payment => (
                    <PaymentItem 
                      key={payment.id}
                      plan={payment.plan}
                      studentName={payment.studentName}
                      date={payment.date}
                      amount={payment.amount}
                      status={payment.status as any}
                    />
                  ))}
                </div>
                
                <div className="p-4 border-t border-neutral-light">
                  <Button variant="link" className="w-full text-primary text-sm">
                    Ver todos os pagamentos
                    <i className="ri-arrow-right-line ml-1"></i>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <MobileNavigation />
    </div>
  );
}
