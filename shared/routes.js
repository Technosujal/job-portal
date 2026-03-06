import { 
  insertJobSchema, 
  updateJobSchema, 
  insertApplicationSchema, 
  updateStatusSchema,
  updateUserSchema
} from "./schema.js";

export const api = {
  auth: {
    login: { path: "/api/login", method: "POST" },
    register: { path: "/api/register", method: "POST" },
    logout: { path: "/api/logout", method: "POST" },
    user: { path: "/api/user", method: "GET" },
    update: { path: "/api/user", method: "PATCH", input: updateUserSchema },
  },
  jobs: {
    list: { path: "/api/jobs", method: "GET" },
    get: { path: "/api/jobs/:id", method: "GET" },
    create: { path: "/api/jobs", method: "POST", input: insertJobSchema },
    update: { path: "/api/jobs/:id", method: "PATCH", input: updateJobSchema },
    save: { path: "/api/jobs/:id/save", method: "POST" },
    saved: { path: "/api/jobs/saved", method: "GET" },
    scoreCv: { path: "/api/jobs/:id/score-cv", method: "POST" },
  },
  applications: {
    list: { path: "/api/applications", method: "GET" },
    create: { path: "/api/applications", method: "POST", input: insertApplicationSchema },
    updateStatus: { path: "/api/applications/:id/status", method: "PATCH", input: updateStatusSchema },
  },
  recruiter: {
    stats: { path: "/api/recruiter/stats", method: "GET" },
  },
  stats: {
    get: { path: "/api/stats", method: "GET" },
  },
};


export function buildUrl(path, params) {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value.toString());
    });
  }
  return url;
}

