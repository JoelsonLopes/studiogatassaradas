import { 
  User, 
  InsertUser, 
  Workout, 
  InsertWorkout, 
  Session, 
  InsertSession, 
  Payment, 
  InsertPayment, 
  Progress, 
  InsertProgress,
  Exercise,
  InsertExercise,
  WorkoutExercise,
  InsertWorkoutExercise,
  StudentWorkout,
  InsertStudentWorkout
} from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User>;
  
  // Students
  getStudents(trainerId: number): Promise<User[]>;
  getStudentsCount(): Promise<number>;
  getActiveStudentsCount(): Promise<number>;
  
  // Workouts
  getWorkout(id: number): Promise<Workout | undefined>;
  getWorkouts(trainerId: number): Promise<Workout[]>;
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  updateWorkout(id: number, workoutData: Partial<Workout>): Promise<Workout>;
  deleteWorkout(id: number): Promise<boolean>;
  getPopularWorkouts(trainerId: number): Promise<any[]>;
  
  // Student Workouts
  getStudentWorkouts(studentId: number): Promise<any[]>;
  assignWorkoutToStudent(data: InsertStudentWorkout): Promise<StudentWorkout>;
  studentHasWorkoutAccess(studentId: number, workoutId: number): Promise<boolean>;
  completeStudentWorkout(studentId: number, workoutId: number): Promise<StudentWorkout>;
  
  // Exercises
  getExercise(id: number): Promise<Exercise | undefined>;
  getExercises(trainerId: number): Promise<Exercise[]>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  
  // Workout Exercises
  getWorkoutExercises(workoutId: number): Promise<WorkoutExercise[]>;
  addExerciseToWorkout(data: InsertWorkoutExercise): Promise<WorkoutExercise>;
  
  // Sessions (Scheduling)
  getSession(id: number): Promise<Session | undefined>;
  getTrainerSessions(trainerId: number, date?: Date): Promise<Session[]>;
  getStudentSessions(studentId: number, date?: Date): Promise<Session[]>;
  createSession(session: InsertSession): Promise<Session>;
  updateSession(id: number, sessionData: Partial<Session>): Promise<Session>;
  cancelSession(id: number): Promise<Session>;
  getUpcomingSessions(trainerId: number): Promise<any[]>;
  getStudentUpcomingSessions(studentId: number): Promise<any[]>;
  getUpcomingSessionsCount(trainerId: number): Promise<number>;
  
  // Payments
  getPayment(id: number): Promise<Payment | undefined>;
  getTrainerPayments(trainerId: number): Promise<Payment[]>;
  getStudentPayments(studentId: number): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePaymentStatus(id: number, status: string): Promise<Payment>;
  getMonthlyRevenue(trainerId: number): Promise<number>;
  getRevenueChart(trainerId: number): Promise<any[]>;
  getRecentPayments(trainerId: number): Promise<any[]>;
  
  // Progress
  getStudentProgress(studentId: number): Promise<Progress[]>;
  recordProgress(data: InsertProgress): Promise<Progress>;
  
  // Activity tracking
  getRecentActivities(trainerId: number): Promise<any[]>;
  
  // Session store for authentication
  sessionStore: any; // Use 'any' to bypass the SessionStore type issue
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private workouts: Map<number, Workout>;
  private sessions: Map<number, Session>;
  private payments: Map<number, Payment>;
  private progress: Map<number, Progress>;
  private exercises: Map<number, Exercise>;
  private studentWorkouts: Map<number, StudentWorkout>;
  private workoutExercises: Map<number, WorkoutExercise>;
  
  sessionStore: any;
  
  // ID counters
  private userIdCounter: number;
  private workoutIdCounter: number;
  private sessionIdCounter: number;
  private paymentIdCounter: number;
  private progressIdCounter: number;
  private exerciseIdCounter: number;
  private studentWorkoutIdCounter: number;
  private workoutExerciseIdCounter: number;

  constructor() {
    this.users = new Map();
    this.workouts = new Map();
    this.sessions = new Map();
    this.payments = new Map();
    this.progress = new Map();
    this.exercises = new Map();
    this.studentWorkouts = new Map();
    this.workoutExercises = new Map();
    
    this.userIdCounter = 1;
    this.workoutIdCounter = 1;
    this.sessionIdCounter = 1;
    this.paymentIdCounter = 1;
    this.progressIdCounter = 1;
    this.exerciseIdCounter = 1;
    this.studentWorkoutIdCounter = 1;
    this.workoutExerciseIdCounter = 1;
    
    // Initialize session store
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    // Create a default trainer account for testing
    this.createUser({
      username: "daniela@example.com",
      password: "$2b$10$jqw8tVCHpbJNxvMbA0AY8uK9oaWIp3mf4HqKLXJer9.3sSGPAl5b6", // "password"
      name: "Daniela Lopes",
      role: "trainer",
      profilePicture: "https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
    });
  }

  // User management
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const joinDate = new Date();
    const newUser: User = { 
      ...user, 
      id, 
      joinDate,
      role: user.role || 'student',
      profilePicture: user.profilePicture || null,
      phone: user.phone || null
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error("User not found");
    }
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Students
  async getStudents(trainerId: number): Promise<User[]> {
    return Array.from(this.users.values())
      .filter(user => user.role === "student");
  }

  async getStudentsCount(): Promise<number> {
    return Array.from(this.users.values())
      .filter(user => user.role === "student")
      .length;
  }

  async getActiveStudentsCount(): Promise<number> {
    // In a real implementation, this would check for active status
    // For now, assume all students are active
    return this.getStudentsCount();
  }

  // Workouts
  async getWorkout(id: number): Promise<Workout | undefined> {
    return this.workouts.get(id);
  }

  async getWorkouts(trainerId: number): Promise<Workout[]> {
    return Array.from(this.workouts.values())
      .filter(workout => workout.trainerId === trainerId);
  }

  async createWorkout(workout: InsertWorkout): Promise<Workout> {
    const id = this.workoutIdCounter++;
    const createdAt = new Date();
    const newWorkout: Workout = { 
      ...workout, 
      id, 
      createdAt,
      description: workout.description || null,
      image: workout.image || null
    };
    this.workouts.set(id, newWorkout);
    return newWorkout;
  }

  async updateWorkout(id: number, workoutData: Partial<Workout>): Promise<Workout> {
    const workout = await this.getWorkout(id);
    if (!workout) {
      throw new Error("Workout not found");
    }
    
    const updatedWorkout = { ...workout, ...workoutData };
    this.workouts.set(id, updatedWorkout);
    return updatedWorkout;
  }

  async deleteWorkout(id: number): Promise<boolean> {
    return this.workouts.delete(id);
  }

  async getPopularWorkouts(trainerId: number): Promise<any[]> {
    // In a real implementation, this would fetch workouts with popularity metrics
    // For now, return mock data
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
      }
    ];
  }

  // Student Workouts
  async getStudentWorkouts(studentId: number): Promise<any[]> {
    // In a real implementation, this would fetch workouts assigned to a student
    // For now, return mock data
    return [
      {
        id: 1,
        title: "Treino A - Pernas e Glúteos",
        level: "Intermediário",
        duration: "45 min",
        category: "lower",
        image: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        completionStatus: "completed",
        lastCompleted: "Hoje, 10:30"
      },
      {
        id: 2,
        title: "Treino B - Core e Abdômen",
        level: "Básico",
        duration: "30 min",
        category: "core",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        completionStatus: "in-progress",
        lastCompleted: "2 dias atrás"
      },
      {
        id: 3,
        title: "Treino C - Braços e Costas",
        level: "Intermediário",
        duration: "40 min",
        category: "upper",
        image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        completionStatus: "not-started",
        lastCompleted: "Nunca"
      }
    ];
  }

  async assignWorkoutToStudent(data: InsertStudentWorkout): Promise<StudentWorkout> {
    const id = this.studentWorkoutIdCounter++;
    const assignedAt = new Date();
    const newStudentWorkout: StudentWorkout = { 
      ...data, 
      id, 
      assignedAt, 
      completed: data.completed || null,
      completedAt: data.completedAt || null 
    };
    this.studentWorkouts.set(id, newStudentWorkout);
    return newStudentWorkout;
  }

  async studentHasWorkoutAccess(studentId: number, workoutId: number): Promise<boolean> {
    // Check if the workout is assigned to this student
    return Array.from(this.studentWorkouts.values())
      .some(sw => sw.studentId === studentId && sw.workoutId === workoutId);
  }

  async completeStudentWorkout(studentId: number, workoutId: number): Promise<StudentWorkout> {
    const studentWorkout = Array.from(this.studentWorkouts.values())
      .find(sw => sw.studentId === studentId && sw.workoutId === workoutId);
    
    if (!studentWorkout) {
      throw new Error("Student workout not found");
    }
    
    const updatedStudentWorkout = { 
      ...studentWorkout, 
      completed: true, 
      completedAt: new Date() 
    };
    
    this.studentWorkouts.set(studentWorkout.id, updatedStudentWorkout);
    return updatedStudentWorkout;
  }

  // Exercises
  async getExercise(id: number): Promise<Exercise | undefined> {
    return this.exercises.get(id);
  }

  async getExercises(trainerId: number): Promise<Exercise[]> {
    return Array.from(this.exercises.values())
      .filter(exercise => exercise.trainerId === trainerId);
  }

  async createExercise(exercise: InsertExercise): Promise<Exercise> {
    const id = this.exerciseIdCounter++;
    const newExercise: Exercise = { 
      ...exercise, 
      id,
      description: exercise.description || null,
      videoUrl: exercise.videoUrl || null 
    };
    this.exercises.set(id, newExercise);
    return newExercise;
  }

  // Workout Exercises
  async getWorkoutExercises(workoutId: number): Promise<WorkoutExercise[]> {
    return Array.from(this.workoutExercises.values())
      .filter(we => we.workoutId === workoutId)
      .sort((a, b) => a.order - b.order);
  }

  async addExerciseToWorkout(data: InsertWorkoutExercise): Promise<WorkoutExercise> {
    const id = this.workoutExerciseIdCounter++;
    const newWorkoutExercise: WorkoutExercise = { 
      ...data, 
      id, 
      sets: data.sets || null,
      reps: data.reps || null,
      time: data.time || null,
      restTime: data.restTime || null,
      notes: data.notes || null
    };
    this.workoutExercises.set(id, newWorkoutExercise);
    return newWorkoutExercise;
  }

  // Sessions (Scheduling)
  async getSession(id: number): Promise<Session | undefined> {
    return this.sessions.get(id);
  }

  async getTrainerSessions(trainerId: number, date?: Date): Promise<Session[]> {
    let sessions = Array.from(this.sessions.values())
      .filter(session => session.trainerId === trainerId);
    
    if (date) {
      const dateStart = new Date(date);
      dateStart.setHours(0, 0, 0, 0);
      
      const dateEnd = new Date(date);
      dateEnd.setHours(23, 59, 59, 999);
      
      sessions = sessions.filter(session => 
        session.date >= dateStart && session.date <= dateEnd
      );
    }
    
    return sessions.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  async getStudentSessions(studentId: number, date?: Date): Promise<Session[]> {
    let sessions = Array.from(this.sessions.values())
      .filter(session => 
        session.studentId === studentId || 
        (session.isGroup && session.studentId === null) // Group sessions
      );
    
    if (date) {
      const dateStart = new Date(date);
      dateStart.setHours(0, 0, 0, 0);
      
      const dateEnd = new Date(date);
      dateEnd.setHours(23, 59, 59, 999);
      
      sessions = sessions.filter(session => 
        session.date >= dateStart && session.date <= dateEnd
      );
    }
    
    return sessions.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  async createSession(session: InsertSession): Promise<Session> {
    const id = this.sessionIdCounter++;
    const newSession: Session = { 
      ...session, 
      id,
      status: session.status || 'scheduled',
      description: session.description || null,
      studentId: session.studentId || null,
      notes: session.notes || null,
      isGroup: session.isGroup || null,
      groupSize: session.groupSize || null
    };
    this.sessions.set(id, newSession);
    return newSession;
  }

  async updateSession(id: number, sessionData: Partial<Session>): Promise<Session> {
    const session = await this.getSession(id);
    if (!session) {
      throw new Error("Session not found");
    }
    
    const updatedSession = { ...session, ...sessionData };
    this.sessions.set(id, updatedSession);
    return updatedSession;
  }

  async cancelSession(id: number): Promise<Session> {
    return this.updateSession(id, { status: "canceled" });
  }

  async getUpcomingSessions(trainerId: number): Promise<any[]> {
    // In a real implementation, this would fetch upcoming sessions for a trainer
    // For now, return mock data
    return [
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
    ];
  }

  async getStudentUpcomingSessions(studentId: number): Promise<any[]> {
    // In a real implementation, this would fetch upcoming sessions for a student
    // For now, return mock data
    return [
      {
        id: 1,
        date: "Hoje, 15:00",
        title: "Treino Personal",
        subtitle: "Com Daniela Lopes",
        type: "training",
        status: "scheduled"
      },
      {
        id: 2,
        date: "Amanhã, 10:30",
        title: "Aula de Yoga",
        subtitle: "Grupo (3 alunas)",
        type: "group",
        status: "scheduled"
      },
      {
        id: 3,
        date: "23/04, 16:00",
        title: "Avaliação Física",
        subtitle: "Com Daniela Lopes",
        type: "evaluation",
        status: "scheduled"
      }
    ];
  }

  async getUpcomingSessionsCount(trainerId: number): Promise<number> {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    return Array.from(this.sessions.values())
      .filter(session => 
        session.trainerId === trainerId && 
        session.date >= today && 
        session.date <= nextWeek &&
        session.status === "scheduled"
      )
      .length;
  }

  // Payments
  async getPayment(id: number): Promise<Payment | undefined> {
    return this.payments.get(id);
  }

  async getTrainerPayments(trainerId: number): Promise<Payment[]> {
    return Array.from(this.payments.values())
      .filter(payment => payment.trainerId === trainerId)
      .sort((a, b) => {
        // Handle the case where date might be null
        const dateA = a.date?.getTime() ?? 0;
        const dateB = b.date?.getTime() ?? 0;
        return dateB - dateA; // Sort by date desc
      });
  }

  async getStudentPayments(studentId: number): Promise<Payment[]> {
    return Array.from(this.payments.values())
      .filter(payment => payment.studentId === studentId)
      .sort((a, b) => {
        // Handle the case where date might be null
        const dateA = a.date?.getTime() ?? 0;
        const dateB = b.date?.getTime() ?? 0;
        return dateB - dateA; // Sort by date desc
      });
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const id = this.paymentIdCounter++;
    const date = new Date();
    const newPayment: Payment = { 
      ...payment, 
      id, 
      date,
      status: payment.status || 'pending',
      paidDate: payment.paidDate || null,
      reference: payment.reference || null,
      method: payment.method || null,
      metadata: payment.metadata || null
    };
    this.payments.set(id, newPayment);
    return newPayment;
  }

  async updatePaymentStatus(id: number, status: string): Promise<Payment> {
    const payment = await this.getPayment(id);
    if (!payment) {
      throw new Error("Payment not found");
    }
    
    const updatedPayment = { 
      ...payment, 
      status,
      paidDate: status === "paid" ? new Date() : payment.paidDate 
    };
    
    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }

  async getMonthlyRevenue(trainerId: number): Promise<number> {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    
    return Array.from(this.payments.values())
      .filter(payment => 
        payment.trainerId === trainerId && 
        payment.status === "paid" &&
        payment.date !== null &&
        payment.date >= monthStart && 
        payment.date <= monthEnd
      )
      .reduce((total, payment) => total + payment.amount, 0);
  }

  async getRevenueChart(trainerId: number): Promise<any[]> {
    // In a real implementation, this would calculate revenue per month
    // For now, return mock data
    return [
      { month: "Jan", value: 2400 },
      { month: "Fev", value: 3100 },
      { month: "Mar", value: 3800 },
      { month: "Abr", value: 4250 },
      { month: "Mai", value: 0 },
      { month: "Jun", value: 0 }
    ];
  }

  async getRecentPayments(trainerId: number): Promise<any[]> {
    // In a real implementation, this would fetch recent payments
    // For now, return mock data
    return [
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
    ];
  }

  // Progress
  async getStudentProgress(studentId: number): Promise<Progress[]> {
    return Array.from(this.progress.values())
      .filter(progress => progress.studentId === studentId)
      .sort((a, b) => {
        // Handle the case where date might be null
        const dateA = a.date?.getTime() ?? 0;
        const dateB = b.date?.getTime() ?? 0;
        return dateB - dateA; // Sort by date desc
      });
  }

  async recordProgress(data: InsertProgress): Promise<Progress> {
    const id = this.progressIdCounter++;
    const date = new Date();
    const newProgress: Progress = { 
      ...data, 
      id, 
      date,
      notes: data.notes || null,
      weight: data.weight || null,
      bodyFat: data.bodyFat || null,
      measurements: data.measurements || null
    };
    this.progress.set(id, newProgress);
    return newProgress;
  }

  // Activity tracking
  async getRecentActivities(trainerId: number): Promise<any[]> {
    // In a real implementation, this would track user activities
    // For now, return mock data
    return [
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
    ];
  }
}

export const storage = new MemStorage();
