import { useAuth } from "@/hooks/use-auth";
import { useLocation, Link } from "wouter";

export default function MobileNavigation() {
  const { user } = useAuth();
  const [location] = useLocation();
  
  if (!user) return null;
  
  const isTrainer = user.role === "trainer";
  
  const linkClass = (path: string) => 
    `flex flex-col items-center p-2 rounded-lg transition-colors mx-1 ${
      location === path 
        ? "bg-primary text-white" 
        : "text-white/70 hover:bg-primary/20"
    } cursor-pointer`;

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-secondary text-white flex justify-around p-2 z-50 border-t border-neutral-light">
      {isTrainer ? (
        <>
          <div className={linkClass('/')} onClick={() => window.location.href = "/"}>
            <i className="ri-dashboard-line text-xl"></i>
            <span className="text-xs mt-1">Dashboard</span>
          </div>
          <div className={linkClass('/students')} onClick={() => window.location.href = "/students"}>
            <i className="ri-user-line text-xl"></i>
            <span className="text-xs mt-1">Alunas</span>
          </div>
          <div className={linkClass('/workouts')} onClick={() => window.location.href = "/workouts"}>
            <i className="ri-heart-pulse-line text-xl"></i>
            <span className="text-xs mt-1">Treinos</span>
          </div>
          <div className={linkClass('/schedule')} onClick={() => window.location.href = "/schedule"}>
            <i className="ri-calendar-line text-xl"></i>
            <span className="text-xs mt-1">Agenda</span>
          </div>
          <div className={linkClass('/payments')} onClick={() => window.location.href = "/payments"}>
            <i className="ri-money-dollar-circle-line text-xl"></i>
            <span className="text-xs mt-1">Financeiro</span>
          </div>
        </>
      ) : (
        <>
          <div className={linkClass('/')} onClick={() => window.location.href = "/"}>
            <i className="ri-dashboard-line text-xl"></i>
            <span className="text-xs mt-1">Dashboard</span>
          </div>
          <div className={linkClass('/schedule')} onClick={() => window.location.href = "/schedule"}>
            <i className="ri-calendar-line text-xl"></i>
            <span className="text-xs mt-1">Calendário</span>
          </div>
          <div className={linkClass('/workouts')} onClick={() => window.location.href = "/workouts"}>
            <i className="ri-heart-pulse-line text-xl"></i>
            <span className="text-xs mt-1">Treinos</span>
          </div>
          <div className={linkClass('/payments')} onClick={() => window.location.href = "/payments"}>
            <i className="ri-money-dollar-circle-line text-xl"></i>
            <span className="text-xs mt-1">Pagamentos</span>
          </div>
          <div className={linkClass('#')}>
            <i className="ri-user-line text-xl"></i>
            <span className="text-xs mt-1">Perfil</span>
          </div>
        </>
      )}
    </nav>
  );
}
