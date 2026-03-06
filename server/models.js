import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["job_seeker", "recruiter", "admin"], default: "job_seeker", required: true },
  name: String,
  email: String,
  skills: [String],
  experience: String,
  bio: String,
  title: String,
  resumeUrl: String,
  avatarUrl: String,
  location: String,
  linkedin: String,
  github: String,
  portfolio: String,
  companyLogo: String,
  companyWebsite: String,
  isPublic: { type: Boolean, default: true },
}, { timestamps: true });

const jobSchema = new mongoose.Schema({
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salaryMin: Number,
  salaryMax: Number,
  type: { type: String, enum: ["Full-time", "Part-time", "Contract", "Internship", "Remote"], default: "Full-time", required: true },
  requirements: String,
  category: { type: String, default: "Software Development", required: true },
  status: { type: String, enum: ["open", "closed"], default: "open", required: true },
  skills: [String],
  viewCount: { type: Number, default: 0 },
}, { timestamps: true });

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "reviewed", "interview", "offered", "rejected"], default: "pending", required: true },
  coverLetter: String,
  appliedAt: { type: Date, default: Date.now },
  notes: String,
  interviewDate: Date,
}, { timestamps: true });

const savedJobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
});

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["application_status", "new_applicant", "interview_scheduled", "general"], default: "general", required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  link: String,
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
export const Job = mongoose.model("Job", jobSchema);
export const Application = mongoose.model("Application", applicationSchema);
export const SavedJob = mongoose.model("SavedJob", savedJobSchema);
export const Notification = mongoose.model("Notification", notificationSchema);

// Compatibility aliases
export const users = User;
export const jobs = Job;
export const applications = Application;
export const savedJobs = SavedJob;
export const notifications = Notification;
