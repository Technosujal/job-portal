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
  title: text("title"), // For job seekers (e.g. "Frontend Developer")
  resumeUrl: text("resume_url"), // URL from object storage
});

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements").notNull(),
  salary: integer("salary").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(), // Full-time, Part-time, Contract
  recruiterId: integer("recruiter_id").notNull(), // Linked to users.id
  status: text("status", { enum: ["open", "closed"] }).notNull().default("open"),
  postedAt: timestamp("posted_at").defaultNow(),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull(), // Linked to jobs.id
  candidateId: integer("candidate_id").notNull(), // Linked to users.id
  status: text("status", { enum: ["pending", "reviewed", "interview", "offered", "rejected"] }).notNull().default("pending"),
  coverLetter: text("cover_letter"),
  appliedAt: timestamp("applied_at").defaultNow(),
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
