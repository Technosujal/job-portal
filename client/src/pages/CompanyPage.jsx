import { useRoute, Link } from "wouter";
import { Navbar } from "@/components/Navbar.jsx";
import { useUser } from "@/hooks/use-auth.js";
import { useJobs } from "@/hooks/use-jobs.js";
import { JobCard } from "@/components/JobCard.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Building2, MapPin, Globe, Briefcase, Users, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function CompanyPage() {
  const [, params] = useRoute("/company/:id");
  const recruiterId = params?.id;

  // Fetch all jobs and filter by this recruiter
  const { data: allJobs, isLoading } = useJobs({});
  const recruiterJobs = allJobs?.filter(j => j.recruiterId === recruiterId && j.status === "open") || [];

  // Get recruiter info from the first job
  const recruiter = recruiterJobs[0]
    ? {
        name: recruiterJobs[0].company,
        company: recruiterJobs[0].company,
        location: recruiterJobs[0].location,
      }
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-muted-foreground animate-pulse font-bold">Loading company...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <Navbar />

      {/* Hero */}
      <div className="relative overflow-hidden pt-40 pb-32 bg-muted/10 border-b border-white/10">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[50%] h-full bg-primary/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-accent/5 blur-[100px] rounded-full" />
        </div>

        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-start md:items-center gap-8"
          >
            {/* Company Logo Placeholder */}
            <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-black text-white shadow-2xl shadow-primary/30 border-2 border-white/20">
              {(recruiter?.company || "?")[0].toUpperCase()}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-primary">
                <Building2 className="h-4 w-4" />
                <span className="text-xs font-black uppercase tracking-[0.3em]">Company Profile</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-display font-black tracking-tighter">
                {recruiter?.company || "Company"}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-medium">
                {recruiter?.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {recruiter.location}
                  </span>
                )}
                <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 px-3 py-1 rounded-full font-black">
                  <Briefcase className="h-3.5 w-3.5 mr-1.5" />
                  {recruiterJobs.length} Open Positions
                </Badge>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Open Jobs */}
      <div className="container px-4 md:px-6 py-20 space-y-12">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <h2 className="text-3xl font-display font-black tracking-tighter">
            Open Positions
          </h2>
        </div>

        {recruiterJobs.length === 0 ? (
          <div className="text-center py-24 glass-card rounded-[4rem] border-dashed border-4 border-muted/30">
            <Building2 className="h-16 w-16 mx-auto mb-6 text-muted-foreground opacity-20" />
            <h3 className="font-black text-2xl mb-3 font-display">No Open Positions</h3>
            <p className="text-muted-foreground">This company has no open roles right now.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {recruiterJobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <JobCard job={job} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
