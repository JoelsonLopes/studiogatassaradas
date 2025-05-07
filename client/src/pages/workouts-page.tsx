import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import MobileNavigation from "@/components/layout/mobile-navigation";
import WorkoutCard from "@/components/dashboard/workout-card";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Loader2 } from "lucide-react";

export default function WorkoutsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  
  // Fetch workouts data
  const { data: workouts, isLoading } = useQuery({
    queryKey: ["/api/workouts"],
    queryFn: async () => {
      // Mock data for initial design
      return [
        {
          id: 1,
          title: "Pernas e Glúteos",
          level: "Intermediário",
          duration: "45 min",
          studentsCount: 14,
          category: "lower",
          image: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
          tag: { label: "Mais popular", variant: "primary" }
        },
        {
          id: 2,
          title: "Abdômen & Core",
          level: "Básico",
          duration: "30 min",
          studentsCount: 8,
          category: "core",
          image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
          tag: { label: "Novo", variant: "accent" }
        },
        {
          id: 3,
          title: "Braços & Costas",
          level: "Avançado",
          duration: "50 min",
          studentsCount: 6,
          category: "upper",
          image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
          tag: { label: "Intenso", variant: "secondary" }
        },
        {
          id: 4,
          title: "Full Body",
          level: "Todos os níveis",
          duration: "60 min",
          studentsCount: 10,
          category: "full",
          image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
          tag: { label: "Completo", variant: "neutral" }
        },
        {
          id: 5,
          title: "Cardio Intenso",
          level: "Intermediário",
          duration: "40 min",
          studentsCount: 7,
          category: "cardio",
          image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
        },
        {
          id: 6,
          title: "HIIT Funcional",
          level: "Avançado",
          duration: "30 min",
          studentsCount: 5,
          category: "hiit",
          image: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
        },
        {
          id: 7,
          title: "Yoga & Flexibilidade",
          level: "Todos os níveis",
          duration: "45 min",
          studentsCount: 9,
          category: "mobility",
          image: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
          tag: { label: "Relaxante", variant: "accent" }
        },
        {
          id: 8,
          title: "Treino para Iniciantes",
          level: "Básico",
          duration: "40 min",
          studentsCount: 12,
          category: "beginner",
          image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
        }
      ];
    }
  });

  const filteredWorkouts = workouts?.filter(workout => {
    const matchesSearch = workout.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = currentTab === "all" || workout.category === currentTab;
    return matchesSearch && matchesCategory;
  });

  const handleWorkoutEdit = (id: number) => {
    toast({
      title: "Editar Treino",
      description: `Edição do treino ID: ${id} iniciada`,
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
              <h1 className="font-heading font-bold text-xl md:text-2xl">Treinos</h1>
              <p className="text-neutral-medium text-sm">Gerencie e crie programas de treino</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-medium h-4 w-4" />
                <Input 
                  placeholder="Buscar treinos..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} 
                />
              </div>
              <Dialog open={showAddWorkout} onOpenChange={setShowAddWorkout}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Novo Treino
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Criar Novo Treino</DialogTitle>
                    <DialogDescription>
                      Crie um novo programa de treino para suas alunas.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right">Nome do Treino</label>
                      <Input className="col-span-3" placeholder="Ex: Pernas e Glúteos" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right">Categoria</label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lower">Pernas e Glúteos</SelectItem>
                          <SelectItem value="upper">Braços e Costas</SelectItem>
                          <SelectItem value="core">Abdômen e Core</SelectItem>
                          <SelectItem value="full">Full Body</SelectItem>
                          <SelectItem value="cardio">Cardio</SelectItem>
                          <SelectItem value="hiit">HIIT</SelectItem>
                          <SelectItem value="mobility">Mobilidade</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right">Nível</label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecione um nível" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Básico</SelectItem>
                          <SelectItem value="intermediate">Intermediário</SelectItem>
                          <SelectItem value="advanced">Avançado</SelectItem>
                          <SelectItem value="all">Todos os níveis</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right">Duração</label>
                      <div className="col-span-3 flex gap-2 items-center">
                        <Input type="number" placeholder="Minutos" />
                        <span>minutos</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <label className="text-right pt-2">Descrição</label>
                      <Textarea 
                        className="col-span-3" 
                        placeholder="Descreva o treino em detalhes..." 
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right">Imagem</label>
                      <Input 
                        className="col-span-3" 
                        type="file" 
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddWorkout(false)}>Cancelar</Button>
                    <Button onClick={() => setShowAddWorkout(false)}>Criar Treino</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </header>
          
          {/* Workout Tabs and Cards */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Programas de Treino</CardTitle>
              <CardDescription>
                Gerencie todos os seus programas de treino
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" onValueChange={setCurrentTab}>
                <TabsList className="mb-6 flex justify-start overflow-x-auto pb-2 scrollbar-hide">
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="lower">Pernas e Glúteos</TabsTrigger>
                  <TabsTrigger value="upper">Braços e Costas</TabsTrigger>
                  <TabsTrigger value="core">Abdômen</TabsTrigger>
                  <TabsTrigger value="full">Full Body</TabsTrigger>
                  <TabsTrigger value="cardio">Cardio</TabsTrigger>
                  <TabsTrigger value="hiit">HIIT</TabsTrigger>
                </TabsList>
                
                <TabsContent value={currentTab} className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredWorkouts?.length ? (
                      filteredWorkouts.map(workout => (
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
                      ))
                    ) : (
                      <div className="col-span-full flex flex-col items-center justify-center py-10 text-center">
                        <div className="bg-neutral-light bg-opacity-30 rounded-full p-6 mb-4">
                          <i className="ri-file-search-line text-4xl text-neutral-medium"></i>
                        </div>
                        <h3 className="text-xl font-medium mb-2">Nenhum treino encontrado</h3>
                        <p className="text-neutral-medium max-w-md mb-6">
                          Não encontramos nenhum treino que corresponda aos critérios de pesquisa. 
                          Tente ajustar seus filtros ou criar um novo treino.
                        </p>
                        <Button onClick={() => setShowAddWorkout(true)}>
                          <Plus className="mr-2 h-4 w-4" /> Criar Novo Treino
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <MobileNavigation />
    </div>
  );
}
