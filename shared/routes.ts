import { z } from "zod";
import { insertUserSchema, insertJobSchema, insertApplicationSchema, users, jobs, applications } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    register: {
      method: "POST" as const,
      path: "/api/register" as const,
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: "POST" as const,
      path: "/api/login" as const,
      input: z.object({
        username: z.string(),
        password: z.string(),
      }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: "POST" as const,
      path: "/api/logout" as const,
      responses: {
        200: z.void(),
      },
    },
    user: {
      method: "GET" as const,
      path: "/api/user" as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  jobs: {
    list: {
      method: "GET" as const,
      path: "/api/jobs" as const,
      input: z.object({
        search: z.string().optional(),
        location: z.string().optional(),
        type: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof jobs.$inferSelect>()),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/jobs/:id" as const,
      responses: {
        200: z.custom<typeof jobs.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/jobs" as const,
      input: insertJobSchema,
      responses: {
        201: z.custom<typeof jobs.$inferSelect>(),
        401: errorSchemas.unauthorized,
        400: errorSchemas.validation,
      },
    },
    update: {
      method: "PATCH" as const,
      path: "/api/jobs/:id" as const,
      input: insertJobSchema.partial().extend({ status: z.enum(["open", "closed"]).optional() }),
      responses: {
        200: z.custom<typeof jobs.$inferSelect>(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
  },
  applications: {
    create: {
      method: "POST" as const,
      path: "/api/applications" as const,
      input: z.object({
        jobId: z.number(),
        coverLetter: z.string().optional(),
      }),
      responses: {
        201: z.custom<typeof applications.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    list: {
      method: "GET" as const,
      path: "/api/applications" as const,
      // For recruiters: list apps for a job (query param jobId)
      // For seekers: list my apps (no params)
      input: z.object({
        jobId: z.number().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof applications.$inferSelect & { job?: typeof jobs.$inferSelect, candidate?: typeof users.$inferSelect }>()),
      },
    },
    updateStatus: {
      method: "PATCH" as const,
      path: "/api/applications/:id/status" as const,
      input: z.object({
        status: z.enum(["pending", "reviewed", "interview", "offered", "rejected"]),
      }),
      responses: {
        200: z.custom<typeof applications.$inferSelect>(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
  },
  stats: {
    get: {
      method: "GET" as const,
      path: "/api/admin/stats" as const,
      responses: {
        200: z.object({
          totalUsers: z.number(),
          totalJobs: z.number(),
          totalApplications: z.number(),
          activeJobs: z.number(),
        }),
        401: errorSchemas.unauthorized,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
