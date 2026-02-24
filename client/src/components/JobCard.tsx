import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Banknote, Calendar, Target } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/hooks/use-auth";
import { useApplications } from "@/hooks/use-applications";
import { calculateMatchScore } from "@/lib/utils";
import { ApplicationDialog } from "./ApplicationDialog";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import type { Application, Job } from "@shared/schema";

export function JobCard({ job }: { job: Job }) {
  const { data: user } = useUser();
  const { data: applications } = useApplications();
  
  const application = applications?.find((a: Application) => a.jobId === job.id);
  const isApplied = !!application;

  const matchScore = user?.role === "job_seeker"
    ? calculateMatchScore(user.skills, job.skills, user.title, job.title)
    : 0;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-2xl border bg-card/50 backdrop-blur-sm p-6 shadow-sm transition-all hover:shadow-xl hover:border-primary/20 ring-1 ring-black/5"
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold">
              {job.type}
            </span>
            {job.postedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}
              </span>
            )}
            {user?.role === "job_seeker" && matchScore > 0 && (
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 flex items-center gap-1 px-2 py-0.5">
                <Target className="h-3 w-3" />
                {matchScore}% Match
              </Badge>
            )}
            {isApplied && (
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 flex items-center gap-1 font-bold px-2 py-0.5">
                Applied: {application.status}
              </Badge>
            )}
          </div>
          <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            {job.title}
          </h3>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="p-1 rounded-md bg-primary/5">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium">{job.company}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="p-1 rounded-md bg-primary/5">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="p-1 rounded-md bg-primary/5">
                <Banknote className="h-4 w-4 text-primary" />
              </div>
              <span className="font-semibold text-foreground/80">
                {job.salaryMin !== null && job.salaryMax !== null ? (
                  <span>${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}</span>
                ) : job.salaryMin !== null || job.salaryMax !== null ? (
                  <span>${(job.salaryMin ?? job.salaryMax)?.toLocaleString()}</span>
                ) : (
                  <span>Salary not specified</span>
                )}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {user?.role === "job_seeker" && job.status === "open" && !isApplied && (
            <ApplicationDialog jobId={job.id} jobTitle={job.title} />
          )}
          <Link href={`/jobs/${job.id}`}>
            <Button 
              className="w-full md:w-auto rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-95" 
              variant={isApplied ? "outline" : "default"}
            >
              {isApplied ? "Review Application" : "View Details"}
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
