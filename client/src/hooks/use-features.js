import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast.js";

// Fetch notifications
export function useNotifications() {
  return useQuery({
    queryKey: ["/api/notifications"],
    queryFn: async () => {
      const res = await fetch("/api/notifications");
      if (!res.ok) throw new Error("Failed to fetch notifications");
      return res.json();
    },
    refetchInterval: 30000, // Poll every 30s
  });
}

// Mark a single notification as read
export function useMarkRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });
}

// Mark all as read
export function useMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await fetch("/api/notifications/read-all", { method: "PATCH" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });
}

// Recommended jobs
export function useRecommendedJobs() {
  return useQuery({
    queryKey: ["/api/jobs/recommended"],
    queryFn: async () => {
      const res = await fetch("/api/jobs/recommended");
      if (!res.ok) return [];
      return res.json();
    },
  });
}

// Update candidate notes (recruiter)
export function useUpdateNotes() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, notes }) => {
      const res = await fetch(`/api/applications/${id}/notes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      if (!res.ok) throw new Error("Failed to save notes");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      toast({ title: "Notes saved" });
    },
    onError: () => toast({ title: "Failed to save notes", variant: "destructive" }),
  });
}

// Schedule interview
export function useScheduleInterview() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, interviewDate }) => {
      const res = await fetch(`/api/applications/${id}/interview`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interviewDate }),
      });
      if (!res.ok) throw new Error("Failed to schedule interview");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      toast({ title: "Interview scheduled!", description: "The candidate will be notified." });
    },
    onError: () => toast({ title: "Failed to schedule interview", variant: "destructive" }),
  });
}

// Bulk status update
export function useBulkUpdateStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ ids, status }) => {
      const res = await fetch("/api/applications/bulk-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, status }),
      });
      if (!res.ok) throw new Error("Failed to bulk update");
      return res.json();
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      toast({ title: `Updated ${vars.ids.length} applications to "${vars.status}"` });
    },
    onError: () => toast({ title: "Bulk update failed", variant: "destructive" }),
  });
}
