import { Link } from "wouter";
import { Button } from "@/components/ui/button.jsx";
import { Building2, MapPin, Banknote, Calendar, Target } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/hooks/use-auth.js";
import { useApplications } from "@/hooks/use-applications.js";
import { calculateMatchScore } from "@/lib/utils.js";
import { ApplicationDialog } from "./ApplicationDialog.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { motion } from "framer-motion";

export function JobCard({ job }) {
  const { data: user } = useUser();
  const { data: applications } = useApplications();
  
  const application = applications?.find((a) => a.jobId === job.id);
  const isApplied = !!application;

  const matchScore = user?.role === "job_seeker"
    ? calculateMatchScore(user.skills, job.skills, user.title, job.title)
    : 0;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
      className="group relative overflow-hidden rounded-[2.5rem] p-8 glass-card border-white/20 dark:border-white/5 shadow-2xl shadow-primary/5 transition-all hover:shadow-primary/10 hover:border-primary/30"
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-5 py-1.5 rounded-2xl bg-primary/10 text-primary text-xs font-black uppercase tracking-widest border border-primary/20">
              {job.type}
            </span>
            {job.postedAt && (
              <span className="flex items-center gap-2 text-xs font-bold text-muted-foreground/60 uppercase tracking-wider">
                <Calendar className="h-3.5 w-3.5" />
                {formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}
              </span>
            )}
            {user?.role === "job_seeker" && matchScore > 0 && (
              <Badge variant="outline" className="bg-primary group-hover:bg-primary-foreground group-hover:text-primary transition-colors text-primary-foreground border-none font-black flex items-center gap-2 px-3 py-1 rounded-full shadow-lg shadow-primary/20">
                <Target className="h-3.5 w-3.5" />
                {matchScore}% Match
              </Badge>
            )}
            {isApplied && (
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-none flex items-center gap-2 font-black px-4 py-1.5 rounded-full uppercase tracking-tighter text-[10px]">
                Applied: {application.status}
              </Badge>
            )}
          </div>
          
          <h3 className="font-display text-2xl md:text-3xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors leading-tight">
            {job.title}
          </h3>
          
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-muted-foreground font-semibold">
            <div className="flex items-center gap-3 group/company">
              <div className="p-2.5 rounded-2xl bg-primary/10 text-primary group-hover/company:bg-primary group-hover/company:text-primary-foreground transition-all duration-300">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="text-foreground/80 tracking-tight">{job.company}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-accent/10 text-accent">
                <MapPin className="h-5 w-5" />
              </div>
              <span className="tracking-tight">{job.location}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500">
                <Banknote className="h-5 w-5" />
              </div>
              <span className="text-foreground font-black tracking-tight">
                {job.salaryMin !== null && job.salaryMax !== null ? (
                  <span>${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}</span>
                ) : job.salaryMin !== null || job.salaryMax !== null ? (
                  <span>${(job.salaryMin ?? job.salaryMax)?.toLocaleString()}</span>
                ) : (
                  <span className="opacity-50 font-medium">Salary not specified</span>
                )}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:items-end gap-4 min-w-[160px]">
          <Link href={`/jobs/${job.id}`}>
            <Button 
              size="lg"
              className="w-full md:w-auto rounded-2xl font-black text-md h-14 px-8 shadow-xl shadow-primary/10 hover:shadow-primary/30 transition-all group/btn" 
              variant={isApplied ? "outline" : "default"}
            >
              {isApplied ? "Review App" : "View Details"}
            </Button>
          </Link>
          {user?.role === "job_seeker" && job.status === "open" && !isApplied && (
            <ApplicationDialog jobId={job.id} jobTitle={job.title} />
          )}
        </div>
      </div>
    </motion.div>
  );
}

