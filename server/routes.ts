import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { api } from "@shared/routes";
import { z } from "zod";
import { User } from "@shared/schema";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";
import { scoreCVAgainstJob } from "./ai";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);
  registerObjectStorageRoutes(app);

  // Jobs
  app.get(api.jobs.list.path, async (req, res) => {
    const filters = {
      search: req.query.search as string,
      location: req.query.location as string,
      type: req.query.type as string,
      category: req.query.category as string,
      minSalary: req.query.minSalary ? Number(req.query.minSalary) : undefined,
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
    if (!req.isAuthenticated() || (req.user as User).role !== "recruiter") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const input = api.jobs.create.input.parse(req.body);
    const job = await storage.createJob({ ...input, recruiterId: (req.user as User).id });
    res.status(201).json(job);
  });

  app.patch(api.jobs.update.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as User).role !== "recruiter") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const job = await storage.getJob(Number(req.params.id));
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.recruiterId !== (req.user as User).id && (req.user as User).role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    const input = api.jobs.update.input.parse(req.body);
    const updatedJob = await storage.updateJob(Number(req.params.id), input);
    res.json(updatedJob);
  });

  app.post(api.jobs.save.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as User).role !== "job_seeker") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const saved = await storage.saveJob((req.user as User).id, Number(req.params.id));
    res.json({ saved });
  });

  app.get(api.jobs.saved.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as User).role !== "job_seeker") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const jobs = await storage.getSavedJobs((req.user as User).id);
    res.json(jobs);
  });

  // Applications
  app.post(api.applications.create.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as User).role !== "job_seeker") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const input = api.applications.create.input.parse(req.body);
    
    const job = await storage.getJob(input.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const app = await storage.createApplication({
      ...input,
      candidateId: (req.user as User).id,
    });
    res.status(201).json(app);
  });

  app.get(api.applications.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    const jobId = req.query.jobId ? Number(req.query.jobId) : undefined;
    const user = req.user as User;

    if (user.role === "recruiter") {
      if (!jobId) return res.status(400).json({ message: "Job ID required for recruiters" });
      const job = await storage.getJob(jobId);
      if (!job || job.recruiterId !== user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const apps = await storage.getApplicationsByJob(jobId);
      return res.json(apps);
    } else if (user.role === "job_seeker") {
      const apps = await storage.getApplicationsByCandidate(user.id);
      return res.json(apps);
    }
    
    res.status(403).json({ message: "Forbidden" });
  });

  app.patch(api.applications.updateStatus.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as User).role !== "recruiter") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const input = api.applications.updateStatus.input.parse(req.body);
    const app = await storage.getApplication(Number(req.params.id));
    
    if (!app) return res.status(404).json({ message: "Application not found" });
    
    const job = await storage.getJob(app.jobId);
    if (!job || job.recruiterId !== (req.user as User).id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updatedApp = await storage.updateApplicationStatus(Number(req.params.id), input.status);
    res.json(updatedApp);
  });

  // Admin Stats
  app.get(api.stats.get.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as User).role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const stats = await storage.getStats();
    res.json(stats);
  });

  // CV Scorer
  app.post(api.jobs.scoreCv.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as User).role !== "job_seeker") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const job = await storage.getJob(Number(req.params.id));
    if (!job) return res.status(404).json({ message: "Job not found" });

    const result = await scoreCVAgainstJob(job, req.user as User);
    res.json(result);
  });

  const httpServer = createServer(app);

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
    const adminPassword = "c9d9d201083981882f3424681628173468571404c00492211905819779357422f281203020959223075841793237145701822830303893325608240409026408.83d65011666497123959828238191986";
    
    // Create Admin
    await storage.createUser({
      username: "admin",
      password: adminPassword,
      role: "admin",
      name: "System Admin",
      email: "admin@example.com",
      bio: "Platform Administrator",
    });

    // Create Recruiters
    const recruiter1 = await storage.createUser({
      username: "recruiter",
      password: adminPassword,
      role: "recruiter",
      name: "Sarah Chen",
      email: "sarah@techcorp.com",
      bio: "Technical Talent Lead at TechCorp",
    });

    const recruiter2 = await storage.createUser({
      username: "recruiter2",
      password: adminPassword,
      role: "recruiter",
      name: "Marcus Thorne",
      email: "marcus@creativecloud.io",
      bio: "Hiring for design and product roles",
    });

    const recruiter3 = await storage.createUser({
      username: "recruiter3",
      password: adminPassword,
      role: "recruiter",
      name: "Elena Rodriguez",
      email: "elena@growthscale.com",
      bio: "Scaling the best marketing teams",
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
      skills: ["React", "TypeScript", "Tailwind CSS"],
    });

    // Software Development Jobs
    const job1 = await storage.createJob({
      title: "Senior React Developer",
      company: "TechCorp",
      description: "We are looking for an experienced React developer to join our team building next-gen financial tools.",
      requirements: "- 5+ years of experience with React\n- Strong TypeScript skills\n- Experience with state management (Redux/Zustand)",
      salaryMin: 120000,
      salaryMax: 160000,
      category: "Software Development",
      location: "Remote",
      type: "Full-time",
      recruiterId: recruiter1.id,
      status: "open",
      skills: ["React", "TypeScript", "Zustand"],
    });

    await storage.createJob({
      title: "Backend Engineer",
      company: "TechCorp",
      description: "Join our backend team to build scalable APIs and microservices using Node.js and Go.",
      requirements: "- Experience with Node.js and PostgreSQL\n- Understanding of Docker and Kubernetes",
      salaryMin: 110000,
      salaryMax: 150000,
      category: "Software Development",
      location: "New York, NY",
      type: "Full-time",
      recruiterId: recruiter1.id,
      status: "open",
      skills: ["Node.js", "PostgreSQL", "Docker"],
    });

    await storage.createJob({
      title: "Full Stack Developer",
      company: "InnovateSoft",
      description: "Work on diverse projects for world-class clients using the latest web technologies.",
      requirements: "- Proficient in React and Node.js\n- Experience with Next.js is a plus",
      salaryMin: 95000,
      salaryMax: 135000,
      category: "Software Development",
      location: "San Francisco, CA",
      type: "Full-time",
      recruiterId: recruiter1.id,
      status: "open",
      skills: ["React", "Node.js", "Next.js"],
    });

    // Design Jobs
    await storage.createJob({
      title: "Senior Product Designer",
      company: "CreativeCloud",
      description: "Lead the design of our flagship mobile and web applications, focusing on user-centric experiences.",
      requirements: "- 4+ years of product design experience\n- Strong portfolio showcasing UX/UI skills\n- Mastery of Figma",
      salaryMin: 105000,
      salaryMax: 145000,
      category: "Design",
      location: "Remote",
      type: "Full-time",
      recruiterId: recruiter2.id,
      status: "open",
      skills: ["Figma", "UI/UX", "Prototyping"],
    });

    await storage.createJob({
      title: "Motion Designer",
      company: "CreativeCloud",
      description: "Create engaging animations and video content for our brand and product marketing.",
      requirements: "- High proficiency in After Effects\n- Strong sense of timing and motion",
      salaryMin: 85000,
      salaryMax: 115000,
      category: "Design",
      location: "Los Angeles, CA",
      type: "Contract",
      recruiterId: recruiter2.id,
      status: "open",
      skills: ["After Effects", "Motion Graphics"],
    });

    // Marketing & Growth Jobs
    await storage.createJob({
      title: "Marketing Manager",
      company: "GrowthScale",
      description: "Drive user acquisition and retention strategies across multiple digital channels.",
      requirements: "- Proven experience in growth marketing\n- Data-driven mindset",
      salaryMin: 90000,
      salaryMax: 130000,
      category: "Marketing",
      location: "Austin, TX",
      type: "Full-time",
      recruiterId: recruiter3.id,
      status: "open",
      skills: ["SEO", "SEM", "Content Strategy"],
    });

    await storage.createJob({
      title: "Social Media Specialist",
      company: "GrowthScale",
      description: "Build and engage our community across Tik-Tok, Instagram, and LinkedIn.",
      requirements: "- Creative content creation skills\n- Deep understanding of social trends",
      salaryMin: 60000,
      salaryMax: 85000,
      category: "Marketing",
      location: "Remote",
      type: "Full-time",
      recruiterId: recruiter3.id,
      status: "open",
      skills: ["Social Media", "Video Editing"],
    });

    // Customer Support Jobs
    await storage.createJob({
      title: "Customer Success Lead",
      company: "HelpDirect",
      description: "Ensure our enterprise clients get the maximum value from our platform.",
      requirements: "- 3+ years in SaaS customer success\n- Excellent communication skills",
      salaryMin: 80000,
      salaryMax: 110000,
      category: "Customer Support",
      location: "Remote",
      type: "Full-time",
      recruiterId: recruiter2.id,
      status: "open",
      skills: ["Communication", "Client Management"],
    });

    // Create Initial Application
    await storage.createApplication({
      jobId: job1.id,
      candidateId: seeker.id,
      coverLetter: "I am very interested in this position and have extensive experience with React and TypeScript.",
    });

    console.log("Database seeded with comprehensive data!");
  }
}
