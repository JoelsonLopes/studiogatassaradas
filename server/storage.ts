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
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';

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

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

class DrizzleStorage implements IStorage {
  sessionStore: any = null; // Sessão pode ser implementada depois

  // User management
  async getUser(id: number) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string) {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(user: InsertUser) {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: number, userData: Partial<User>) {
    const result = await db.update(users).set(userData).where(eq(users.id, id)).returning();
    return result[0];
  }

  // Students
  async getStudents(trainerId: number): Promise<User[]> { throw new Error('Not implemented'); }
  async getStudentsCount(): Promise<number> { throw new Error('Not implemented'); }
  async getActiveStudentsCount(): Promise<number> { throw new Error('Not implemented'); }

  // Workouts
  async getWorkout(id: number): Promise<Workout | undefined> { throw new Error('Not implemented'); }
  async getWorkouts(trainerId: number): Promise<Workout[]> { throw new Error('Not implemented'); }
  async createWorkout(workout: InsertWorkout): Promise<Workout> { throw new Error('Not implemented'); }
  async updateWorkout(id: number, workoutData: Partial<Workout>): Promise<Workout> { throw new Error('Not implemented'); }
  async deleteWorkout(id: number): Promise<boolean> { throw new Error('Not implemented'); }
  async getPopularWorkouts(trainerId: number): Promise<any[]> { throw new Error('Not implemented'); }

  // Student Workouts
  async getStudentWorkouts(studentId: number): Promise<any[]> { throw new Error('Not implemented'); }
  async assignWorkoutToStudent(data: InsertStudentWorkout): Promise<StudentWorkout> { throw new Error('Not implemented'); }
  async studentHasWorkoutAccess(studentId: number, workoutId: number): Promise<boolean> { throw new Error('Not implemented'); }
  async completeStudentWorkout(studentId: number, workoutId: number): Promise<StudentWorkout> { throw new Error('Not implemented'); }

  // Exercises
  async getExercise(id: number): Promise<Exercise | undefined> { throw new Error('Not implemented'); }
  async getExercises(trainerId: number): Promise<Exercise[]> { throw new Error('Not implemented'); }
  async createExercise(exercise: InsertExercise): Promise<Exercise> { throw new Error('Not implemented'); }

  // Workout Exercises
  async getWorkoutExercises(workoutId: number): Promise<WorkoutExercise[]> { throw new Error('Not implemented'); }
  async addExerciseToWorkout(data: InsertWorkoutExercise): Promise<WorkoutExercise> { throw new Error('Not implemented'); }

  // Sessions (Scheduling)
  async getSession(id: number): Promise<Session | undefined> { throw new Error('Not implemented'); }
  async getTrainerSessions(trainerId: number, date?: Date): Promise<Session[]> { throw new Error('Not implemented'); }
  async getStudentSessions(studentId: number, date?: Date): Promise<Session[]> { throw new Error('Not implemented'); }
  async createSession(session: InsertSession): Promise<Session> { throw new Error('Not implemented'); }
  async updateSession(id: number, sessionData: Partial<Session>): Promise<Session> { throw new Error('Not implemented'); }
  async cancelSession(id: number): Promise<Session> { throw new Error('Not implemented'); }
  async getUpcomingSessions(trainerId: number): Promise<any[]> { throw new Error('Not implemented'); }
  async getStudentUpcomingSessions(studentId: number): Promise<any[]> { throw new Error('Not implemented'); }
  async getUpcomingSessionsCount(trainerId: number): Promise<number> { throw new Error('Not implemented'); }

  // Payments
  async getPayment(id: number): Promise<Payment | undefined> { throw new Error('Not implemented'); }
  async getTrainerPayments(trainerId: number): Promise<Payment[]> { throw new Error('Not implemented'); }
  async getStudentPayments(studentId: number): Promise<Payment[]> { throw new Error('Not implemented'); }
  async createPayment(payment: InsertPayment): Promise<Payment> { throw new Error('Not implemented'); }
  async updatePaymentStatus(id: number, status: string): Promise<Payment> { throw new Error('Not implemented'); }
  async getMonthlyRevenue(trainerId: number): Promise<number> { throw new Error('Not implemented'); }
  async getRevenueChart(trainerId: number): Promise<any[]> { throw new Error('Not implemented'); }
  async getRecentPayments(trainerId: number): Promise<any[]> { throw new Error('Not implemented'); }

  // Progress
  async getStudentProgress(studentId: number): Promise<Progress[]> { throw new Error('Not implemented'); }
  async recordProgress(data: InsertProgress): Promise<Progress> { throw new Error('Not implemented'); }

  // Activity tracking
  async getRecentActivities(trainerId: number): Promise<any[]> { throw new Error('Not implemented'); }
}

export const storage = new DrizzleStorage();
