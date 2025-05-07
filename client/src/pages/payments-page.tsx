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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Loader2, Plus, Search, FileText, Download } from "lucide-react";

export default function PaymentsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("Abril 2023");
  
  const isTrainer = user?.role === "trainer";
  
  // Fetch payments data
  const { data: paymentsData, isLoading } = useQuery({
    queryKey: ["/api/payments"],
    queryFn: async () => {
      // Mock data for initial design
      if (isTrainer) {
        return {
          payments: [
            {
              id: 1,
              studentName: "Camila Rocha",
              plan: "Trimestral",
              amount: "R$ 720,00",
              status: "paid",
              date: "20/04/2023",
              dueDate: "20/04/2023",
              method: "credit_card",
              reference: "INV-2023-001"
            },
            {
              id: 2,
              studentName: "Beatriz Mendes",
              plan: "Mensal",
              amount: "R$ 280,00",
              status: "paid",
              date: "20/04/2023",
              dueDate: "20/04/2023",
              method: "credit_card",
              reference: "INV-2023-002"
            },
            {
              id: 3,
              studentName: "Gabriela Lima",
              plan: "Semestral",
              amount: "R$ 1.350,00",
              status: "paid",
              date: "18/04/2023",
              dueDate: "18/04/2023",
              method: "bank_transfer",
              reference: "INV-2023-003"
            },
            {
              id: 4,
              studentName: "Fernanda Souza",
              plan: "Mensal",
              amount: "R$ 280,00",
              status: "pending",
              date: "15/04/2023",
              dueDate: "20/04/2023",
              method: null,
              reference: "INV-2023-004"
            },
            {
              id: 5,
              studentName: "Ana Paula Santos",
              plan: "Anual",
              amount: "R$ 2.520,00",
              status: "paid",
              date: "10/04/2023",
              dueDate: "10/04/2023",
              method: "credit_card",
              reference: "INV-2023-005"
            },
            {
              id: 6,
              studentName: "Mariana Silva",
              plan: "Mensal",
              amount: "R$ 280,00",
              status: "overdue",
              date: "05/04/2023",
              dueDate: "10/04/2023",
              method: null,
              reference: "INV-2023-006"
            },
            {
              id: 7,
              studentName: "Juliana Costa",
              plan: "Mensal",
              amount: "R$ 280,00",
              status: "canceled",
              date: "01/04/2023",
              dueDate: "05/04/2023",
              method: null,
              reference: "INV-2023-007"
            }
          ],
          statistics: {
            total: "R$ 5.710,00",
            paid: "R$ 4.870,00",
            pending: "R$ 560,00",
            overdue: "R$ 280,00"
          },
          monthlyChart: [
            { month: "Janeiro", amount: 3800 },
            { month: "Fevereiro", amount: 4200 },
            { month: "Março", amount: 4800 },
            { month: "Abril", amount: 5710 }
          ],
          planChart: [
            { plan: "Mensal", amount: 1120 },
            { plan: "Trimestral", amount: 720 },
            { plan: "Semestral", amount: 1350 },
            { plan: "Anual", amount: 2520 }
          ]
        };
      } else {
        // Student view
        return {
          payments: [
            {
              id: 1,
              plan: "Mensal",
              amount: "R$ 280,00",
              status: "paid",
              date: "20/03/2023",
              dueDate: "20/03/2023",
              method: "credit_card",
              reference: "INV-2023-001"
            },
            {
              id: 2,
              plan: "Mensal",
              amount: "R$ 280,00",
              status: "paid",
              date: "20/02/2023",
              dueDate: "20/02/2023",
              method: "credit_card",
              reference: "INV-2023-002"
            },
            {
              id: 3,
              plan: "Mensal",
              amount: "R$ 280,00",
              status: "paid",
              date: "20/01/2023",
              dueDate: "20/01/2023",
              method: "bank_transfer",
              reference: "INV-2023-003"
            },
            {
              id: 4,
              plan: "Mensal",
              amount: "R$ 280,00",
              status: "upcoming",
              date: null,
              dueDate: "20/04/2023",
              method: null,
              reference: "INV-2023-004"
            }
          ],
          nextPayment: {
            dueDate: "20/04/2023",
            amount: "R$ 280,00",
            status: "upcoming"
          }
        };
      }
    }
  });

  const filteredPayments = paymentsData?.payments.filter(payment => {
    const matchesSearch = isTrainer 
      ? payment.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || payment.reference.toLowerCase().includes(searchQuery.toLowerCase())
      : payment.reference.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = currentTab === "all" || payment.status === currentTab;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: {
        label: "Pago",
        variant: "success"
      },
      pending: {
        label: "Pendente",
        variant: "warning"
      },
      overdue: {
        label: "Atrasado",
        variant: "destructive"
      },
      canceled: {
        label: "Cancelado",
        variant: "secondary"
      },
      upcoming: {
        label: "Próximo",
        variant: "secondary"
      }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      variant: "secondary"
    };
    
    return (
      <Badge variant={config.variant as any}>{config.label}</Badge>
    );
  };

  const getPaymentMethodLabel = (method: string | null) => {
    if (!method) return "Não registrado";
    
    const methods = {
      credit_card: "Cartão de Crédito",
      bank_transfer: "Transferência Bancária",
      cash: "Dinheiro"
    };
    
    return methods[method as keyof typeof methods] || method;
  };

  const handlePaymentAction = (id: number, action: string) => {
    toast({
      title: `${action} pagamento`,
      description: `Ação ${action.toLowerCase()} para o pagamento ID: ${id}`,
    });
  };

  const handleGenerateInvoice = (id: number) => {
    toast({
      title: "Gerar Fatura",
      description: `Gerando fatura para pagamento ID: ${id}`,
    });
  };

  const handleDownloadReport = () => {
    toast({
      title: "Download Relatório",
      description: `Gerando relatório financeiro para ${selectedMonth}`,
    });
  };

  const handleMakePayment = (id: number) => {
    toast({
      title: "Realizar Pagamento",
      description: "Redirecionando para a tela de pagamento",
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
              <h1 className="font-heading font-bold text-xl md:text-2xl">Financeiro</h1>
              <p className="text-neutral-medium text-sm">
                {isTrainer 
                  ? "Gerencie pagamentos e finanças" 
                  : "Visualize seus pagamentos e faturas"}
              </p>
            </div>
            
            {isTrainer ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-medium h-4 w-4" />
                  <Input 
                    placeholder="Buscar pagamentos..." 
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} 
                  />
                </div>
                <Dialog open={showAddPayment} onOpenChange={setShowAddPayment}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Novo Pagamento
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Registrar Novo Pagamento</DialogTitle>
                      <DialogDescription>
                        Registre um novo pagamento ou crie uma cobrança para uma aluna.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right">Aluna</label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Selecione uma aluna" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="camila">Camila Rocha</SelectItem>
                            <SelectItem value="beatriz">Beatriz Mendes</SelectItem>
                            <SelectItem value="gabriela">Gabriela Lima</SelectItem>
                            <SelectItem value="fernanda">Fernanda Souza</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right">Plano</label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Selecione um plano" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Mensal (R$ 280,00)</SelectItem>
                            <SelectItem value="quarterly">Trimestral (R$ 720,00)</SelectItem>
                            <SelectItem value="semiannual">Semestral (R$ 1.350,00)</SelectItem>
                            <SelectItem value="annual">Anual (R$ 2.520,00)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right">Método</label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Método de pagamento" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                            <SelectItem value="bank_transfer">Transferência Bancária</SelectItem>
                            <SelectItem value="cash">Dinheiro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right">Status</label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Status do pagamento" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="paid">Pago</SelectItem>
                            <SelectItem value="pending">Pendente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right">Data Venc.</label>
                        <Input 
                          className="col-span-3" 
                          type="date" 
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right">Referência</label>
                        <Input 
                          className="col-span-3" 
                          placeholder="Número da fatura ou referência" 
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddPayment(false)}>Cancelar</Button>
                      <Button onClick={() => setShowAddPayment(false)}>Salvar Pagamento</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div>
                {paymentsData?.nextPayment.status === "upcoming" && (
                  <Button onClick={() => handleMakePayment(0)}>
                    Realizar Pagamento
                  </Button>
                )}
              </div>
            )}
          </header>
          
          {isTrainer ? (
            <>
              {/* Financial Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-neutral-medium text-sm">Total</p>
                        <h3 className="font-heading font-bold text-2xl">{paymentsData?.statistics.total}</h3>
                      </div>
                      <div className="bg-secondary bg-opacity-10 rounded-lg p-3">
                        <i className="ri-money-dollar-circle-line text-secondary text-xl"></i>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-neutral-medium text-sm">Recebidos</p>
                        <h3 className="font-heading font-bold text-2xl">{paymentsData?.statistics.paid}</h3>
                      </div>
                      <div className="bg-success bg-opacity-10 rounded-lg p-3">
                        <i className="ri-checkbox-circle-line text-success text-xl"></i>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-neutral-medium text-sm">Pendentes</p>
                        <h3 className="font-heading font-bold text-2xl">{paymentsData?.statistics.pending}</h3>
                      </div>
                      <div className="bg-warning bg-opacity-10 rounded-lg p-3">
                        <i className="ri-time-line text-warning text-xl"></i>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-neutral-medium text-sm">Atrasados</p>
                        <h3 className="font-heading font-bold text-2xl">{paymentsData?.statistics.overdue}</h3>
                      </div>
                      <div className="bg-destructive bg-opacity-10 rounded-lg p-3">
                        <i className="ri-error-warning-line text-destructive text-xl"></i>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Charts and Reports */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <Card className="lg:col-span-2">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle>Faturamento Mensal</CardTitle>
                      <CardDescription>
                        Acompanhe a evolução do faturamento
                      </CardDescription>
                    </div>
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Selecione o mês" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Abril 2023">Abril 2023</SelectItem>
                        <SelectItem value="Março 2023">Março 2023</SelectItem>
                        <SelectItem value="Fevereiro 2023">Fevereiro 2023</SelectItem>
                        <SelectItem value="Janeiro 2023">Janeiro 2023</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={paymentsData?.monthlyChart}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip 
                            formatter={(value) => [`R$ ${value}`, "Faturamento"]}
                            labelFormatter={(label) => `Mês: ${label}`}
                          />
                          <Bar dataKey="amount" fill="hsl(var(--primary))" barSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Relatórios</CardTitle>
                    <CardDescription>
                      Baixe relatórios financeiros
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-neutral-lightest rounded-lg p-4 flex flex-col">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Relatório Mensal</h3>
                        <FileText className="text-neutral-medium h-5 w-5" />
                      </div>
                      <p className="text-neutral-medium text-sm mb-3">
                        Dados completos do mês, incluindo pagamentos, status e alunos.
                      </p>
                      <Button variant="outline" size="sm" className="self-start" onClick={handleDownloadReport}>
                        <Download className="mr-2 h-4 w-4" /> Baixar
                      </Button>
                    </div>
                    
                    <div className="bg-neutral-lightest rounded-lg p-4 flex flex-col">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Relatório de Inadimplência</h3>
                        <FileText className="text-neutral-medium h-5 w-5" />
                      </div>
                      <p className="text-neutral-medium text-sm mb-3">
                        Lista de pagamentos pendentes e atrasados.
                      </p>
                      <Button variant="outline" size="sm" className="self-start" onClick={handleDownloadReport}>
                        <Download className="mr-2 h-4 w-4" /> Baixar
                      </Button>
                    </div>
                    
                    <div className="bg-neutral-lightest rounded-lg p-4 flex flex-col">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Relatório por Planos</h3>
                        <FileText className="text-neutral-medium h-5 w-5" />
                      </div>
                      <p className="text-neutral-medium text-sm mb-3">
                        Análise de receita por plano de assinatura.
                      </p>
                      <Button variant="outline" size="sm" className="self-start" onClick={handleDownloadReport}>
                        <Download className="mr-2 h-4 w-4" /> Baixar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Payments Table */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Lista de Pagamentos</CardTitle>
                  <Tabs defaultValue="all" onValueChange={setCurrentTab}>
                    <TabsList>
                      <TabsTrigger value="all">Todos</TabsTrigger>
                      <TabsTrigger value="paid">Pagos</TabsTrigger>
                      <TabsTrigger value="pending">Pendentes</TabsTrigger>
                      <TabsTrigger value="overdue">Atrasados</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Referência</TableHead>
                        <TableHead>Aluna</TableHead>
                        <TableHead>Plano</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Método</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments && filteredPayments.length > 0 ? (
                        filteredPayments.map(payment => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">{payment.reference}</TableCell>
                            <TableCell>{payment.studentName}</TableCell>
                            <TableCell>{payment.plan}</TableCell>
                            <TableCell>{payment.amount}</TableCell>
                            <TableCell>{payment.dueDate}</TableCell>
                            <TableCell>{getStatusBadge(payment.status)}</TableCell>
                            <TableCell>{getPaymentMethodLabel(payment.method)}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  onClick={() => handleGenerateInvoice(payment.id)}
                                  title="Gerar Fatura"
                                >
                                  <i className="ri-file-list-3-line"></i>
                                </Button>
                                {payment.status === "pending" && (
                                  <Button 
                                    variant="outline" 
                                    size="icon"
                                    onClick={() => handlePaymentAction(payment.id, "Confirmar")}
                                    className="text-success"
                                    title="Confirmar Pagamento"
                                  >
                                    <i className="ri-checkbox-circle-line"></i>
                                  </Button>
                                )}
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  onClick={() => handlePaymentAction(payment.id, "Editar")}
                                  title="Editar Pagamento"
                                >
                                  <i className="ri-edit-line"></i>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-10">
                            <div className="flex flex-col items-center">
                              <div className="bg-neutral-light bg-opacity-30 rounded-full p-6 mb-4">
                                <i className="ri-file-search-line text-4xl text-neutral-medium"></i>
                              </div>
                              <h3 className="text-xl font-medium mb-2">Nenhum pagamento encontrado</h3>
                              <p className="text-neutral-medium max-w-md mb-6">
                                Não encontramos pagamentos que correspondam aos critérios de pesquisa.
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-neutral-medium">
                    Mostrando {filteredPayments?.length} de {paymentsData?.payments.length} pagamentos
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" disabled>Anterior</Button>
                    <Button variant="outline" size="sm" disabled>Próxima</Button>
                  </div>
                </CardFooter>
              </Card>
            </>
          ) : (
            <>
              {/* Student Payment View */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Próximo Pagamento</CardTitle>
                  <CardDescription>
                    Detalhes do seu próximo pagamento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {paymentsData?.nextPayment && (
                    <div className="p-4 bg-neutral-lightest rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-neutral-medium text-sm">Data de Vencimento</p>
                          <p className="font-heading font-bold text-lg">{paymentsData.nextPayment.dueDate}</p>
                        </div>
                        <div>
                          <p className="text-neutral-medium text-sm">Valor</p>
                          <p className="font-heading font-bold text-lg">{paymentsData.nextPayment.amount}</p>
                        </div>
                        <div>
                          <p className="text-neutral-medium text-sm">Status</p>
                          <div className="mt-1">{getStatusBadge(paymentsData.nextPayment.status)}</div>
                        </div>
                      </div>
                      
                      {paymentsData.nextPayment.status === "upcoming" && (
                        <div className="mt-6 flex justify-end">
                          <Button onClick={() => handleMakePayment(0)}>
                            Realizar Pagamento
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Payment History */}
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Pagamentos</CardTitle>
                  <CardDescription>
                    Todos os seus pagamentos anteriores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Referência</TableHead>
                        <TableHead>Plano</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Método</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentsData?.payments.map(payment => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.reference}</TableCell>
                          <TableCell>{payment.plan}</TableCell>
                          <TableCell>{payment.amount}</TableCell>
                          <TableCell>{payment.date || payment.dueDate}</TableCell>
                          <TableCell>{getStatusBadge(payment.status)}</TableCell>
                          <TableCell>{getPaymentMethodLabel(payment.method)}</TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleGenerateInvoice(payment.id)}
                              title="Ver Fatura"
                            >
                              <i className="ri-file-list-3-line"></i>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
      
      <MobileNavigation />
    </div>
  );
}
