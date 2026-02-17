import { Link } from "wouter";
import { type Job } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Banknote, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function JobCard({ job }: { job: Job }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
            <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
              {job.type}
            </span>
            {job.postedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}
              </span>
            )}
          </div>
          <h3 className="font-display text-xl font-bold tracking-tight text-foreground">
            {job.title}
          </h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Building2 className="h-4 w-4 text-primary" />
              {job.company}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-primary" />
              {job.location}
            </div>
            <div className="flex items-center gap-1">
              <Banknote className="h-4 w-4 text-primary" />
              ${job.salary.toLocaleString()}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Link href={`/jobs/${job.id}`}>
            <Button className="w-full md:w-auto">View Details</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
