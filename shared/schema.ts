import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("student"), // "trainer" or "student"
  profilePicture: text("profile_picture"),
  phone: text("phone"),
  joinDate: timestamp("join_date").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  role: true,
  profilePicture: true,
  phone: true,
});

// Workout model
export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  level: text("level").notNull(), // "basic", "intermediate", "advanced", "all"
  duration: integer("duration").notNull(), // in minutes
  trainerId: integer("trainer_id").notNull(),
  category: text("category").notNull(), // "lower", "upper", "core", "full", "cardio", "hiit", "mobility"
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWorkoutSchema = createInsertSchema(workouts).pick({
  title: true,
  description: true,
  level: true,
  duration: true,
  trainerId: true,
  category: true,
  image: true,
});

// Student-Workout relationship
export const studentWorkouts = pgTable("student_workouts", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  workoutId: integer("workout_id").notNull(),
  assignedAt: timestamp("assigned_at").defaultNow(),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
});

export const insertStudentWorkoutSchema = createInsertSchema(studentWorkouts).pick({
  studentId: true,
  workoutId: true,
  completed: true,
  completedAt: true,
});

// Exercise model
export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  videoUrl: text("video_url"),
  category: text("category").notNull(), // "legs", "arms", "chest", "back", "core", "cardio"
  trainerId: integer("trainer_id").notNull(),
});

export const insertExerciseSchema = createInsertSchema(exercises).pick({
  name: true,
  description: true,
  videoUrl: true,
  category: true,
  trainerId: true,
});

// Workout-Exercise relationship
export const workoutExercises = pgTable("workout_exercises", {
  id: serial("id").primaryKey(),
  workoutId: integer("workout_id").notNull(),
  exerciseId: integer("exercise_id").notNull(),
  sets: integer("sets"),
  reps: integer("reps"),
  time: integer("time"), // in seconds, for timed exercises
  restTime: integer("rest_time"), // in seconds
  notes: text("notes"),
  order: integer("order").notNull(), // for ordering exercises within a workout
});

export const insertWorkoutExerciseSchema = createInsertSchema(workoutExercises).pick({
  workoutId: true,
  exerciseId: true,
  sets: true,
  reps: true,
  time: true,
  restTime: true,
  notes: true,
  order: true,
});

// Session model (for scheduling)
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  time: text("time").notNull(),
  duration: integer("duration").notNull(), // in minutes
  type: text("type").notNull(), // "training", "evaluation", "consultation", "group"
  trainerId: integer("trainer_id").notNull(),
  studentId: integer("student_id"), // null for group sessions
  isGroup: boolean("is_group").default(false),
  groupSize: integer("group_size"),
  status: text("status").notNull().default("scheduled"), // "scheduled", "completed", "canceled"
  notes: text("notes"),
});

export const insertSessionSchema = createInsertSchema(sessions).pick({
  title: true,
  description: true,
  date: true,
  time: true,
  duration: true,
  type: true,
  trainerId: true,
  studentId: true,
  isGroup: true,
  groupSize: true,
  status: true,
  notes: true,
});

// Payment model
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  trainerId: integer("trainer_id").notNull(),
  amount: integer("amount").notNull(), // in cents
  plan: text("plan").notNull(), // "Mensal", "Trimestral", "Semestral", "Anual"
  status: text("status").notNull().default("pending"), // "paid", "pending", "overdue", "canceled"
  date: timestamp("date").defaultNow(),
  dueDate: timestamp("due_date").notNull(),
  paidDate: timestamp("paid_date"),
  reference: text("reference"), // e.g., invoice number
  method: text("method"), // "credit_card", "bank_transfer", "cash"
  metadata: json("metadata"), // additional payment data
});

export const insertPaymentSchema = createInsertSchema(payments).pick({
  studentId: true,
  trainerId: true,
  amount: true,
  plan: true,
  status: true,
  dueDate: true,
  paidDate: true,
  reference: true,
  method: true,
  metadata: true,
});

// Progress tracking model
export const progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  date: timestamp("date").defaultNow(),
  weight: integer("weight"), // in grams
  bodyFat: integer("body_fat"), // percentage × 100 (e.g., 20.5% would be 2050)
  measurements: json("measurements"), // JSON object with measurements (e.g., arms, waist, etc.)
  notes: text("notes"),
});

export const insertProgressSchema = createInsertSchema(progress).pick({
  studentId: true,
  date: true,
  weight: true,
  bodyFat: true,
  measurements: true,
  notes: true,
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Workout = typeof workouts.$inferSelect;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;

export type StudentWorkout = typeof studentWorkouts.$inferSelect;
export type InsertStudentWorkout = z.infer<typeof insertStudentWorkoutSchema>;

export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;

export type WorkoutExercise = typeof workoutExercises.$inferSelect;
export type InsertWorkoutExercise = z.infer<typeof insertWorkoutExerciseSchema>;

export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type Progress = typeof progress.$inferSelect;
export type InsertProgress = z.infer<typeof insertProgressSchema>;
