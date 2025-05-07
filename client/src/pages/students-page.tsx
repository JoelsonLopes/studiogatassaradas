import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import MobileNavigation from "@/components/layout/mobile-navigation";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Search, Plus, Filter } from "lucide-react";

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddStudent, setShowAddStudent] = useState(false);
  
  // Fetch students data
  const { data: students, isLoading } = useQuery({
    queryKey: ["/api/students"],
    queryFn: async () => {
      // Mock data for initial design
      return [
        {
          id: 1,
          name: "Mariana Silva",
          email: "mariana.silva@email.com",
          phone: "(11) 98765-4321",
          status: "active", 
          plan: "Mensal",
          profilePicture: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
          joinDate: "15/03/2023",
          lastActivity: "Hoje, 14:30"
        },
        {
          id: 2,
          name: "Camila Rocha",
          email: "camila.rocha@email.com",
          phone: "(11) 98765-4322",
          status: "active",
          plan: "Trimestral",
          profilePicture: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
          joinDate: "10/01/2023",
          lastActivity: "Ontem, 09:15"
        },
        {
          id: 3,
          name: "Beatriz Mendes",
          email: "beatriz.mendes@email.com",
          phone: "(11) 98765-4323",
          status: "active",
          plan: "Mensal",
          profilePicture: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
          joinDate: "20/04/2023",
          lastActivity: "20/04/2023, 10:00"
        },
        {
          id: 4,
          name: "Juliana Costa",
          email: "juliana.costa@email.com",
          phone: "(11) 98765-4324",
          status: "inactive",
          plan: "Mensal",
          profilePicture: "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
          joinDate: "05/12/2022",
          lastActivity: "19/04/2023, 18:45"
        },
        {
          id: 5,
          name: "Fernanda Souza",
          email: "fernanda.souza@email.com",
          phone: "(11) 98765-4325",
          status: "pending",
          plan: "Mensal",
          profilePicture: null,
          joinDate: "15/03/2023",
          lastActivity: "15/04/2023, 16:20"
        },
        {
          id: 6,
          name: "Gabriela Lima",
          email: "gabriela.lima@email.com",
          phone: "(11) 98765-4326",
          status: "active",
          plan: "Semestral",
          profilePicture: null,
          joinDate: "10/02/2023",
          lastActivity: "18/04/2023, 11:30"
        }
      ];
    }
  });

  const filteredStudents = students?.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusStyles = {
    active: "bg-success bg-opacity-10 text-success",
    inactive: "bg-danger bg-opacity-10 text-danger",
    pending: "bg-warning bg-opacity-10 text-warning"
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      active: "Ativo",
      inactive: "Inativo",
      pending: "Pendente"
    };
    return labels[status as keyof typeof labels] || status;
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
              <h1 className="font-heading font-bold text-xl md:text-2xl">Alunas</h1>
              <p className="text-neutral-medium text-sm">Gerencie suas alunas e seus dados</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-medium h-4 w-4" />
                <Input 
                  placeholder="Buscar alunas..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} 
                />
              </div>
              <Dialog open={showAddStudent} onOpenChange={setShowAddStudent}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Nova Aluna
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Nova Aluna</DialogTitle>
                    <DialogDescription>
                      Preencha as informações para cadastrar uma nova aluna no sistema.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right">Nome</label>
                      <Input className="col-span-3" placeholder="Nome completo" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right">Email</label>
                      <Input className="col-span-3" type="email" placeholder="email@exemplo.com" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right">Telefone</label>
                      <Input className="col-span-3" placeholder="(00) 00000-0000" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right">Plano</label>
                      <select className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <option>Mensal</option>
                        <option>Trimestral</option>
                        <option>Semestral</option>
                        <option>Anual</option>
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddStudent(false)}>Cancelar</Button>
                    <Button onClick={() => setShowAddStudent(false)}>Cadastrar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </header>
          
          {/* Statistics cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-neutral-medium text-sm">Total de Alunas</p>
                    <h3 className="font-heading font-bold text-2xl">{students?.length || 0}</h3>
                  </div>
                  <div className="bg-primary bg-opacity-10 rounded-lg p-3">
                    <i className="ri-user-follow-line text-primary text-xl"></i>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-neutral-medium text-sm">Alunas Ativas</p>
                    <h3 className="font-heading font-bold text-2xl">
                      {students?.filter(s => s.status === "active").length || 0}
                    </h3>
                  </div>
                  <div className="bg-success bg-opacity-10 rounded-lg p-3">
                    <i className="ri-heart-pulse-line text-success text-xl"></i>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-neutral-medium text-sm">Novas este mês</p>
                    <h3 className="font-heading font-bold text-2xl">2</h3>
                  </div>
                  <div className="bg-accent bg-opacity-10 rounded-lg p-3">
                    <i className="ri-user-add-line text-accent text-xl"></i>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Students Table */}
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Lista de Alunas</CardTitle>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" /> Filtrar
                </Button>
              </div>
              <CardDescription>
                Total de {filteredStudents?.length || 0} alunas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aluna</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data de Inscrição</TableHead>
                    <TableHead>Última Atividade</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents?.map(student => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={student.profilePicture || undefined} />
                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-neutral-medium">{student.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{student.plan}</TableCell>
                      <TableCell>
                        <Badge 
                          className={statusStyles[student.status as keyof typeof statusStyles]}
                          variant="outline"
                        >
                          {getStatusLabel(student.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{student.joinDate}</TableCell>
                      <TableCell>{student.lastActivity}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon">
                            <i className="ri-eye-line"></i>
                          </Button>
                          <Button variant="outline" size="icon">
                            <i className="ri-edit-line"></i>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-neutral-medium">
                Mostrando {filteredStudents?.length || 0} de {students?.length || 0} alunas
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>Anterior</Button>
                <Button variant="outline" size="sm" disabled>Próxima</Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <MobileNavigation />
    </div>
  );
}
