import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").$type<"job_seeker" | "recruiter" | "admin">().notNull().default("job_seeker"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  bio: text("bio"),
  title: text("title"),
  resumeUrl: text("resume_url"),
  skills: text("skills", { mode: "json" }).$type<string[]>(), // Automatic JSON handling
  companyLogo: text("company_logo"), // For recruiters
  companyWebsite: text("company_website"), // For recruiters
});

export const jobs = sqliteTable("jobs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  company: text("company").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements").notNull(),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  category: text("category").notNull().default("Software Development"),
  skills: text("skills", { mode: "json" }).$type<string[]>(), // Automatic JSON handling
  location: text("location").notNull(),
  type: text("type").notNull(),
  recruiterId: integer("recruiter_id").notNull(),
  status: text("status").$type<"open" | "closed">().notNull().default("open"),
  postedAt: integer("posted_at", { mode: "timestamp" }).default(new Date()),
});

export const applications = sqliteTable("applications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  jobId: integer("job_id").notNull(),
  candidateId: integer("candidate_id").notNull(),
  status: text("status").$type<"pending" | "reviewed" | "interview" | "offered" | "rejected">().notNull().default("pending"),
  coverLetter: text("cover_letter"),
  appliedAt: integer("applied_at", { mode: "timestamp" }).default(new Date()),
});

export const savedJobs = sqliteTable("saved_jobs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  jobId: integer("job_id").notNull(),
  savedAt: integer("saved_at", { mode: "timestamp" }).default(new Date()),
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
});

export const insertApplicationSchema = createInsertSchema(applications).omit({ 
  id: true, 
  appliedAt: true,
  status: true,
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
