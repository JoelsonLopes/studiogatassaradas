import { useAuth } from "@/hooks/use-auth";
import { useLocation, Link } from "wouter";

export default function MobileNavigation() {
  const { user } = useAuth();
  const [location] = useLocation();
  
  if (!user) return null;
  
  const isTrainer = user.role === "trainer";
  
  const linkClass = (path: string) => 
    `flex flex-col items-center p-2 ${
      location === path 
        ? "text-primary" 
        : "text-neutral-medium"
    }`;

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-neutral-light flex justify-around p-2 z-10">
      {isTrainer ? (
        <>
          <Link href="/">
            <a className={linkClass('/')}>
              <i className="ri-dashboard-line text-xl"></i>
              <span className="text-xs mt-1">Dashboard</span>
            </a>
          </Link>
          <Link href="/students">
            <a className={linkClass('/students')}>
              <i className="ri-user-line text-xl"></i>
              <span className="text-xs mt-1">Alunas</span>
            </a>
          </Link>
          <Link href="/workouts">
            <a className={linkClass('/workouts')}>
              <i className="ri-heart-pulse-line text-xl"></i>
              <span className="text-xs mt-1">Treinos</span>
            </a>
          </Link>
          <Link href="/schedule">
            <a className={linkClass('/schedule')}>
              <i className="ri-calendar-line text-xl"></i>
              <span className="text-xs mt-1">Agenda</span>
            </a>
          </Link>
          <Link href="/payments">
            <a className={linkClass('/payments')}>
              <i className="ri-money-dollar-circle-line text-xl"></i>
              <span className="text-xs mt-1">Financeiro</span>
            </a>
          </Link>
        </>
      ) : (
        <>
          <Link href="/">
            <a className={linkClass('/')}>
              <i className="ri-dashboard-line text-xl"></i>
              <span className="text-xs mt-1">Dashboard</span>
            </a>
          </Link>
          <Link href="/schedule">
            <a className={linkClass('/schedule')}>
              <i className="ri-calendar-line text-xl"></i>
              <span className="text-xs mt-1">Calendário</span>
            </a>
          </Link>
          <Link href="/workouts">
            <a className={linkClass('/workouts')}>
              <i className="ri-heart-pulse-line text-xl"></i>
              <span className="text-xs mt-1">Treinos</span>
            </a>
          </Link>
          <Link href="/payments">
            <a className={linkClass('/payments')}>
              <i className="ri-money-dollar-circle-line text-xl"></i>
              <span className="text-xs mt-1">Pagamentos</span>
            </a>
          </Link>
          <a href="#" className={linkClass('#')}>
            <i className="ri-user-line text-xl"></i>
            <span className="text-xs mt-1">Perfil</span>
          </a>
        </>
      )}
    </nav>
  );
}
