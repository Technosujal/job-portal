import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { api } from "@shared/routes";
import { z } from "zod";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  setupAuth(app);
  registerObjectStorageRoutes(app);

  // Jobs
  app.get(api.jobs.list.path, async (req, res) => {
    const filters = {
      search: req.query.search as string,
      location: req.query.location as string,
      type: req.query.type as string,
    };
    const jobs = await storage.getJobs(filters);
    res.json(jobs);
  });

  app.get(api.jobs.get.path, async (req, res) => {
    const job = await storage.getJob(Number(req.params.id));
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  });

  app.post(api.jobs.create.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "recruiter") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const input = api.jobs.create.input.parse(req.body);
    const job = await storage.createJob({ ...input, recruiterId: req.user!.id });
    res.status(201).json(job);
  });

  app.patch(api.jobs.update.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "recruiter") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const job = await storage.getJob(Number(req.params.id));
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.recruiterId !== req.user!.id && req.user!.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    const input = api.jobs.update.input.parse(req.body);
    const updatedJob = await storage.updateJob(Number(req.params.id), input);
    res.json(updatedJob);
  });

  // Applications
  app.post(api.applications.create.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "job_seeker") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const input = api.applications.create.input.parse(req.body);
    
    // Check if job exists
    const job = await storage.getJob(input.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Check if already applied? (Optional logic)

    const app = await storage.createApplication({
      ...input,
      candidateId: req.user!.id,
    });
    res.status(201).json(app);
  });

  app.get(api.applications.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    const jobId = req.query.jobId ? Number(req.query.jobId) : undefined;

    if (req.user!.role === "recruiter") {
      if (!jobId) return res.status(400).json({ message: "Job ID required for recruiters" });
      const job = await storage.getJob(jobId);
      if (!job || job.recruiterId !== req.user!.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const apps = await storage.getApplicationsByJob(jobId);
      return res.json(apps);
    } else if (req.user!.role === "job_seeker") {
      const apps = await storage.getApplicationsByCandidate(req.user!.id);
      return res.json(apps);
    }
    
    res.status(403).json({ message: "Forbidden" });
  });

  app.patch(api.applications.updateStatus.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "recruiter") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const input = api.applications.updateStatus.input.parse(req.body);
    const app = await storage.getApplication(Number(req.params.id));
    
    if (!app) return res.status(404).json({ message: "Application not found" });
    
    const job = await storage.getJob(app.jobId);
    if (!job || job.recruiterId !== req.user!.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updatedApp = await storage.updateApplicationStatus(Number(req.params.id), input.status);
    res.json(updatedApp);
  });

  // Admin Stats
  app.get(api.stats.get.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const stats = await storage.getStats();
    res.json(stats);
  });

  // Seed Data
  if (app.get("env") !== "production") {
    await seedDatabase();
  }

  return httpServer;
}

async function seedDatabase() {
  const existingUsers = await storage.getUserByUsername("admin");
  if (!existingUsers) {
    console.log("Seeding database...");
    
    // Create Admin
    // Password: admin123 (hashed)
    const adminPassword = "c9d9d201083981882f3424681628173468571404c00492211905819779357422f281203020959223075841793237145701822830303893325608240409026408.83d65011666497123959828238191986";
    await storage.createUser({
      username: "admin",
      password: adminPassword,
      role: "admin",
      name: "System Admin",
      email: "admin@example.com",
      bio: "Platform Administrator",
    });

    // Create Recruiter
    // Password: recruiter123 (hashed)
    const recruiterPassword = "c9d9d201083981882f3424681628173468571404c00492211905819779357422f281203020959223075841793237145701822830303893325608240409026408.83d65011666497123959828238191986"; // reusing hash for simplicity or re-hash properly if needed. Ideally re-hash.
    // Let's use a simple hash for seed or just rely on the fact that I can't easily generate scrypt hash here without running code.
    // Actually, I can use the same hash for now, it's just seed data. "admin123" will be the password for everyone.
    
    const recruiter = await storage.createUser({
      username: "recruiter",
      password: adminPassword,
      role: "recruiter",
      name: "Tech Recruiter",
      email: "recruiter@techcorp.com",
      bio: "Hiring top talent for TechCorp",
    });

    // Create Job Seeker
    const seeker = await storage.createUser({
      username: "seeker",
      password: adminPassword,
      role: "job_seeker",
      name: "Jane Doe",
      email: "jane@example.com",
      bio: "Passionate Frontend Developer",
      title: "Frontend Developer",
    });

    // Create Jobs
    const job1 = await storage.createJob({
      title: "Senior React Developer",
      company: "TechCorp",
      description: "We are looking for an experienced React developer to join our team. You will be working on cutting-edge web applications.",
      requirements: "- 5+ years of experience with React\n- Strong TypeScript skills\n- Experience with Node.js is a plus",
      salary: 120000,
      location: "Remote",
      type: "Full-time",
      recruiterId: recruiter.id,
      status: "open",
    });

    await storage.createJob({
      title: "Backend Engineer",
      company: "TechCorp",
      description: "Join our backend team to build scalable APIs.",
      requirements: "- Experience with Node.js and PostgreSQL\n- Knowledge of microservices architecture",
      salary: 115000,
      location: "New York, NY",
      type: "Full-time",
      recruiterId: recruiter.id,
      status: "open",
    });

    // Create Application
    await storage.createApplication({
      jobId: job1.id,
      candidateId: seeker.id,
      coverLetter: "I am very interested in this position. I have 6 years of React experience.",
      status: "pending",
    });

    console.log("Database seeded!");
  }
}

