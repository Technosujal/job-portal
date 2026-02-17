import { users, jobs, applications, savedJobs, type User, type InsertUser, type Job, type InsertJob, type Application, type InsertApplication } from "@shared/schema";
import { db } from "./db";
import { eq, ilike, and, count, desc, gte, inArray } from "drizzle-orm";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  sessionStore: session.Store;
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;

  // Jobs
  createJob(job: InsertJob): Promise<Job>;
  getJob(id: number): Promise<Job | undefined>;
  getJobs(filters?: { search?: string, location?: string, type?: string, category?: string, minSalary?: number }): Promise<Job[]>;
  updateJob(id: number, job: Partial<InsertJob> & { status?: "open" | "closed" }): Promise<Job>;
  deleteJob(id: number): Promise<void>;
  saveJob(userId: number, jobId: number): Promise<boolean>;
  getSavedJobs(userId: number): Promise<Job[]>;

  // Applications
  createApplication(app: InsertApplication): Promise<Application>;
  getApplication(id: number): Promise<Application | undefined>;
  getApplicationsByJob(jobId: number): Promise<(Application & { candidate: User })[]>;
  getApplicationsByCandidate(candidateId: number): Promise<(Application & { job: Job })[]>;
  updateApplicationStatus(id: number, status: "pending" | "reviewed" | "interview" | "offered" | "rejected"): Promise<Application>;

  // Stats
  getStats(): Promise<{ totalUsers: number, totalJobs: number, totalApplications: number, activeJobs: number }>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user;
  }

  // Jobs
  async createJob(insertJob: InsertJob): Promise<Job> {
    const [job] = await db.insert(jobs).values(insertJob).returning();
    return job;
  }

  async getJob(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job;
  }

  async getJobs(filters?: { search?: string, location?: string, type?: string, category?: string, minSalary?: number }): Promise<Job[]> {
    const conditions = [];
    if (filters?.search) {
      conditions.push(ilike(jobs.title, `%${filters.search}%`));
    }
    if (filters?.location) {
      conditions.push(ilike(jobs.location, `%${filters.location}%`));
    }
    if (filters?.type) {
      conditions.push(eq(jobs.type, filters.type));
    }
    if (filters?.category) {
      conditions.push(eq(jobs.category, filters.category));
    }
    if (filters?.minSalary) {
      conditions.push(gte(jobs.salaryMax, filters.minSalary));
    }

    conditions.push(eq(jobs.status, "open"));

    return await db.select().from(jobs).where(and(...conditions)).orderBy(desc(jobs.postedAt));
  }

  async updateJob(id: number, updates: Partial<InsertJob> & { status?: "open" | "closed" }): Promise<Job> {
    const [job] = await db.update(jobs).set(updates).where(eq(jobs.id, id)).returning();
    return job;
  }

  async deleteJob(id: number): Promise<void> {
    await db.delete(jobs).where(eq(jobs.id, id));
  }

  async saveJob(userId: number, jobId: number): Promise<boolean> {
    const [existing] = await db.select().from(savedJobs).where(and(eq(savedJobs.userId, userId), eq(savedJobs.jobId, jobId)));
    if (existing) {
      await db.delete(savedJobs).where(and(eq(savedJobs.userId, userId), eq(savedJobs.jobId, jobId)));
      return false;
    } else {
      await db.insert(savedJobs).values({ userId, jobId });
      return true;
    }
  }

  async getSavedJobs(userId: number): Promise<Job[]> {
    const saved = await db.select().from(savedJobs).where(eq(savedJobs.userId, userId));
    if (saved.length === 0) return [];
    
    const jobIds = saved.map(s => s.jobId);
    return await db.select().from(jobs).where(inArray(jobs.id, jobIds));
  }

  // Applications
  async createApplication(insertApp: InsertApplication): Promise<Application> {
    const [app] = await db.insert(applications).values(insertApp).returning();
    return app;
  }

  async getApplication(id: number): Promise<Application | undefined> {
    const [app] = await db.select().from(applications).where(eq(applications.id, id));
    return app;
  }

  async getApplicationsByJob(jobId: number): Promise<(Application & { candidate: User })[]> {
    const results = await db
      .select({
        application: applications,
        candidate: users,
      })
      .from(applications)
      .innerJoin(users, eq(applications.candidateId, users.id))
      .where(eq(applications.jobId, jobId));
    
    return results.map(r => ({ ...r.application, candidate: r.candidate }));
  }

  async getApplicationsByCandidate(candidateId: number): Promise<(Application & { job: Job })[]> {
    const results = await db
      .select({
        application: applications,
        job: jobs,
      })
      .from(applications)
      .innerJoin(jobs, eq(applications.jobId, jobs.id))
      .where(eq(applications.candidateId, candidateId));
      
    return results.map(r => ({ ...r.application, job: r.job }));
  }

  async updateApplicationStatus(id: number, status: "pending" | "reviewed" | "interview" | "offered" | "rejected"): Promise<Application> {
    const [app] = await db.update(applications).set({ status }).where(eq(applications.id, id)).returning();
    return app;
  }

  async getStats(): Promise<{ totalUsers: number, totalJobs: number, totalApplications: number, activeJobs: number }> {
    const [usersCount] = await db.select({ count: count() }).from(users);
    const [jobsCount] = await db.select({ count: count() }).from(jobs);
    const [appsCount] = await db.select({ count: count() }).from(applications);
    const [activeJobsCount] = await db.select({ count: count() }).from(jobs).where(eq(jobs.status, "open"));

    return {
      totalUsers: Number(usersCount.count),
      totalJobs: Number(jobsCount.count),
      totalApplications: Number(appsCount.count),
      activeJobs: Number(activeJobsCount.count),
    };
  }
}

export const storage = new DatabaseStorage();
