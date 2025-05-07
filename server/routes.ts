import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertWorkoutSchema, insertSessionSchema, insertPaymentSchema } from "@shared/schema";

// Middleware to ensure user is authenticated
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated() && req.user) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// Middleware to ensure user has appropriate role
const hasRole = (roles: string[]) => (req: Request, res: Response, next: Function) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Sets up authentication routes
  setupAuth(app);

  // Dashboard data
  app.get("/api/dashboard", isAuthenticated, async (req, res) => {
    try {
      const user = req.user!; // We can safely use non-null assertion because isAuthenticated ensures req.user exists
      
      if (user.role === "trainer") {
        const studentsCount = await storage.getStudentsCount();
        const activeStudentsCount = await storage.getActiveStudentsCount();
        const sessionsCount = await storage.getUpcomingSessionsCount(user.id);
        const revenue = await storage.getMonthlyRevenue(user.id);
        const activities = await storage.getRecentActivities(user.id);
        const sessions = await storage.getUpcomingSessions(user.id);
        const workouts = await storage.getPopularWorkouts(user.id);
        const revenueChart = await storage.getRevenueChart(user.id);
        const payments = await storage.getRecentPayments(user.id);
        
        res.json({
          stats: {
            students: { value: studentsCount, trend: { value: "12% desde o mês passado", positive: true } },
            sessions: { value: sessionsCount, trend: { value: "4 para esta semana", positive: true } },
            revenue: { value: `R$ ${(revenue / 100).toFixed(2).replace('.', ',')}`, trend: { value: "8% desde o mês passado", positive: true } }
          },
          activities,
          sessions,
          workouts,
          revenueChart,
          payments
        });
      } else {
        // Student dashboard data
        const workouts = await storage.getStudentWorkouts(user.id);
        const sessions = await storage.getStudentUpcomingSessions(user.id);
        const progress = await storage.getStudentProgress(user.id);
        const payments = await storage.getStudentPayments(user.id);
        
        res.json({
          workouts,
          sessions,
          progress,
          payments
        });
      }
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Students routes
  app.get("/api/students", isAuthenticated, hasRole(["trainer"]), async (req, res) => {
    try {
      const user = req.user!;
      const students = await storage.getStudents(user.id);
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/students/:id", isAuthenticated, async (req, res) => {
    try {
      const user = req.user!;
      const studentId = parseInt(req.params.id, 10);
      
      // If student trying to access another student's data
      if (user.role === "student" && user.id !== studentId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const student = await storage.getUser(studentId);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      
      // Don't send password
      const { password, ...safeStudent } = student;
      res.json(safeStudent);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Workouts routes
  app.get("/api/workouts", isAuthenticated, async (req, res) => {
    try {
      const user = req.user!;
      if (user.role === "trainer") {
        const workouts = await storage.getWorkouts(user.id);
        res.json(workouts);
      } else {
        const workouts = await storage.getStudentWorkouts(user.id);
        res.json(workouts);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/workouts", isAuthenticated, hasRole(["trainer"]), async (req, res) => {
    try {
      const user = req.user!;
      const workoutData = insertWorkoutSchema.parse({
        ...req.body,
        trainerId: user.id
      });
      
      const workout = await storage.createWorkout(workoutData);
      res.status(201).json(workout);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid workout data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/workouts/:id", isAuthenticated, async (req, res) => {
    try {
      const user = req.user!;
      const workoutId = parseInt(req.params.id, 10);
      const workout = await storage.getWorkout(workoutId);
      
      if (!workout) {
        return res.status(404).json({ message: "Workout not found" });
      }
      
      // Check if user has access to this workout
      if (user.role === "trainer" && workout.trainerId !== user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      if (user.role === "student") {
        const hasAccess = await storage.studentHasWorkoutAccess(user.id, workoutId);
        if (!hasAccess) {
          return res.status(403).json({ message: "Forbidden" });
        }
      }
      
      res.json(workout);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Schedule routes
  app.get("/api/schedule", isAuthenticated, async (req, res) => {
    try {
      const user = req.user!;
      const date = req.query.date ? new Date(req.query.date as string) : undefined;
      
      if (user.role === "trainer") {
        const sessions = await storage.getTrainerSessions(user.id, date);
        res.json({ sessions });
      } else {
        const sessions = await storage.getStudentSessions(user.id, date);
        res.json({ sessions });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/schedule", isAuthenticated, hasRole(["trainer"]), async (req, res) => {
    try {
      const user = req.user!;
      const sessionData = insertSessionSchema.parse({
        ...req.body,
        trainerId: user.id
      });
      
      const session = await storage.createSession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid session data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Payments routes
  app.get("/api/payments", isAuthenticated, async (req, res) => {
    try {
      const user = req.user!;
      if (user.role === "trainer") {
        const payments = await storage.getTrainerPayments(user.id);
        res.json(payments);
      } else {
        const payments = await storage.getStudentPayments(user.id);
        res.json(payments);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/payments", isAuthenticated, hasRole(["trainer"]), async (req, res) => {
    try {
      const user = req.user!;
      const paymentData = insertPaymentSchema.parse({
        ...req.body,
        trainerId: user.id
      });
      
      const payment = await storage.createPayment(paymentData);
      res.status(201).json(payment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid payment data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/payments/:id", isAuthenticated, hasRole(["trainer"]), async (req, res) => {
    try {
      const user = req.user!;
      const paymentId = parseInt(req.params.id, 10);
      const payment = await storage.getPayment(paymentId);
      
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      
      if (payment.trainerId !== user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const updatedPayment = await storage.updatePaymentStatus(paymentId, req.body.status);
      res.json(updatedPayment);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
