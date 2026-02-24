import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useRecruiterStats() {
  return useQuery({
    queryKey: [api.recruiter.stats.path],
    queryFn: async () => {
      const res = await fetch(api.recruiter.stats.path);
      if (!res.ok) {
        if (res.status === 401) return null;
        throw new Error("Failed to fetch recruiter stats");
      }
      return res.json() as Promise<{
        totalJobs: number;
        totalApplications: number;
        activeListings: number;
        statusDistribution: { status: string; count: number }[];
        topJobs: { title: string; count: number }[];
      }>;
    },
  });
}
