import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["job_seeker", "recruiter", "admin"] }).notNull().default("job_seeker"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  bio: text("bio"),
  title: text("title"),
  resumeUrl: text("resume_url"),
  skills: text("skills").array(), // For job seekers
  companyLogo: text("company_logo"), // For recruiters
  companyWebsite: text("company_website"), // For recruiters
});

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements").notNull(),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  category: text("category").notNull().default("Software Development"),
  skills: text("skills").array(), // Required skills
  location: text("location").notNull(),
  type: text("type").notNull(),
  recruiterId: integer("recruiter_id").notNull(),
  status: text("status", { enum: ["open", "closed"] }).notNull().default("open"),
  postedAt: timestamp("posted_at").defaultNow(),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull(),
  candidateId: integer("candidate_id").notNull(),
  status: text("status", { enum: ["pending", "reviewed", "interview", "offered", "rejected"] }).notNull().default("pending"),
  coverLetter: text("cover_letter"),
  appliedAt: timestamp("applied_at").defaultNow(),
});

export const savedJobs = pgTable("saved_jobs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  jobId: integer("job_id").notNull(),
  savedAt: timestamp("saved_at").defaultNow(),
});

// Zod Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
  name: true,
  email: true,
  bio: true,
  title: true,
  resumeUrl: true,
  skills: true,
  companyLogo: true,
  companyWebsite: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({ 
  id: true, 
  postedAt: true,
  recruiterId: true 
});

export const insertApplicationSchema = createInsertSchema(applications).omit({ 
  id: true, 
  appliedAt: true,
  status: true,
  candidateId: true
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;

export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;

export type SavedJob = typeof savedJobs.$inferSelect;

// API Types
export type LoginRequest = Pick<InsertUser, "username" | "password">;
export type RegisterRequest = InsertUser;

export type CreateJobRequest = InsertJob;
export type UpdateJobRequest = Partial<InsertJob> & { status?: "open" | "closed" };

export type CreateApplicationRequest = {
  jobId: number;
  coverLetter?: string;
};

export type UpdateApplicationStatusRequest = {
  status: "pending" | "reviewed" | "interview" | "offered" | "rejected";
};
