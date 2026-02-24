import { users, jobs, applications, savedJobs, type User, type InsertUser, type Job, type InsertJob, type Application, type InsertApplication } from "@shared/schema";
import { db } from "./db";
import { eq, like, and, count, desc, gte, inArray } from "drizzle-orm";
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
  getRecruiterStats(recruiterId: number): Promise<{
    totalJobs: number;
    totalApplications: number;
    activeListings: number;
    statusDistribution: { status: string; count: number }[];
    topJobs: { title: string; count: number }[];
  }>;
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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private jobs: Map<number, Job>;
  private applications: Map<number, Application>;
  private savedJobsMap: Map<number, number[]>;
  sessionStore: session.Store;
  private currentIds: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.jobs = new Map();
    this.applications = new Map();
    this.savedJobsMap = new Map();
    this.currentIds = { users: 1, jobs: 1, applications: 1 };
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const user: User = { ...insertUser, id, bio: insertUser.bio || null, title: insertUser.title || null, resumeUrl: insertUser.resumeUrl || null, skills: insertUser.skills || null, companyLogo: insertUser.companyLogo || null, companyWebsite: insertUser.companyWebsite || null };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const id = this.currentIds.jobs++;
    const job: Job = { 
      ...insertJob, 
      id, 
      status: "open", 
      postedAt: new Date(),
      salaryMin: insertJob.salaryMin ?? null,
      salaryMax: insertJob.salaryMax ?? null,
      skills: insertJob.skills ?? null,
      category: insertJob.category || "Software Development",
      recruiterId: (insertJob as any).recruiterId ?? 0
    };
    this.jobs.set(id, job);
    return job;
  }

  async getJob(id: number): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async getJobs(filters?: { search?: string, location?: string, type?: string, category?: string, minSalary?: number }): Promise<Job[]> {
    let jobsList = Array.from(this.jobs.values()).filter(j => j.status === "open");
    
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      jobsList = jobsList.filter(j => j.title.toLowerCase().includes(s) || j.description.toLowerCase().includes(s));
    }
    if (filters?.location) {
      jobsList = jobsList.filter(j => j.location.toLowerCase().includes(filters.location!.toLowerCase()));
    }
    if (filters?.type) {
      jobsList = jobsList.filter(j => j.type === filters.type);
    }
    if (filters?.category) {
      jobsList = jobsList.filter(j => j.category === filters.category);
    }
    if (filters?.minSalary) {
      jobsList = jobsList.filter(j => (j.salaryMax ?? 0) >= filters.minSalary!);
    }
    
    return jobsList.sort((a, b) => (b.postedAt?.getTime() ?? 0) - (a.postedAt?.getTime() ?? 0));
  }

  async getRecruiterStats(recruiterId: number) {
    const myJobs = Array.from(this.jobs.values()).filter(j => j.recruiterId === recruiterId);
    const myJobIds = myJobs.map(j => j.id);
    const allApps = Array.from(this.applications.values()).filter(a => myJobIds.includes(a.jobId));
    
    const statusDistributionMap = allApps.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusDistribution = Object.entries(statusDistributionMap).map(([status, count]) => ({
      status,
      count
    }));

    const topJobs = myJobs.map(job => ({
      title: job.title,
      count: allApps.filter(a => a.jobId === job.id).length
    })).sort((a, b) => b.count - a.count).slice(0, 5);

    return {
      totalJobs: myJobs.length,
      totalApplications: allApps.length,
      activeListings: myJobs.filter(j => j.status === "open").length,
      statusDistribution,
      topJobs
    };
  }

  async updateJob(id: number, updates: Partial<InsertJob> & { status?: "open" | "closed" }): Promise<Job> {
    const job = this.jobs.get(id);
    if (!job) throw new Error("Job not found");
    const updated = { ...job, ...updates };
    this.jobs.set(id, updated);
    return updated;
  }

  async deleteJob(id: number): Promise<void> {
    this.jobs.delete(id);
  }

  async saveJob(userId: number, jobId: number): Promise<boolean> {
    const saved = this.savedJobsMap.get(userId) || [];
    if (saved.includes(jobId)) {
      this.savedJobsMap.set(userId, saved.filter(i => i !== jobId));
      return false;
    } else {
      saved.push(jobId);
      this.savedJobsMap.set(userId, saved);
      return true;
    }
  }

  async getSavedJobs(userId: number): Promise<Job[]> {
    const savedIds = this.savedJobsMap.get(userId) || [];
    return savedIds.map(id => this.jobs.get(id)).filter(Boolean) as Job[];
  }

  async createApplication(insertApp: InsertApplication): Promise<Application> {
    const id = this.currentIds.applications++;
    const app: Application = { 
      ...insertApp, 
      id, 
      status: "pending", 
      appliedAt: new Date(),
      candidateId: (insertApp as any).candidateId ?? 0,
      coverLetter: insertApp.coverLetter ?? null
    };
    this.applications.set(id, app);
    return app;
  }

  async getApplication(id: number): Promise<Application | undefined> {
    return this.applications.get(id);
  }

  async getApplicationsByJob(jobId: number): Promise<(Application & { candidate: User })[]> {
    return Array.from(this.applications.values())
      .filter(a => a.jobId === jobId)
      .map(a => ({ ...a, candidate: this.users.get(a.candidateId)! }));
  }

  async getApplicationsByCandidate(candidateId: number): Promise<(Application & { job: Job })[]> {
    return Array.from(this.applications.values())
      .filter(a => a.candidateId === candidateId)
      .map(a => ({ ...a, job: this.jobs.get(a.jobId)! }));
  }

  async updateApplicationStatus(id: number, status: "pending" | "reviewed" | "interview" | "offered" | "rejected"): Promise<Application> {
    const app = this.applications.get(id);
    if (!app) throw new Error("Application not found");
    const updated = { ...app, status };
    this.applications.set(id, updated);
    return updated;
  }

  async getStats(): Promise<{ totalUsers: number, totalJobs: number, totalApplications: number, activeJobs: number }> {
    return {
      totalUsers: this.users.size,
      totalJobs: this.jobs.size,
      totalApplications: this.applications.size,
      activeJobs: Array.from(this.jobs.values()).filter(j => j.status === "open").length,
    };
  }
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
    const [job] = await db.insert(jobs).values({
      ...insertJob,
      category: insertJob.category || "Software Development"
    }).returning();
    return job;
  }

  async getJob(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job;
  }

  async getJobs(filters?: { search?: string, location?: string, type?: string, category?: string, minSalary?: number }): Promise<Job[]> {
    const conditions = [];
    if (filters?.search) {
      conditions.push(like(jobs.title, `%${filters.search}%`));
    }
    if (filters?.location) {
      conditions.push(like(jobs.location, `%${filters.location}%`));
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

  async getRecruiterStats(recruiterId: number) {
    const myJobs = await db.select().from(jobs).where(eq(jobs.recruiterId, recruiterId));
    const myJobIds = myJobs.map(j => j.id);
    
    if (myJobIds.length === 0) {
      return {
        totalJobs: 0,
        totalApplications: 0,
        activeListings: 0,
        statusDistribution: [],
        topJobs: []
      };
    }

    const allApps = await db.select().from(applications).where(inArray(applications.jobId, myJobIds));

    const statusDistributionMap = allApps.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusDistribution = Object.entries(statusDistributionMap).map(([status, count]) => ({
      status,
      count
    }));

    const topJobs = myJobs.map(job => ({
      title: job.title,
      count: allApps.filter(a => a.jobId === job.id).length
    })).sort((a, b) => b.count - a.count).slice(0, 5);

    return {
      totalJobs: myJobs.length,
      totalApplications: allApps.length,
      activeListings: myJobs.filter(j => j.status === "open").length,
      statusDistribution,
      topJobs
    };
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

export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();
