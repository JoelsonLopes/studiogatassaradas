import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import { ProtectedRoute } from "./lib/protected-route";
import DashboardPage from "@/pages/dashboard-page";
import StudentsPage from "@/pages/students-page";
import WorkoutsPage from "@/pages/workouts-page";
import SchedulePage from "@/pages/schedule-page";
import PaymentsPage from "@/pages/payments-page";
import StudentDashboard from "@/pages/student-dashboard";
import { AuthProvider, useAuth } from "./hooks/use-auth";

function AppRoutes() {
  const { user } = useAuth();
  
  return (
    <Switch>
      {/* Public route */}
      <Route path="/auth" component={AuthPage} />
      
      {/* Protected routes */}
      <ProtectedRoute 
        path="/" 
        component={user?.role === "trainer" ? DashboardPage : StudentDashboard} 
      />
      
      {/* Trainer routes */}
      <ProtectedRoute
        path="/students"
        roles={["trainer"]}
        component={StudentsPage}
      />
      <ProtectedRoute
        path="/workouts"
        roles={["trainer"]}
        component={WorkoutsPage}
      />
      <ProtectedRoute
        path="/schedule"
        roles={["trainer"]}
        component={SchedulePage}
      />
      <ProtectedRoute
        path="/payments"
        roles={["trainer"]}
        component={PaymentsPage}
      />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <AppRoutes />
      </AuthProvider>
    </TooltipProvider>
  );
}

export default App;
