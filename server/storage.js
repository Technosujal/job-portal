import { User, Job, Application, SavedJob, Notification } from "./models.js";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export class MongoStorage {
  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  // --- Users ---
  async getUser(id) {
    const user = await User.findById(id);
    return user ? this.mapId(user.toObject()) : null;
  }

  async getUserByUsername(username) {
    const user = await User.findOne({ username });
    return user ? this.mapId(user.toObject()) : null;
  }

  async createUser(insertUser) {
    const user = new User(insertUser);
    await user.save();
    return this.mapId(user.toObject());
  }

  async updateUser(id, updates) {
    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    return user ? this.mapId(user.toObject()) : null;
  }

  async getUsers() {
    const usersList = await User.find();
    return usersList.map(u => this.mapId(u.toObject()));
  }

  // --- Jobs ---
  async createJob(insertJob) {
    const job = new Job({
      ...insertJob,
      category: insertJob.category || "Software Development"
    });
    await job.save();
    return this.mapId(job.toObject());
  }

  async getJob(id) {
    const job = await Job.findById(id);
    return job ? this.mapId(job.toObject()) : null;
  }

  async getJobs(filters) {
    const query = {};
    if (filters?.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: "i" } },
        { description: { $regex: filters.search, $options: "i" } }
      ];
    }
    if (filters?.location) {
      query.location = { $regex: filters.location, $options: "i" };
    }
    if (filters?.type) {
      query.type = filters.type;
    }
    if (filters?.category) {
      query.category = filters.category;
    }
    if (filters?.minSalary) {
      query.salaryMax = { $gte: filters.minSalary };
    }

    if (!(filters?.includeClosed && filters?.recruiterId)) {
      query.status = "open";
    } else if (filters?.recruiterId) {
      query.recruiterId = filters.recruiterId;
    }

    const jobsList = await Job.find(query).sort({ createdAt: -1 });
    return jobsList.map(j => this.mapId(j.toObject()));
  }

  async getRecruiterStats(recruiterId) {
    const myJobs = await Job.find({ recruiterId });
    const myJobIds = myJobs.map(j => j._id);
    
    if (myJobIds.length === 0) {
      return {
        totalJobs: 0,
        totalApplications: 0,
        activeListings: 0,
        statusDistribution: [],
        topJobs: []
      };
    }

    const allApps = await Application.find({ jobId: { $in: myJobIds } });

    const statusDistributionMap = allApps.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});

    const statusDistribution = Object.entries(statusDistributionMap).map(([status, count]) => ({
      status,
      count
    }));

    const topJobs = myJobs.map(job => ({
      title: job.title,
      count: allApps.filter(a => a.jobId.toString() === job._id.toString()).length
    })).sort((a, b) => b.count - a.count).slice(0, 5);

    return {
      totalJobs: myJobs.length,
      totalApplications: allApps.length,
      activeListings: myJobs.filter(j => j.status === "open").length,
      statusDistribution,
      topJobs
    };
  }

  async updateJob(id, updates) {
    const job = await Job.findByIdAndUpdate(id, updates, { new: true });
    return job ? this.mapId(job.toObject()) : null;
  }

  async deleteJob(id) {
    await Job.findByIdAndDelete(id);
  }

  async incrementJobView(jobId) {
    await Job.findByIdAndUpdate(jobId, { $inc: { viewCount: 1 } });
  }

  // --- Saved Jobs ---
  async saveJob(userId, jobId) {
    const existing = await SavedJob.findOne({ userId, jobId });
    if (existing) {
      await SavedJob.deleteOne({ _id: existing._id });
      return false;
    } else {
      const saved = new SavedJob({ userId, jobId });
      await saved.save();
      return true;
    }
  }

  async getSavedJobs(userId) {
    const saved = await SavedJob.find({ userId });
    if (saved.length === 0) return [];
    
    const jobIds = saved.map(s => s.jobId);
    const jobsList = await Job.find({ _id: { $in: jobIds } });
    return jobsList.map(j => this.mapId(j.toObject()));
  }

  // --- Applications ---
  async createApplication(insertApp) {
    const app = new Application(insertApp);
    await app.save();
    return this.mapId(app.toObject());
  }

  async getApplication(id) {
    const app = await Application.findById(id);
    return app ? this.mapId(app.toObject()) : null;
  }

  async getApplicationsByJob(jobId) {
    const apps = await Application.find({ jobId }).populate("candidateId");
    return apps.map(a => {
      const appObj = a.toObject();
      const candidate = appObj.candidateId;
      delete appObj.candidateId;
      return { ...this.mapId(appObj), candidate: this.mapId(candidate) };
    });
  }

  async getApplicationsByCandidate(candidateId) {
    const apps = await Application.find({ candidateId }).populate("jobId");
    return apps.map(a => {
      const appObj = a.toObject();
      const job = appObj.jobId;
      delete appObj.jobId;
      return { ...this.mapId(appObj), job: this.mapId(job) };
    });
  }

  async getApplicationsByRecruiter(recruiterId) {
    const myJobs = await Job.find({ recruiterId });
    const myJobIds = myJobs.map(j => j._id);
    
    const apps = await Application.find({ jobId: { $in: myJobIds } })
      .populate("candidateId")
      .populate("jobId");
      
    return apps.map(a => {
      const appObj = a.toObject();
      const candidate = appObj.candidateId;
      const job = appObj.jobId;
      delete appObj.candidateId;
      delete appObj.jobId;
      return { 
        ...this.mapId(appObj), 
        candidate: this.mapId(candidate),
        job: this.mapId(job)
      };
    });
  }

  async updateApplicationStatus(id, status) {
    const app = await Application.findByIdAndUpdate(id, { status }, { new: true });
    if (app) {
      const statusMessages = {
        reviewed: "Your application has been reviewed by the recruiter.",
        interview: "Congratulations! You've been selected for an interview.",
        offered: "🎉 You've received a job offer! Check your application for details.",
        rejected: "We're sorry, your application was not selected this time. Keep applying!",
        pending: "Your application status has been updated.",
      };
      await this.createNotification({
        userId: app.candidateId,
        type: "application_status",
        title: `Application ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: statusMessages[status] || `Your application status changed to ${status}.`,
        link: "/seeker/applications",
      });
    }
    return app ? this.mapId(app.toObject()) : null;
  }

  async updateApplicationNotes(id, notes) {
    const app = await Application.findByIdAndUpdate(id, { notes }, { new: true });
    return app ? this.mapId(app.toObject()) : null;
  }

  async updateApplicationInterview(id, interviewDate) {
    const date = new Date(interviewDate);
    const app = await Application.findByIdAndUpdate(id, { interviewDate: date }, { new: true });
    if (app) {
      await this.createNotification({
        userId: app.candidateId,
        type: "interview_scheduled",
        title: "Interview Scheduled!",
        message: `Your interview has been scheduled for ${date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}.`,
        link: "/seeker/applications",
      });
    }
    return app ? this.mapId(app.toObject()) : null;
  }

  async getRecommendedJobs(userId) {
    const user = await this.getUser(userId);
    if (!user || !user.skills || user.skills.length === 0) {
      const openJobs = await Job.find({ status: "open" }).sort({ createdAt: -1 }).limit(6);
      return openJobs.map(j => this.mapId(j.toObject()));
    }

    const openJobs = await Job.find({ status: "open" });
    const userSkills = (user.skills || []).map(s => s.toLowerCase());
    const userTitle = (user.title || "").toLowerCase();
    
    const scored = openJobs.map(job => {
      const jobSkills = (job.skills || []).map(s => s.toLowerCase());
      const skillMatches = jobSkills.filter(s => userSkills.includes(s)).length;
      const titleMatch = userTitle && job.title.toLowerCase().includes(userTitle.split(" ")[0]) ? 2 : 0;
      return { ...this.mapId(job.toObject()), _score: skillMatches + titleMatch };
    });
    
    scored.sort((a, b) => b._score - a._score);
    return scored.slice(0, 6);
  }

  // --- Notifications ---
  async createNotification({ userId, type, title, message, link }) {
    const notif = new Notification({ userId, type, title, message, link });
    await notif.save();
    return this.mapId(notif.toObject());
  }

  async getNotifications(userId) {
    const notifs = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(30);
    return notifs.map(n => this.mapId(n.toObject()));
  }

  async markNotificationRead(notifId, userId) {
    const notif = await Notification.findOneAndUpdate(
      { _id: notifId, userId },
      { read: true },
      { new: true }
    );
    return notif ? this.mapId(notif.toObject()) : null;
  }

  async markAllNotificationsRead(userId) {
    await Notification.updateMany({ userId }, { read: true });
  }

  async getStats() {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const activeJobs = await Job.countDocuments({ status: "open" });

    return {
      totalUsers,
      totalJobs,
      totalApplications,
      activeJobs,
    };
  }

  // Helper to map _id to id
  mapId(obj) {
    if (!obj) return null;
    const newObj = { ...obj, id: obj._id.toString() };
    delete newObj._id;
    delete newObj.__v;
    return newObj;
  }
}

export const storage = new MongoStorage();
