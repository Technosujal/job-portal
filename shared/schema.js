import { z } from "zod";

// Validation Schemas

export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  role: z.enum(["job_seeker", "recruiter", "admin"]).default("job_seeker"),
  name: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  skills: z.array(z.string()).optional(),
  experience: z.string().optional(),
  bio: z.string().optional(),
  title: z.string().optional(),
  resumeUrl: z.string().optional(),
  avatarUrl: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  portfolio: z.string().optional(),
  isPublic: z.boolean().default(true),
});

export const updateUserSchema = insertUserSchema.partial();

export const insertJobSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  salaryMin: z.number().nullable().optional(),
  salaryMax: z.number().nullable().optional(),
  type: z.enum(["Full-time", "Part-time", "Contract", "Internship", "Remote"]).default("Full-time"),
  requirements: z.string().nullable().optional(),
  category: z.string().default("Software Development"),
  skills: z.array(z.string()).optional(),
  status: z.enum(["open", "closed"]).optional(),
});

export const updateJobSchema = insertJobSchema.partial();

export const insertApplicationSchema = z.object({
  jobId: z.string(),
  coverLetter: z.string().optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(["pending", "reviewed", "interview", "offered", "rejected"])
});

export const updateNotesSchema = z.object({
  notes: z.string()
});

export const updateInterviewSchema = z.object({
  interviewDate: z.string(),
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
