import { useAuth } from "@/hooks/use-auth";
import { useLocation, Link } from "wouter";
import logoImg from "../../assets/studio-gatas-saradas-logo.png";

interface SidebarProps {
  visible?: boolean;
}

export default function Sidebar({ visible = true }: SidebarProps) {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  const isTrainer = user?.role === "trainer";
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const linkClass = (path: string) => 
    `flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${
      location === path 
        ? "bg-primary text-white" 
        : "hover:bg-primary/20 text-white hover:text-white"
    } cursor-pointer`;

  if (!visible) return null;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-secondary text-white fixed inset-y-0 left-0">
      <div className="px-6 py-4">
        <div className="mb-2">
          <img 
            src={logoImg}
            alt="Studio Gatas Saradas"
            className="h-12"
          />
        </div>
      </div>
      
      {isTrainer ? (
        <nav className="mt-6 px-2">
          <div className="text-neutral-light text-xs font-semibold uppercase tracking-wider px-4 mb-2">
            Gerenciamento
          </div>
          <div className={linkClass('/')} onClick={() => window.location.href = "/"}>
            <i className="ri-dashboard-line mr-3 text-lg"></i>
            Dashboard
          </div>
          <div className={linkClass('/students')} onClick={() => window.location.href = "/students"}>
            <i className="ri-user-line mr-3 text-lg"></i>
            Alunas
          </div>
          <div className={linkClass('/workouts')} onClick={() => window.location.href = "/workouts"}>
            <i className="ri-heart-pulse-line mr-3 text-lg"></i>
            Treinos
          </div>
          <div className={linkClass('/schedule')} onClick={() => window.location.href = "/schedule"}>
            <i className="ri-calendar-line mr-3 text-lg"></i>
            Agendamentos
          </div>
          <div className={linkClass('/payments')} onClick={() => window.location.href = "/payments"}>
            <i className="ri-money-dollar-circle-line mr-3 text-lg"></i>
            Financeiro
          </div>
          
          <div className="text-neutral-light text-xs font-semibold uppercase tracking-wider px-4 mt-6 mb-2">
            Conteúdo
          </div>
          <div className="flex items-center px-4 py-3 mb-2 hover:bg-primary/20 rounded-lg transition-colors cursor-pointer">
            <i className="ri-video-line mr-3 text-lg"></i>
            Vídeos
          </div>
          <div className="flex items-center px-4 py-3 mb-2 hover:bg-primary/20 rounded-lg transition-colors cursor-pointer">
            <i className="ri-book-2-line mr-3 text-lg"></i>
            Biblioteca de Exercícios
          </div>
        </nav>
      ) : (
        <nav className="mt-6 px-2">
          <div className="text-neutral-light text-xs font-semibold uppercase tracking-wider px-4 mb-2">
            Meu Treino
          </div>
          <div className={linkClass('/')} onClick={() => window.location.href = "/"}>
            <i className="ri-dashboard-line mr-3 text-lg"></i>
            Meu Painel
          </div>
          <div className={linkClass('/schedule')} onClick={() => window.location.href = "/schedule"}>
            <i className="ri-calendar-line mr-3 text-lg"></i>
            Calendário
          </div>
          <div className={linkClass('/workouts')} onClick={() => window.location.href = "/workouts"}>
            <i className="ri-heart-pulse-line mr-3 text-lg"></i>
            Meus Treinos
          </div>
          <div className="flex items-center px-4 py-3 mb-2 hover:bg-primary/20 rounded-lg transition-colors cursor-pointer">
            <i className="ri-bar-chart-line mr-3 text-lg"></i>
            Progresso
          </div>
          <div className={linkClass('/payments')} onClick={() => window.location.href = "/payments"}>
            <i className="ri-money-dollar-circle-line mr-3 text-lg"></i>
            Pagamentos
          </div>
        </nav>
      )}
      
      <div className="mt-auto px-6 py-4">
        <div className="flex items-center">
          {user?.profilePicture ? (
            <img 
              src={user.profilePicture} 
              alt={`Perfil ${user.name}`} 
              className="w-10 h-10 rounded-full object-cover border-2 border-accent" 
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-medium">
              {user?.name.charAt(0)}
            </div>
          )}
          <div className="ml-3">
            <p className="font-medium text-sm">{user?.name}</p>
            <p className="text-xs text-neutral-light">
              {user?.role === "trainer" ? "Personal Trainer" : "Aluna"}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <button 
            onClick={handleLogout}
            className="flex items-center text-sm text-neutral-light hover:text-white"
          >
            <i className="ri-logout-box-line mr-2"></i>
            Sair
          </button>
        </div>
      </div>
    </aside>
  );
}
