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
import { Calendar } from "@/components/ui/calendar";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus } from "lucide-react";
import SessionItem from "@/components/dashboard/session-item";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function SchedulePage() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showAddSession, setShowAddSession] = useState(false);
  
  // Fetch schedule data
  const { data: scheduleData, isLoading } = useQuery({
    queryKey: ["/api/schedule", selectedDate ? format(selectedDate, 'yyyy-MM-dd') : 'all'],
    queryFn: async () => {
      // Mock data for initial design
      return {
        sessions: [
          {
            id: 1,
            date: new Date(2023, 3, 21), // April 21, 2023
            time: "15:00",
            title: "Avaliação Física",
            subtitle: "Ana Paula Santos",
            variant: "primary",
            description: "Primeira avaliação física completa"
          },
          {
            id: 2,
            date: new Date(2023, 3, 21), // April 21, 2023
            time: "17:30",
            title: "Treino Funcional",
            subtitle: "Grupo (4 alunas)",
            variant: "accent",
            description: "Treino funcional em grupo focado em HIIT"
          },
          {
            id: 3,
            date: new Date(2023, 3, 22), // April 22, 2023
            time: "09:00",
            title: "Consultoria Online",
            subtitle: "Rafaela Mendonça",
            variant: "secondary",
            description: "Consultoria para montagem de plano alimentar"
          },
          {
            id: 4,
            date: new Date(2023, 3, 23), // April 23, 2023
            time: "10:30",
            title: "Aula de Yoga",
            subtitle: "Grupo (3 alunas)",
            variant: "primary",
            description: "Aula de yoga para iniciantes"
          },
          {
            id: 5,
            date: new Date(2023, 3, 24), // April 24, 2023
            time: "16:00",
            title: "Treino Personal",
            subtitle: "Juliana Costa",
            variant: "accent",
            description: "Treino focado em hipertrofia de glúteos"
          }
        ]
      };
    }
  });

  const selectedDateSessions = scheduleData?.sessions.filter(session => 
    selectedDate && 
    session.date.getDate() === selectedDate.getDate() &&
    session.date.getMonth() === selectedDate.getMonth() &&
    session.date.getFullYear() === selectedDate.getFullYear()
  );

  const formatSelectedDate = (date: Date) => {
    return format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
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
          <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <div>
              <h1 className="font-heading font-bold text-xl md:text-2xl">Agenda</h1>
              <p className="text-neutral-medium text-sm">Gerencie seus agendamentos e sessões</p>
            </div>
            
            <Dialog open={showAddSession} onOpenChange={setShowAddSession}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Novo Agendamento
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Criar Novo Agendamento</DialogTitle>
                  <DialogDescription>
                    Agende uma nova sessão de treino ou avaliação.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right">Tipo</label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione o tipo de sessão" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="training">Treino</SelectItem>
                        <SelectItem value="evaluation">Avaliação Física</SelectItem>
                        <SelectItem value="consultation">Consultoria</SelectItem>
                        <SelectItem value="group">Aula em Grupo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right">Aluna</label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione uma aluna" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ana">Ana Paula Santos</SelectItem>
                        <SelectItem value="mariana">Mariana Silva</SelectItem>
                        <SelectItem value="juliana">Juliana Costa</SelectItem>
                        <SelectItem value="group">Grupo (Múltiplas alunas)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right">Data</label>
                    <Input 
                      className="col-span-3" 
                      type="date" 
                      defaultValue={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right">Horário</label>
                    <Input 
                      className="col-span-3" 
                      type="time" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right">Duração</label>
                    <div className="col-span-3 flex gap-2 items-center">
                      <Input type="number" placeholder="Minutos" defaultValue="60" />
                      <span>minutos</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <label className="text-right pt-2">Observações</label>
                    <Textarea 
                      className="col-span-3" 
                      placeholder="Adicione detalhes importantes..." 
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddSession(false)}>Cancelar</Button>
                  <Button onClick={() => setShowAddSession(false)}>Agendar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </header>
          
          {/* Calendar and Sessions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Calendário</CardTitle>
                <CardDescription>
                  Selecione uma data para ver os agendamentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
            
            {/* Sessions for selected date */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Sessões Agendadas</CardTitle>
                  <CardDescription>
                    {selectedDate ? formatSelectedDate(selectedDate) : "Selecione uma data"}
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowAddSession(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Adicionar
                </Button>
              </CardHeader>
              <CardContent>
                {selectedDateSessions && selectedDateSessions.length > 0 ? (
                  <div className="divide-y divide-neutral-light">
                    {selectedDateSessions.map(session => (
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
                ) : (
                  <div className="text-center py-10">
                    <div className="bg-neutral-light bg-opacity-30 rounded-full p-6 mb-4 w-fit mx-auto">
                      <i className="ri-calendar-line text-4xl text-neutral-medium"></i>
                    </div>
                    <h3 className="text-xl font-medium mb-2">Nenhum agendamento</h3>
                    <p className="text-neutral-medium max-w-md mx-auto mb-6">
                      Não há sessões agendadas para esta data. 
                      Você pode adicionar um novo agendamento clicando no botão abaixo.
                    </p>
                    <Button onClick={() => setShowAddSession(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Novo Agendamento
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Upcoming Sessions Overview */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Próximos Agendamentos</CardTitle>
              <CardDescription>
                Visão geral dos próximos 5 dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, index) => {
                  const date = new Date();
                  date.setDate(date.getDate() + index);
                  
                  const formattedDate = format(date, "EEE, d MMM", { locale: ptBR });
                  const dateSessions = scheduleData?.sessions.filter(session => 
                    session.date.getDate() === date.getDate() &&
                    session.date.getMonth() === date.getMonth() &&
                    session.date.getFullYear() === date.getFullYear()
                  );
                  
                  return (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="p-3 bg-neutral-lightest">
                        <CardTitle className="text-sm font-medium">
                          {formattedDate}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        {dateSessions && dateSessions.length > 0 ? (
                          <div className="divide-y divide-neutral-light">
                            {dateSessions.map(session => (
                              <div key={session.id} className="p-3">
                                <div className="flex items-center gap-2">
                                  <div className={`bg-${session.variant} bg-opacity-10 text-${session.variant} rounded-lg p-1 flex items-center justify-center`}>
                                    <span className="text-xs font-medium">{session.time}</span>
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">{session.title}</p>
                                    <p className="text-neutral-medium text-xs">{session.subtitle}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 text-center">
                            <p className="text-neutral-medium text-sm">Sem agendamentos</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <MobileNavigation />
    </div>
  );
}
