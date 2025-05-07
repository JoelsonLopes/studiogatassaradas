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
    }`;

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
          <Link href="/">
            <a className={linkClass('/')}>
              <i className="ri-dashboard-line mr-3 text-lg"></i>
              Dashboard
            </a>
          </Link>
          <Link href="/students">
            <a className={linkClass('/students')}>
              <i className="ri-user-line mr-3 text-lg"></i>
              Alunas
            </a>
          </Link>
          <Link href="/workouts">
            <a className={linkClass('/workouts')}>
              <i className="ri-heart-pulse-line mr-3 text-lg"></i>
              Treinos
            </a>
          </Link>
          <Link href="/schedule">
            <a className={linkClass('/schedule')}>
              <i className="ri-calendar-line mr-3 text-lg"></i>
              Agendamentos
            </a>
          </Link>
          <Link href="/payments">
            <a className={linkClass('/payments')}>
              <i className="ri-money-dollar-circle-line mr-3 text-lg"></i>
              Financeiro
            </a>
          </Link>
          
          <div className="text-neutral-light text-xs font-semibold uppercase tracking-wider px-4 mt-6 mb-2">
            Conteúdo
          </div>
          <a href="#" className="flex items-center px-4 py-3 mb-2 hover:bg-primary/20 rounded-lg transition-colors">
            <i className="ri-video-line mr-3 text-lg"></i>
            Vídeos
          </a>
          <a href="#" className="flex items-center px-4 py-3 mb-2 hover:bg-primary/20 rounded-lg transition-colors">
            <i className="ri-book-2-line mr-3 text-lg"></i>
            Biblioteca de Exercícios
          </a>
        </nav>
      ) : (
        <nav className="mt-6 px-2">
          <div className="text-neutral-light text-xs font-semibold uppercase tracking-wider px-4 mb-2">
            Meu Treino
          </div>
          <Link href="/">
            <a className={linkClass('/')}>
              <i className="ri-dashboard-line mr-3 text-lg"></i>
              Meu Painel
            </a>
          </Link>
          <Link href="/schedule">
            <a className={linkClass('/schedule')}>
              <i className="ri-calendar-line mr-3 text-lg"></i>
              Calendário
            </a>
          </Link>
          <Link href="/workouts">
            <a className={linkClass('/workouts')}>
              <i className="ri-heart-pulse-line mr-3 text-lg"></i>
              Meus Treinos
            </a>
          </Link>
          <a href="#" className="flex items-center px-4 py-3 mb-2 hover:bg-primary/20 rounded-lg transition-colors">
            <i className="ri-bar-chart-line mr-3 text-lg"></i>
            Progresso
          </a>
          <Link href="/payments">
            <a className={linkClass('/payments')}>
              <i className="ri-money-dollar-circle-line mr-3 text-lg"></i>
              Pagamentos
            </a>
          </Link>
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
