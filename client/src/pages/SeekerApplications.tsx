import { Navbar } from "@/components/Navbar";
import { useApplications } from "@/hooks/use-applications";
import { useUser } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, Building2, MapPin, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { StatusStepper } from "@/components/StatusStepper";
import { Link } from "wouter";
import { type Application, type Job } from "@shared/schema";

type ApplicationWithJob = Application & { job: Job };

export default function SeekerApplications() {
  const { data: user } = useUser();
  const { data: applications, isLoading } = useApplications();

  if (user?.role !== "job_seeker") return <div>Access Denied</div>;

  const getStatusVariant = (status: string) => {
    switch(status) {
      case 'offered': return 'default'; // Success green in many themes
      case 'rejected': return 'destructive';
      case 'interview': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <div className="container py-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display">My Applications</h1>
            <p className="text-muted-foreground">Track your journey with potential employers</p>
          </div>
          <Badge variant="outline" className="w-fit h-fit px-4 py-1">
            {applications?.length || 0} Total Applications
          </Badge>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="h-32 animate-pulse bg-muted/20" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6">
            {applications?.map((app: ApplicationWithJob) => (
              <Card key={app.id} className="group overflow-hidden transition-all hover:shadow-md border-muted/60">
                <div className="flex flex-col">
                  {/* Card Header & Info */}
                  <div className="p-6 pb-2">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                      <div className="space-y-1">
                        <Link href={`/jobs/${app.jobId}`}>
                          <h3 className="text-xl font-bold font-display group-hover:text-primary transition-colors cursor-pointer flex items-center gap-2">
                            {app.job?.title}
                            <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                          </h3>
                        </Link>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="h-4 w-4" />
                            <span className="font-medium text-foreground/80">{app.job?.company}</span>
                          </div>
                          <div className="flex items-center gap-1.5 border-l md:pl-4">
                            <MapPin className="h-4 w-4" />
                            {app.job?.location}
                          </div>
                          <div className="flex items-center gap-1.5 border-l md:pl-4">
                            <Calendar className="h-4 w-4" />
                            Applied {app.appliedAt && format(new Date(app.appliedAt), "MMM d, yyyy")}
                          </div>
                        </div>
                      </div>
                      
                      <Badge variant={getStatusVariant(app.status)} className="capitalize px-4 py-1 text-xs font-bold tracking-wider">
                        {app.status}
                      </Badge>
                    </div>

                    <div className="bg-muted/30 rounded-xl p-8 mb-4">
                      <StatusStepper status={app.status as any} />
                    </div>
                  </div>
                  
                  {/* Card Footer/Actions */}
                  <div className="bg-muted/10 px-6 py-3 border-t flex justify-between items-center text-xs text-muted-foreground">
                    <span>Application ID: #{app.id}</span>
                    <Link href={`/jobs/${app.jobId}`}>
                      <span className="font-semibold text-primary cursor-pointer hover:underline">View Job Description</span>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}

            {applications?.length === 0 && (
              <div className="text-center py-20 px-4 bg-muted/10 rounded-2xl border-2 border-dashed border-muted/50">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-bold text-xl mb-2 font-display">No applications yet</h3>
                <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                  You haven't applied to any jobs yet. Browse our job board to find your next great opportunity!
                </p>
                <Link href="/jobs">
                  <span className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 cursor-pointer">
                    Browse Jobs
                  </span>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
